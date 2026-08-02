/**
 * Tool executor — runs tool calls against MongoDB directly via Mongoose.
 * Enforces strict tenant isolation by scoping all queries to req.admin._id.
 */

const mongoose = require('mongoose');

// ── Helpers ──────────────────────────────────────────────────────────────

function parseDate(dateStr, defaultOffsetDays) {
  if (dateStr) {
    const d = new Date(dateStr);
    if (!isNaN(d.getTime())) return d;
  }
  const d = new Date();
  d.setDate(d.getDate() + defaultOffsetDays);
  d.setHours(0, 0, 0, 0);
  return d;
}

function endOfDay(date) {
  const d = new Date(date);
  d.setHours(23, 59, 59, 999);
  return d;
}

// ── Tool Implementations ─────────────────────────────────────────────────

async function getExpenses({ start_date, end_date, category } = {}, adminId) {
  const Expense = mongoose.model('Expense');
  const start = parseDate(start_date, -30);
  const end = endOfDay(parseDate(end_date, 0));

  const query = {
    removed: false,
    date: { $gte: start, $lte: end },
  };
  if (adminId) query.createdBy = adminId;
  if (category) query.category = category;

  const expenses = await Expense.find(query).sort({ date: -1 }).lean();

  const total = expenses.reduce((sum, e) => sum + (e.amount || 0), 0);

  // Summarize by category
  const byCategory = {};
  for (const e of expenses) {
    const cat = e.category || 'Miscellaneous';
    byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
  }

  // Sort by spend descending
  const sortedCategories = Object.entries(byCategory)
    .sort((a, b) => b[1] - a[1])
    .reduce((obj, [k, v]) => ({ ...obj, [k]: Math.round(v * 100) / 100 }), {});

  return {
    total_expenses: Math.round(total * 100) / 100,
    count: expenses.length,
    period: `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
    by_category: sortedCategories,
    expenses: expenses.map((e) => ({
      vendor: e.vendor,
      amount: e.amount,
      category: e.category,
      date: e.date,
      description: e.description || '',
    })),
  };
}

async function getIncome({ start_date, end_date } = {}, adminId) {
  const Invoice = mongoose.model('Invoice');
  const start = parseDate(start_date, -30);
  const end = endOfDay(parseDate(end_date, 0));

  const query = {
    removed: false,
    paymentStatus: 'paid',
    date: { $gte: start, $lte: end },
  };
  if (adminId) query.createdBy = adminId;

  const invoices = await Invoice.find(query)
    .populate('client')
    .sort({ date: -1 })
    .lean();

  const total = invoices.reduce((sum, inv) => sum + (inv.total || 0), 0);

  return {
    total_income: Math.round(total * 100) / 100,
    count: invoices.length,
    period: `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
    invoices: invoices.map((inv) => ({
      client: inv.client?.name || 'Unknown',
      total: inv.total,
      date: inv.date,
      items: (inv.items || []).map((item) => item.itemName || ''),
    })),
  };
}

async function getCashFlowSummary({ start_date, end_date } = {}, adminId) {
  const incomeData = await getIncome({ start_date, end_date }, adminId);
  const expenseData = await getExpenses({ start_date, end_date }, adminId);

  const totalIncome = incomeData.total_income;
  const totalExpenses = expenseData.total_expenses;
  const net = Math.round((totalIncome - totalExpenses) * 100) / 100;

  return {
    period: incomeData.period,
    total_income: totalIncome,
    total_expenses: totalExpenses,
    net_cash_flow: net,
    status: net > 0 ? 'positive' : net < 0 ? 'negative' : 'break-even',
    income_count: incomeData.count,
    expense_count: expenseData.count,
    expense_breakdown: expenseData.by_category,
  };
}

async function getOverdueInvoices(args, adminId) {
  const Invoice = mongoose.model('Invoice');
  const now = new Date();

  const query = {
    removed: false,
    paymentStatus: { $in: ['unpaid', 'partially'] },
    expiredDate: { $lt: now },
  };
  if (adminId) query.createdBy = adminId;

  const invoices = await Invoice.find(query)
    .populate('client')
    .sort({ expiredDate: 1 })
    .lean();

  const overdue = invoices.map((inv) => {
    const expiredDate = new Date(inv.expiredDate);
    const daysOverdue = Math.floor((now - expiredDate) / (1000 * 60 * 60 * 24));
    return {
      client: inv.client?.name || 'Unknown',
      invoice_number: inv.number,
      total: inv.total,
      due_date: inv.expiredDate,
      days_overdue: daysOverdue,
      payment_status: inv.paymentStatus,
      amount_remaining: Math.round((inv.total - (inv.credit || 0)) * 100) / 100,
    };
  });

  overdue.sort((a, b) => b.days_overdue - a.days_overdue);
  const totalOutstanding = overdue.reduce((sum, item) => sum + item.amount_remaining, 0);

  return {
    count: overdue.length,
    total_outstanding: Math.round(totalOutstanding * 100) / 100,
    invoices: overdue,
  };
}

async function getTopVendors({ start_date, end_date, limit = 5 } = {}, adminId) {
  const Expense = mongoose.model('Expense');
  const start = parseDate(start_date, -90);
  const end = endOfDay(parseDate(end_date, 0));

  const matchQuery = {
    removed: false,
    date: { $gte: start, $lte: end },
  };
  if (adminId) {
    matchQuery.createdBy = mongoose.Types.ObjectId.isValid(adminId)
      ? new mongoose.Types.ObjectId(adminId)
      : adminId;
  }

  const result = await Expense.aggregate([
    { $match: matchQuery },
    {
      $group: {
        _id: '$vendor',
        total_spend: { $sum: '$amount' },
        transaction_count: { $sum: 1 },
      },
    },
    { $sort: { total_spend: -1 } },
    { $limit: limit },
  ]);

  return {
    period: `${start.toISOString().split('T')[0]} to ${end.toISOString().split('T')[0]}`,
    top_vendors: result.map((r) => ({
      vendor: r._id,
      total_spend: Math.round(r.total_spend * 100) / 100,
      transaction_count: r.transaction_count,
    })),
  };
}

async function proposeCreateInvoice({ client_name, items = [], currency, notes = '', taxRate }, adminId) {
  const Client = mongoose.model('Client');
  const Setting = mongoose.model('Setting');

  const query = {
    name: new RegExp('^' + client_name.trim() + '$', 'i'),
    removed: false,
  };
  if (adminId) query.createdBy = adminId;

  let existingClient = await Client.findOne(query).lean();

  let resolvedTaxRate = taxRate;
  let tenantCurrency = currency;

  if (adminId) {
    if (resolvedTaxRate === undefined || resolvedTaxRate === null) {
      const taxSetting = await Setting.findOne({ settingKey: 'default_tax_rate', createdBy: adminId }).lean();
      if (taxSetting && taxSetting.settingValue !== undefined && taxSetting.settingValue !== '') {
        resolvedTaxRate = Number(taxSetting.settingValue);
      }
    }
    if (!tenantCurrency) {
      const currencySetting = await Setting.findOne({ settingKey: 'default_currency_code', createdBy: adminId }).lean();
      if (currencySetting && currencySetting.settingValue) {
        tenantCurrency = currencySetting.settingValue;
      }
    }
  }

  if (resolvedTaxRate === undefined || resolvedTaxRate === null) resolvedTaxRate = 0;
  if (!tenantCurrency) tenantCurrency = 'USD';

  const Invoice = mongoose.model('Invoice');

  let processedItems = items.map((i) => ({
    itemName: i.itemName || 'Item',
    quantity: Number(i.quantity || 1),
    price: Number(i.price || 0),
    total: Number(i.quantity || 1) * Number(i.price || 0),
  }));

  if (processedItems.length === 0 && existingClient) {
    const existingInvoice = await Invoice.findOne({ client: existingClient._id, removed: false }).sort({ created: -1 }).lean();
    if (existingInvoice && Array.isArray(existingInvoice.items)) {
      processedItems = existingInvoice.items.map((i) => ({
        itemName: i.itemName || 'Item',
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
        total: Number(i.total || (i.quantity * i.price) || 0),
      }));
    }
  }

  const subTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = (subTotal * resolvedTaxRate) / 100;
  const total = subTotal + taxTotal;

  return {
    action_type: 'CREATE_INVOICE',
    client_name: client_name.trim(),
    client_id: existingClient ? existingClient._id.toString() : null,
    client_exists: Boolean(existingClient),
    client_email: existingClient?.email || null,
    currency: tenantCurrency.toUpperCase(),
    items: processedItems,
    subTotal,
    taxRate: resolvedTaxRate,
    taxTotal,
    total,
    notes: notes || 'Created via AI Assistant',
    preview_title: `Invoice for ${client_name} (${tenantCurrency.toUpperCase()} ${total.toLocaleString()})`,
    requires_approval: true,
  };
}

async function proposeCreateClient({ name, email = '', phone = '', address = '' }, adminId) {
  const Client = mongoose.model('Client');

  const query = {
    name: new RegExp('^' + name.trim() + '$', 'i'),
    removed: false,
  };
  if (adminId) query.createdBy = adminId;

  let existingClient = await Client.findOne(query).lean();

  return {
    action_type: 'CREATE_CLIENT',
    name: name.trim(),
    email: email || '',
    phone: phone || '',
    address: address || '',
    client_exists: Boolean(existingClient),
    preview_title: `New Client: ${name}`,
    requires_approval: true,
  };
}

async function proposeCreateQuote({ client_name, items = [], currency, notes = '', taxRate }, adminId) {
  const Client = mongoose.model('Client');
  const Setting = mongoose.model('Setting');

  const query = {
    name: new RegExp('^' + client_name.trim() + '$', 'i'),
    removed: false,
  };
  if (adminId) query.createdBy = adminId;

  let existingClient = await Client.findOne(query).lean();

  let resolvedTaxRate = taxRate;
  let tenantCurrency = currency;

  if (adminId) {
    if (resolvedTaxRate === undefined || resolvedTaxRate === null) {
      const taxSetting = await Setting.findOne({ settingKey: 'default_tax_rate', createdBy: adminId }).lean();
      if (taxSetting && taxSetting.settingValue !== undefined && taxSetting.settingValue !== '') {
        resolvedTaxRate = Number(taxSetting.settingValue);
      }
    }
    if (!tenantCurrency) {
      const currencySetting = await Setting.findOne({ settingKey: 'default_currency_code', createdBy: adminId }).lean();
      if (currencySetting && currencySetting.settingValue) {
        tenantCurrency = currencySetting.settingValue;
      }
    }
  }

  if (resolvedTaxRate === undefined || resolvedTaxRate === null) resolvedTaxRate = 0;
  if (!tenantCurrency) tenantCurrency = 'USD';

  const processedItems = items.map((i) => ({
    itemName: i.itemName || 'Item',
    quantity: Number(i.quantity || 1),
    price: Number(i.price || 0),
    total: Number(i.quantity || 1) * Number(i.price || 0),
  }));

  const subTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = (subTotal * resolvedTaxRate) / 100;
  const total = subTotal + taxTotal;

  return {
    action_type: 'CREATE_QUOTE',
    client_name: client_name.trim(),
    client_id: existingClient ? existingClient._id.toString() : null,
    client_exists: Boolean(existingClient),
    currency: tenantCurrency.toUpperCase(),
    items: processedItems,
    subTotal,
    taxRate: resolvedTaxRate,
    taxTotal,
    total,
    notes,
    preview_title: `Quote for ${client_name} (${tenantCurrency.toUpperCase()} ${total.toLocaleString()})`,
    requires_approval: true,
  };
}

async function proposeCreateExpense({ vendor, amount, category = 'Miscellaneous', date = null, description = '' }) {
  return {
    action_type: 'CREATE_EXPENSE',
    vendor: vendor.trim(),
    amount: Number(amount),
    category,
    date: date || new Date().toISOString().split('T')[0],
    description,
    preview_title: `Expense: ${vendor} (${amount})`,
    requires_approval: true,
  };
}

async function proposeUpdateInvoice({ client_name, invoice_number, status, paymentStatus, taxRate, notes, items }, adminId) {
  const Client = mongoose.model('Client');
  const Invoice = mongoose.model('Invoice');

  const clientQuery = {
    name: new RegExp('^' + client_name.trim() + '$', 'i'),
    removed: false,
  };
  if (adminId) clientQuery.createdBy = adminId;

  let existingClient = await Client.findOne(clientQuery).lean();
  if (!existingClient) {
    return { error: `Client "${client_name}" not found in database.` };
  }

  const invoiceQuery = {
    client: existingClient._id,
    removed: false,
  };
  if (invoice_number) invoiceQuery.number = Number(invoice_number);
  if (adminId) invoiceQuery.createdBy = adminId;

  let invoice = await Invoice.findOne(invoiceQuery).sort({ created: -1 }).lean();
  if (!invoice) {
    return { error: `No invoice found for client "${client_name}".` };
  }

  let updatedItems = items && items.length > 0 ? items : invoice.items || [];
  let resolvedTaxRate = taxRate !== undefined ? Number(taxRate) : (invoice.taxRate || 0);

  const processedItems = updatedItems.map((i) => ({
    itemName: i.itemName || 'Item',
    quantity: Number(i.quantity || 1),
    price: Number(i.price || 0),
    total: Number(i.quantity || 1) * Number(i.price || 0),
  }));

  const subTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = (subTotal * resolvedTaxRate) / 100;
  const total = subTotal + taxTotal;

  return {
    action_type: 'UPDATE_INVOICE',
    invoice_id: invoice._id.toString(),
    client_name: client_name.trim(),
    invoice_number: invoice.number,
    status: status || invoice.status,
    paymentStatus: paymentStatus || invoice.paymentStatus,
    items: processedItems,
    subTotal,
    taxRate: resolvedTaxRate,
    taxTotal,
    total,
    notes: notes || invoice.notes || '',
    currency: invoice.currency || 'USD',
    preview_title: `Update Invoice #${invoice.number} for ${client_name} (Status: ${status || invoice.status}, Payment: ${paymentStatus || invoice.paymentStatus})`,
    requires_approval: true,
  };
}

async function proposeUpdateQuote({ client_name, quote_number, status, taxRate, notes, items }, adminId) {
  const Client = mongoose.model('Client');
  const Quote = mongoose.model('Quote');

  const clientQuery = {
    name: new RegExp('^' + client_name.trim() + '$', 'i'),
    removed: false,
  };
  if (adminId) clientQuery.createdBy = adminId;

  let existingClient = await Client.findOne(clientQuery).lean();
  if (!existingClient) return { error: `Client "${client_name}" not found.` };

  const quoteQuery = { client: existingClient._id, removed: false };
  if (quote_number) quoteQuery.number = Number(quote_number);
  if (adminId) quoteQuery.createdBy = adminId;

  let quote = await Quote.findOne(quoteQuery).sort({ created: -1 }).lean();
  if (!quote) return { error: `No quote found for client "${client_name}".` };

  let updatedItems = items && items.length > 0 ? items : quote.items || [];
  let resolvedTaxRate = taxRate !== undefined ? Number(taxRate) : (quote.taxRate || 0);

  const processedItems = updatedItems.map((i) => ({
    itemName: i.itemName || 'Item',
    quantity: Number(i.quantity || 1),
    price: Number(i.price || 0),
    total: Number(i.quantity || 1) * Number(i.price || 0),
  }));

  const subTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = (subTotal * resolvedTaxRate) / 100;
  const total = subTotal + taxTotal;

  return {
    action_type: 'UPDATE_QUOTE',
    quote_id: quote._id.toString(),
    client_name: client_name.trim(),
    quote_number: quote.number,
    status: status || quote.status,
    items: processedItems,
    subTotal,
    taxRate: resolvedTaxRate,
    taxTotal,
    total,
    notes: notes || quote.notes || '',
    currency: quote.currency || 'USD',
    preview_title: `Update Quote #${quote.number} for ${client_name} (Status: ${status || quote.status})`,
    requires_approval: true,
  };
}

async function proposeConvertQuoteToInvoice({ client_name, quote_number }, adminId) {
  const Client = mongoose.model('Client');
  const Quote = mongoose.model('Quote');

  const clientQuery = { name: new RegExp('^' + client_name.trim() + '$', 'i'), removed: false };
  if (adminId) clientQuery.createdBy = adminId;

  let existingClient = await Client.findOne(clientQuery).lean();
  if (!existingClient) return { error: `Client "${client_name}" not found.` };

  const quoteQuery = { client: existingClient._id, removed: false };
  if (quote_number) quoteQuery.number = Number(quote_number);
  if (adminId) quoteQuery.createdBy = adminId;

  let quote = await Quote.findOne(quoteQuery).sort({ created: -1 }).lean();
  if (!quote) return { error: `No quote found for client "${client_name}".` };

  return {
    action_type: 'CONVERT_QUOTE',
    quote_id: quote._id.toString(),
    client_name: client_name.trim(),
    quote_number: quote.number,
    total: quote.total,
    currency: quote.currency || 'USD',
    preview_title: `Convert Quote #${quote.number} to Invoice for ${client_name}`,
    requires_approval: true,
  };
}

async function proposeRecordPayment({ client_name, amount, payment_mode = 'Bank Transfer' }, adminId) {
  const Client = mongoose.model('Client');
  const Invoice = mongoose.model('Invoice');

  const clientQuery = { name: new RegExp('^' + client_name.trim() + '$', 'i'), removed: false };
  if (adminId) clientQuery.createdBy = adminId;

  let existingClient = await Client.findOne(clientQuery).lean();
  if (!existingClient) return { error: `Client "${client_name}" not found.` };

  const invoiceQuery = { client: existingClient._id, removed: false };
  if (adminId) invoiceQuery.createdBy = adminId;

  let invoice = await Invoice.findOne(invoiceQuery).sort({ created: -1 }).lean();

  return {
    action_type: 'RECORD_PAYMENT',
    client_id: existingClient._id.toString(),
    client_name: client_name.trim(),
    invoice_id: invoice ? invoice._id.toString() : null,
    invoice_number: invoice ? invoice.number : null,
    amount: Number(amount),
    payment_mode,
    currency: invoice?.currency || 'USD',
    preview_title: `Record Payment of ${amount} from ${client_name} (${payment_mode})`,
    requires_approval: true,
  };
}

async function proposeUpdateClient({ name, email, phone, address }, adminId) {
  const Client = mongoose.model('Client');
  const query = { name: new RegExp('^' + name.trim() + '$', 'i'), removed: false };
  if (adminId) query.createdBy = adminId;

  let existingClient = await Client.findOne(query).lean();
  if (!existingClient) return { error: `Client "${name}" not found.` };

  return {
    action_type: 'UPDATE_CLIENT',
    client_id: existingClient._id.toString(),
    name: name.trim(),
    email: email !== undefined ? email : existingClient.email,
    phone: phone !== undefined ? phone : existingClient.phone,
    address: address !== undefined ? address : existingClient.address,
    preview_title: `Update Client Profile: ${name}`,
    requires_approval: true,
  };
}

async function proposeDeleteRecord({ entity, client_name, number }, adminId) {
  const modelNameMap = {
    invoice: 'Invoice',
    quote: 'Quote',
    client: 'Client',
    expense: 'Expense',
    payment: 'Payment',
  };

  const Model = mongoose.model(modelNameMap[entity] || 'Invoice');
  let targetQuery = { removed: false };
  if (adminId) targetQuery.createdBy = adminId;

  if (client_name && entity !== 'client') {
    const Client = mongoose.model('Client');
    let c = await Client.findOne({ name: new RegExp('^' + client_name.trim() + '$', 'i'), removed: false, createdBy: adminId }).lean();
    if (c) targetQuery.client = c._id;
  } else if (client_name && entity === 'client') {
    targetQuery.name = new RegExp('^' + client_name.trim() + '$', 'i');
  }

  if (number) targetQuery.number = Number(number);

  let doc = await Model.findOne(targetQuery).sort({ created: -1 }).lean();
  if (!doc) return { error: `No matching ${entity} record found to delete.` };

  return {
    action_type: 'DELETE_RECORD',
    entity,
    record_id: doc._id.toString(),
    record_name: client_name || doc.name || doc.number || 'Record',
    preview_title: `Delete ${entity.toUpperCase()}: ${client_name || doc.number || doc._id.toString()}`,
    requires_approval: true,
  };
}

// ── Dispatch ─────────────────────────────────────────────────────────────

const TOOL_HANDLERS = {
  get_expenses: getExpenses,
  get_income: getIncome,
  get_cash_flow_summary: getCashFlowSummary,
  get_overdue_invoices: getOverdueInvoices,
  get_top_vendors: getTopVendors,
  propose_create_invoice: proposeCreateInvoice,
  propose_create_client: proposeCreateClient,
  propose_create_quote: proposeCreateQuote,
  propose_create_expense: proposeCreateExpense,
  propose_update_invoice: proposeUpdateInvoice,
  propose_update_quote: proposeUpdateQuote,
  propose_convert_quote_to_invoice: proposeConvertQuoteToInvoice,
  propose_record_payment: proposeRecordPayment,
  propose_update_client: proposeUpdateClient,
  propose_delete_record: proposeDeleteRecord,
};

async function executeTool(toolName, args, adminId) {
  const handler = TOOL_HANDLERS[toolName];
  if (!handler) {
    return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }

  try {
    const result = await handler(args, adminId);
    return JSON.stringify(result, null, 0);
  } catch (err) {
    return JSON.stringify({ error: `Tool execution failed: ${err.message}` });
  }
}

module.exports = { executeTool, getExpenses, getIncome, getOverdueInvoices };
