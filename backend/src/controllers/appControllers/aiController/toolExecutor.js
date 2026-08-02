/**
 * Unified Tool Executor Dispatcher.
 * Modularized under tools/ for clean separation of concerns (< 250 LOC rule).
 */

const {
  getExpenses,
  getIncome,
  getCashFlowSummary,
  getOverdueInvoices,
  getTopVendors,
  getTaxVariants,
} = require('./tools/queryExecutors');

const {
  proposeCreateInvoice,
  proposeCreateClient,
  proposeCreateQuote,
  proposeCreateExpense,
} = require('./tools/createProposalExecutors');

const {
  proposeUpdateInvoice,
  proposeUpdateQuote,
  proposeConvertQuoteToInvoice,
  proposeRecordPayment,
  proposeUpdateClient,
  proposeDeleteRecord,
} = require('./tools/updateProposalExecutors');

const TOOL_HANDLERS = {
  get_expenses: getExpenses,
  get_income: getIncome,
  get_cash_flow_summary: getCashFlowSummary,
  get_overdue_invoices: getOverdueInvoices,
  get_top_vendors: getTopVendors,
  get_tax_variants: getTaxVariants,
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

module.exports = {
  executeTool,
  getExpenses,
  getIncome,
  getOverdueInvoices,
};
