/**
 * Tool executor — runs tool calls against MongoDB directly via Mongoose.
 * No HTTP overhead, no separate service — queries the same DB the backend uses.
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

async function getExpenses({ start_date, end_date, category } = {}) {
  const Expense = mongoose.model('Expense');
  const start = parseDate(start_date, -30);
  const end = endOfDay(parseDate(end_date, 0));

  const query = {
    removed: false,
    date: { $gte: start, $lte: end },
  };
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

async function getIncome({ start_date, end_date } = {}) {
  const Invoice = mongoose.model('Invoice');
  const start = parseDate(start_date, -30);
  const end = endOfDay(parseDate(end_date, 0));

  const invoices = await Invoice.find({
    removed: false,
    paymentStatus: 'paid',
    date: { $gte: start, $lte: end },
  })
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

async function getCashFlowSummary({ start_date, end_date } = {}) {
  const incomeData = await getIncome({ start_date, end_date });
  const expenseData = await getExpenses({ start_date, end_date });

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

async function getOverdueInvoices() {
  const Invoice = mongoose.model('Invoice');
  const now = new Date();

  const invoices = await Invoice.find({
    removed: false,
    paymentStatus: { $in: ['unpaid', 'partially'] },
    expiredDate: { $lt: now },
  })
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

async function getTopVendors({ start_date, end_date, limit = 5 } = {}) {
  const Expense = mongoose.model('Expense');
  const start = parseDate(start_date, -90);
  const end = endOfDay(parseDate(end_date, 0));

  const result = await Expense.aggregate([
    {
      $match: {
        removed: false,
        date: { $gte: start, $lte: end },
      },
    },
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

// ── Dispatch ─────────────────────────────────────────────────────────────

const TOOL_HANDLERS = {
  get_expenses: getExpenses,
  get_income: getIncome,
  get_cash_flow_summary: getCashFlowSummary,
  get_overdue_invoices: getOverdueInvoices,
  get_top_vendors: getTopVendors,
};

async function executeTool(toolName, args) {
  const handler = TOOL_HANDLERS[toolName];
  if (!handler) {
    return JSON.stringify({ error: `Unknown tool: ${toolName}` });
  }

  try {
    const result = await handler(args);
    return JSON.stringify(result, null, 0);
  } catch (err) {
    return JSON.stringify({ error: `Tool execution failed: ${err.message}` });
  }
}

module.exports = { executeTool, getExpenses, getIncome, getOverdueInvoices };
