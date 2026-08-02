/**
 * Update/Delete action proposal definitions (Invoices, Quotes, Payments, Clients, Deletions).
 */

const UPDATE_PROPOSAL_DEFINITIONS = [
  {
    type: 'function',
    function: {
      name: 'propose_update_invoice',
      description:
        'Propose updating or modifying an existing invoice (status, payment status, tax rate, notes, items). ' +
        'Use this whenever the user asks to update, edit, change status, or mark an invoice as paid/sent.',
      parameters: {
        type: 'object',
        properties: {
          client_name: { type: 'string', description: 'Name of the client (e.g. Acme Corp)' },
          invoice_number: { type: 'number', description: 'Invoice number if specific invoice is requested (e.g. 1)' },
          status: {
            type: 'string',
            enum: ['draft', 'pending', 'sent', 'paid', 'unpaid', 'partially'],
            description: 'New invoice status',
          },
          paymentStatus: {
            type: 'string',
            enum: ['paid', 'unpaid', 'partially'],
            description: 'New payment status',
          },
          taxRate: { type: 'number', description: 'New tax rate percentage' },
          notes: { type: 'string', description: 'Updated notes or comments' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                itemName: { type: 'string' },
                quantity: { type: 'number' },
                price: { type: 'number' },
              },
              required: ['itemName', 'quantity', 'price'],
            },
          },
        },
        required: ['client_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_update_quote',
      description:
        'Propose updating or modifying an existing quote or estimate (status, tax rate, notes, items).',
      parameters: {
        type: 'object',
        properties: {
          client_name: { type: 'string', description: 'Name of the client' },
          quote_number: { type: 'number', description: 'Quote number if specified' },
          status: {
            type: 'string',
            enum: ['draft', 'pending', 'sent', 'accepted', 'declined'],
            description: 'New quote status',
          },
          taxRate: { type: 'number' },
          notes: { type: 'string' },
          items: {
            type: 'array',
            items: {
              type: 'object',
              properties: {
                itemName: { type: 'string' },
                quantity: { type: 'number' },
                price: { type: 'number' },
              },
              required: ['itemName', 'quantity', 'price'],
            },
          },
        },
        required: ['client_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_convert_quote_to_invoice',
      description:
        'Propose converting an existing quote into an active invoice.',
      parameters: {
        type: 'object',
        properties: {
          client_name: { type: 'string', description: 'Name of the client' },
          quote_number: { type: 'number', description: 'Quote number if specified' },
        },
        required: ['client_name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_record_payment',
      description:
        'Propose recording a payment received from a client for an invoice.',
      parameters: {
        type: 'object',
        properties: {
          client_name: { type: 'string', description: 'Client name' },
          amount: { type: 'number', description: 'Payment amount received' },
          payment_mode: { type: 'string', description: 'Payment method e.g. Bank Transfer, Cash, Credit Card' },
        },
        required: ['client_name', 'amount'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_update_client',
      description:
        'Propose updating an existing client profile (email, phone, address).',
      parameters: {
        type: 'object',
        properties: {
          name: { type: 'string', description: 'Name of the client' },
          email: { type: 'string' },
          phone: { type: 'string' },
          address: { type: 'string' },
        },
        required: ['name'],
      },
    },
  },
  {
    type: 'function',
    function: {
      name: 'propose_delete_record',
      description:
        'Propose deleting/removing a record (invoice, quote, client, expense, payment).',
      parameters: {
        type: 'object',
        properties: {
          entity: {
            type: 'string',
            enum: ['invoice', 'quote', 'client', 'expense', 'payment'],
            description: 'Record type to delete',
          },
          client_name: { type: 'string', description: 'Name of client or vendor associated' },
          number: { type: 'number', description: 'Record number if applicable' },
        },
        required: ['entity'],
      },
    },
  },
];

module.exports = { UPDATE_PROPOSAL_DEFINITIONS };
