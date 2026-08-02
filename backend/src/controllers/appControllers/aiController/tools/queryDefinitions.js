/**
 * Query tool definitions (read-only financial data tools).
 */

const QUERY_TOOL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'get_expenses',
      description:
        'Retrieve expenses from the accounting system. ' +
        'Returns a list of expense records with vendor, amount, category, date, and description. ' +
        'Use this whenever the user asks about spending, costs, or expenses.',
      parameters: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date in YYYY-MM-DD format (e.g. 2026-01-01). Leave empty if omitted.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format (e.g. 2026-02-01). Leave empty if omitted.',
          },
          category: {
            type: 'string',
            description:
              "Optional category filter. Must be one of: " +
              "'Software & Subscriptions', 'Marketing', 'Office Supplies', " +
              "'Travel', 'Professional Services', 'Utilities', 'Equipment', 'Miscellaneous'",
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_income',
      description:
        'Retrieve income (paid invoices) from the accounting system. ' +
        'Returns a list of paid invoices with client name, amount, date, and items. ' +
        'Use this whenever the user asks about revenue, income, earnings, or money received.',
      parameters: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date in YYYY-MM-DD format (e.g. 2026-01-01). Leave empty if omitted.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format (e.g. 2026-02-01). Leave empty if omitted.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_cash_flow_summary',
      description:
        'Get a cash flow summary comparing total income vs total expenses for a time period. ' +
        'Returns total income, total expenses, net cash flow, and breakdowns. ' +
        "Use this when the user asks about profitability, cash flow, or whether they're making or losing money.",
      parameters: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date in YYYY-MM-DD format (e.g. 2026-01-01). Leave empty if omitted.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format (e.g. 2026-02-01). Leave empty if omitted.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_overdue_invoices',
      description:
        'Get all invoices that are unpaid and past their due date. ' +
        'Returns client name, invoice amount, due date, and how many days overdue. ' +
        "Use this when the user asks about unpaid invoices, overdue payments, or outstanding receivables.",
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_top_vendors',
      description:
        'Get the top vendors by total spend for a given time period. ' +
        'Returns a ranked list of vendors with their total spend and number of transactions. ' +
        "Use this when the user asks about who they're spending the most with, top suppliers, or vendor analysis.",
      parameters: {
        type: 'object',
        properties: {
          start_date: {
            type: 'string',
            description: 'Start date in YYYY-MM-DD format (e.g. 2026-01-01). Leave empty if omitted.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format (e.g. 2026-02-01). Leave empty if omitted.',
          },
          limit: {
            type: 'integer',
            description: 'Maximum number of vendors to return. Defaults to 5.',
          },
        },
        required: [],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'get_tax_variants',
      description:
        'Get all registered tax variants (e.g. Card Tax, Cash Tax, GST, VAT) from the accounting system. ' +
        'Use this to ask the user which tax variant to apply or look up available tax rates.',
      parameters: {
        type: 'object',
        properties: {},
        required: [],
      },
    },
  },
];

module.exports = { QUERY_TOOL_DEFINITIONS };
