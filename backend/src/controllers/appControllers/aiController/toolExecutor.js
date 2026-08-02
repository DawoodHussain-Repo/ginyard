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
