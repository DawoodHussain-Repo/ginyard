/**
 * Groq tool-calling function definitions.
 * Each tool maps to a direct MongoDB/Mongoose query.
 * The LLM picks which tool(s) to call based on the user's question.
 */

const TOOL_DEFINITIONS = [
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
            description: 'Start date in YYYY-MM-DD format. If not specified, defaults to 30 days ago.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format. If not specified, defaults to today.',
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
            description: 'Start date in YYYY-MM-DD format. If not specified, defaults to 30 days ago.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format. If not specified, defaults to today.',
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
            description: 'Start date in YYYY-MM-DD format. If not specified, defaults to 30 days ago.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format. If not specified, defaults to today.',
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
            description: 'Start date in YYYY-MM-DD format. If not specified, defaults to 90 days ago.',
          },
          end_date: {
            type: 'string',
            description: 'End date in YYYY-MM-DD format. If not specified, defaults to today.',
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
];

module.exports = { TOOL_DEFINITIONS };
