/**
 * Create action proposal definitions (Invoices, Clients, Quotes, Expenses).
 */

const CREATE_PROPOSAL_DEFINITIONS = [
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
          client_name: { type: 'string', description: 'Name of the client or company (e.g. Acme Corp)' },
          items: {
            type: 'array',
            description: 'List of items purchased or billed',
            items: {
              type: 'object',
              properties: {
                itemName: { type: 'string', description: 'Name of item or service' },
                quantity: { type: 'number', description: 'Quantity' },
                price: { type: 'number', description: 'Unit price' },
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
          currency: { type: 'string', description: 'Currency code if specified (e.g. PKR, USD, EUR)' },
          taxRate: { type: 'number', description: 'Tax rate percentage (e.g. 0, 5, 10)' },
          notes: { type: 'string', description: 'Optional notes or comments for the invoice' },
        },
        required: ['client_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_create_client',
      description:
        'Propose adding a new client/customer to the database. ' +
        'Returns a structured preview proposal for user approval.',
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
          currency: { type: 'string', description: 'Currency code if specified (e.g. PKR, USD, EUR)' },
          taxRate: { type: 'number', description: 'Tax rate percentage (e.g. 0, 5, 10, 15)' },
          notes: { type: 'string' },
        },
        required: ['client_name'],
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

module.exports = { CREATE_PROPOSAL_DEFINITIONS };
