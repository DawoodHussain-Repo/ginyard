/**
 * Read-only document query executors (Quotes and Invoices).
 */

const mongoose = require('mongoose');

function buildTenantQuery(adminId) {
  const query = { removed: false };
  if (adminId) {
    const adminIdStr = adminId.toString();
    query.$or = [
      { createdBy: mongoose.Types.ObjectId.isValid(adminIdStr) ? new mongoose.Types.ObjectId(adminIdStr) : adminIdStr },
      { createdBy: adminIdStr },
      { createdBy: { $exists: false } },
      { createdBy: null },
    ];
  }
  return query;
}

async function getQuotes({ client_name, status, limit = 5 } = {}, adminId) {
  const Quote = mongoose.model('Quote');
  const query = buildTenantQuery(adminId);

  if (status) query.status = status;

  if (client_name) {
    const Client = mongoose.model('Client');
    const clientDoc = await Client.findOne({
      name: new RegExp('^' + client_name.trim() + '$', 'i'),
      removed: false,
    }).lean();
    if (clientDoc) query.client = clientDoc._id;
  }

  const quotes = await Quote.find(query)
    .populate('client')
    .sort({ created: -1 })
    .limit(limit)
    .lean();

  return {
    count: quotes.length,
    quotes: quotes.map((q) => ({
      number: q.number,
      client: q.client?.name || 'Unknown',
      total: q.total,
      status: q.status,
      date: q.date,
      created: q.created,
      items: (q.items || []).map((i) => ({
        itemName: i.itemName,
        quantity: i.quantity,
        price: i.price,
        total: i.total,
      })),
    })),
  };
}

async function getInvoices({ client_name, status, paymentStatus, limit = 5 } = {}, adminId) {
  const Invoice = mongoose.model('Invoice');
  const query = buildTenantQuery(adminId);

  if (status) query.status = status;
  if (paymentStatus) query.paymentStatus = paymentStatus;

  if (client_name) {
    const Client = mongoose.model('Client');
    const clientDoc = await Client.findOne({
      name: new RegExp('^' + client_name.trim() + '$', 'i'),
      removed: false,
    }).lean();
    if (clientDoc) query.client = clientDoc._id;
  }

  const invoices = await Invoice.find(query)
    .populate('client')
    .sort({ created: -1 })
    .limit(limit)
    .lean();

  return {
    count: invoices.length,
    invoices: invoices.map((inv) => ({
      number: inv.number,
      client: inv.client?.name || 'Unknown',
      total: inv.total,
      status: inv.status,
      paymentStatus: inv.paymentStatus,
      date: inv.date,
      created: inv.created,
      items: (inv.items || []).map((i) => ({
        itemName: i.itemName,
        quantity: i.quantity,
        price: i.price,
        total: i.total,
      })),
    })),
  };
}

module.exports = {
  getQuotes,
  getInvoices,
};
