/**
 * Read-only financial query tool executors (Expenses, Income, Cash Flow, Overdue Invoices, Vendors, Tax Variants).
 */

const mongoose = require('mongoose');
const { parseDate, endOfDay } = require('./executorHelpers');

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

  const byCategory = {};
  for (const e of expenses) {
    const cat = e.category || 'Miscellaneous';
    byCategory[cat] = (byCategory[cat] || 0) + (e.amount || 0);
  }

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

async function getTaxVariants(args, adminId) {
  const Taxes = mongoose.model('Taxes');
  const query = { removed: false };
  if (adminId) {
    query.createdBy = mongoose.Types.ObjectId.isValid(adminId)
      ? new mongoose.Types.ObjectId(adminId)
      : adminId;
  }

  const taxes = await Taxes.find(query).lean();
  return {
    count: taxes.length,
    tax_variants: taxes.map((t) => ({
      name: t.taxName,
      value: t.taxValue,
      isDefault: Boolean(t.isDefault),
    })),
  };
}

module.exports = {
  getExpenses,
  getIncome,
  getCashFlowSummary,
  getOverdueInvoices,
  getTopVendors,
  getTaxVariants,
};
