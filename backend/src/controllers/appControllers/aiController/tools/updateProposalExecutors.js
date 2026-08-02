/**
 * Update/Delete proposal executors (Invoices, Quotes, Payments, Clients, Record Deletions).
 */

const mongoose = require('mongoose');

async function proposeUpdateInvoice({ client_name, invoice_number, status, paymentStatus, taxRate, notes, items }, adminId) {
  const Client = mongoose.model('Client');
  const Invoice = mongoose.model('Invoice');

  const clientQuery = { name: new RegExp('^' + client_name.trim() + '$', 'i'), removed: false };
  if (adminId) clientQuery.createdBy = adminId;

  let existingClient = await Client.findOne(clientQuery).lean();
  if (!existingClient) return { error: `Client "${client_name}" not found in database.` };

  const invoiceQuery = { client: existingClient._id, removed: false };
  if (invoice_number) invoiceQuery.number = Number(invoice_number);
  if (adminId) invoiceQuery.createdBy = adminId;

  let invoice = await Invoice.findOne(invoiceQuery).sort({ created: -1 }).lean();
  if (!invoice) return { error: `No invoice found for client "${client_name}".` };

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
  const clientQuery = { name: new RegExp('^' + client_name.trim() + '$', 'i'), removed: false };
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
  const modelNameMap = { invoice: 'Invoice', quote: 'Quote', client: 'Client', expense: 'Expense', payment: 'Payment' };
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

module.exports = {
  proposeUpdateInvoice,
  proposeUpdateQuote,
  proposeConvertQuoteToInvoice,
  proposeRecordPayment,
  proposeUpdateClient,
  proposeDeleteRecord,
};
