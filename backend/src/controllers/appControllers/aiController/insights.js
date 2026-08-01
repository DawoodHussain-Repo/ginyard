/**
 * Proactive insights generator.
 * Pulls data via the same tool functions and generates spending trends,
 * overdue alerts, and cash flow observations.
 */

const { getExpenses, getIncome, getOverdueInvoices } = require('./toolExecutor');

async function generateInsights() {
  const now = new Date();
  const today = now.toISOString().split('T')[0];

  // Current month
  const monthStart = new Date(now.getFullYear(), now.getMonth(), 1).toISOString().split('T')[0];

  // Previous month
  const prevMonthEnd = new Date(now.getFullYear(), now.getMonth(), 0);
  const prevMonthStart = new Date(prevMonthEnd.getFullYear(), prevMonthEnd.getMonth(), 1)
    .toISOString()
    .split('T')[0];
  const prevMonthEndStr = prevMonthEnd.toISOString().split('T')[0];

  // Fetch data
  const currentExpenses = await getExpenses({ start_date: monthStart, end_date: today });
  const prevExpenses = await getExpenses({
    start_date: prevMonthStart,
    end_date: prevMonthEndStr,
  });
  const currentIncome = await getIncome({ start_date: monthStart, end_date: today });
  const overdue = await getOverdueInvoices();

  const insights = [];

  // ── Expense trend ─────────────────────────────────────────────
  const currTotal = currentExpenses.total_expenses;
  const prevTotal = prevExpenses.total_expenses;

  if (prevTotal > 0) {
    const pctChange = Math.round(((currTotal - prevTotal) / prevTotal) * 1000) / 10;
    if (pctChange > 10) {
      let topCat = '';
      const cats = Object.keys(currentExpenses.by_category || {});
      if (cats.length > 0) {
        topCat = `, mostly driven by ${cats[0]}`;
      }
      insights.push({
        type: 'warning',
        title: 'Spending Up',
        description: `Your expenses are up ${pctChange}% vs last month${topCat}.`,
        metric: `+${pctChange}%`,
      });
    } else if (pctChange < -10) {
      insights.push({
        type: 'success',
        title: 'Spending Down',
        description: `Your expenses decreased ${Math.abs(pctChange)}% compared to last month.`,
        metric: `${pctChange}%`,
      });
    } else {
      insights.push({
        type: 'info',
        title: 'Spending Stable',
        description: `Your expenses are roughly flat vs last month ($${currTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} vs $${prevTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}).`,
        metric: `${pctChange > 0 ? '+' : ''}${pctChange}%`,
      });
    }
  } else if (currTotal > 0) {
    insights.push({
      type: 'info',
      title: 'Expenses This Month',
      description: `You've spent $${currTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} so far this month across ${currentExpenses.count} transactions.`,
      metric: `$${currTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    });
  }

  // ── Overdue invoices ──────────────────────────────────────────
  if (overdue.count > 0) {
    const plural = overdue.count > 1;
    insights.push({
      type: 'warning',
      title: 'Overdue Invoices',
      description: `${overdue.count} invoice${plural ? 's' : ''} ${plural ? 'are' : 'is'} past due, totaling $${overdue.total_outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })} outstanding.`,
      metric: `$${overdue.total_outstanding.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    });
  } else {
    insights.push({
      type: 'success',
      title: 'All Invoices Current',
      description: 'No overdue invoices — all clients are up to date.',
      metric: '0 overdue',
    });
  }

  // ── Cash flow ─────────────────────────────────────────────────
  const incomeTotal = currentIncome.total_income;
  const net = Math.round((incomeTotal - currTotal) * 100) / 100;

  if (net > 0) {
    insights.push({
      type: 'success',
      title: 'Positive Cash Flow',
      description: `This month you've earned $${incomeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} and spent $${currTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}, netting +$${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      metric: `+$${net.toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    });
  } else if (net < 0) {
    insights.push({
      type: 'warning',
      title: 'Negative Cash Flow',
      description: `This month you've earned $${incomeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })} but spent $${currTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}, a deficit of $${Math.abs(net).toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      metric: `-$${Math.abs(net).toLocaleString('en-US', { minimumFractionDigits: 2 })}`,
    });
  } else {
    insights.push({
      type: 'info',
      title: 'Break Even',
      description: `Income and expenses are balanced this month at $${incomeTotal.toLocaleString('en-US', { minimumFractionDigits: 2 })}.`,
      metric: '$0.00',
    });
  }

  return {
    generated_at: now.toISOString(),
    insights,
    summary: {
      current_month_expenses: currTotal,
      previous_month_expenses: prevTotal,
      current_month_income: incomeTotal,
      overdue_count: overdue.count,
      overdue_total: overdue.total_outstanding,
      net_cash_flow: net,
    },
  };
}

module.exports = { generateInsights };
