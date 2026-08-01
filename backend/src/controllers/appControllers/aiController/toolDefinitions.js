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
  {
    type: 'function',
    function: {
      name: 'propose_create_invoice',
      description:
        'Propose creating a new invoice for a client. ' +
        'Checks if the client exists in the database and returns a structured action proposal preview for user approval.',
      parameters: {
        type: 'object',
        properties: {
          client_name: {
            type: 'string',
            description: 'Name of the client or company (e.g. Acme Corp)',
          },
          items: {
            type: 'array',
            description: 'List of items purchased or billed',
            items: {
              type: 'object',
              properties: {
                itemName: { type: 'string', description: 'Name of item or service (e.g. Fertilizer bag)' },
                quantity: { type: 'number', description: 'Quantity (e.g. 15)' },
                price: { type: 'number', description: 'Unit price (e.g. 1000)' },
                description: { type: 'string', description: 'Line item description' },
              },
              required: ['itemName', 'quantity', 'price'],
            },
          },
          status: {
            type: 'string',
            enum: ['draft', 'pending', 'sent', 'paid', 'unpaid', 'partially'],
            description: 'Invoice status',
          },
          currency: {
            type: 'string',
            description: 'Currency code if specified (e.g. PKR, USD, EUR)',
          },
          taxRate: {
            type: 'number',
            description: 'Tax rate percentage (e.g. 0, 5, 10)',
          },
          notes: {
            type: 'string',
            description: 'Optional notes or comments for the invoice',
          },
        },
        required: ['client_name', 'items'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_create_client',
      description:
        'Propose adding a new client/customer to the database. ' +
        'Returns a structured preview proposal for user approval, and asks for missing details like email/phone if needed.',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Full name or company name of client' },
          email: { type: 'string', description: 'Client email address' },
          phone: { type: 'string', description: 'Client phone number' },
          address: { type: 'string', description: 'Client address' },
        },
        required: ['name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_create_quote',
      description:
        'Propose creating a quote or estimate for a client. ' +
        'Returns a structured preview proposal for user approval.',
      parameters: {
        type: 'object',
        properties: {
          client_name: { type: 'string', description: 'Name of the client' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                itemName: { type: 'string', description: 'Item name' },
                quantity: { type: 'number', description: 'Quantity' },
                price: { type: 'number', description: 'Unit price' },
                description: { type: 'string', description: 'Line description' },
              },
              required: ['itemName', 'quantity', 'price'],
            },
          },
          status: {
            type: 'string',
            enum: ['draft', 'pending', 'sent', 'accepted', 'declined'],
            description: 'Quote status',
          },
          notes: { type: 'string' },
        },
        required: ['client_name', 'items'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_create_expense',
      description:
        'Propose creating a new expense entry in the database. ' +
        'Returns a structured preview proposal for user approval.',
      parameters: {
        type: 'object',
        properties: {
          vendor: { type: 'string', description: 'Vendor or payee name' },
          amount: { type: 'number', description: 'Expense amount' },
          category: {
            type: 'string',
            enum: [
              'Software & Subscriptions',
              'Marketing',
              'Office Supplies',
              'Travel',
              'Professional Services',
              'Utilities',
              'Equipment',
              'Miscellaneous',
            ],
            description: 'Expense category',
          },
          date: { type: 'string', description: 'Expense date in YYYY-MM-DD format' },
          description: { type: 'string', description: 'Optional description of expense' },
        },
        required: ['vendor', 'amount'],
      },
    },
  },
];

module.exports = { TOOL_DEFINITIONS };
