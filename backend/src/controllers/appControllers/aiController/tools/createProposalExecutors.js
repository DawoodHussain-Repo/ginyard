/**
 * Creation action proposal executors (Invoice, Client, Quote, Expense).
 */

const mongoose = require('mongoose');

async function proposeCreateInvoice({ client_name, items = [], currency, notes = '', taxRate }, adminId) {
  const Client = mongoose.model('Client');
  const Setting = mongoose.model('Setting');
  const Invoice = mongoose.model('Invoice');

  const query = {
    name: new RegExp('^' + client_name.trim() + '$', 'i'),
    removed: false,
  };
  if (adminId) query.createdBy = adminId;

  let existingClient = await Client.findOne(query).lean();
  let resolvedTaxRate = taxRate;
  let tenantCurrency = currency;

  if (adminId) {
    if (resolvedTaxRate === undefined || resolvedTaxRate === null) {
      const taxSetting = await Setting.findOne({ settingKey: 'default_tax_rate', createdBy: adminId }).lean();
      if (taxSetting && taxSetting.settingValue !== undefined && taxSetting.settingValue !== '') {
        resolvedTaxRate = Number(taxSetting.settingValue);
      }
    }
    if (!tenantCurrency) {
      const currencySetting = await Setting.findOne({ settingKey: 'default_currency_code', createdBy: adminId }).lean();
      if (currencySetting && currencySetting.settingValue) {
        tenantCurrency = currencySetting.settingValue;
      }
    }
  }

  if (resolvedTaxRate === undefined || resolvedTaxRate === null) resolvedTaxRate = 0;
  if (!tenantCurrency) tenantCurrency = 'USD';

  let processedItems = items.map((i) => ({
    itemName: i.itemName || 'Item',
    quantity: Number(i.quantity || 1),
    price: Number(i.price || 0),
    total: Number(i.quantity || 1) * Number(i.price || 0),
  }));

  if (processedItems.length === 0 && existingClient) {
    const existingInvoice = await Invoice.findOne({ client: existingClient._id, removed: false }).sort({ created: -1 }).lean();
    if (existingInvoice && Array.isArray(existingInvoice.items)) {
      processedItems = existingInvoice.items.map((i) => ({
        itemName: i.itemName || 'Item',
        quantity: Number(i.quantity || 1),
        price: Number(i.price || 0),
        total: Number(i.total || (i.quantity * i.price) || 0),
      }));
    }
  }

  const subTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = (subTotal * resolvedTaxRate) / 100;
  const total = subTotal + taxTotal;

  return {
    action_type: 'CREATE_INVOICE',
    client_name: client_name.trim(),
    client_id: existingClient ? existingClient._id.toString() : null,
    client_exists: Boolean(existingClient),
    client_email: existingClient?.email || null,
    currency: tenantCurrency.toUpperCase(),
    items: processedItems,
    subTotal,
    taxRate: resolvedTaxRate,
    taxTotal,
    total,
    notes: notes || 'Created via AI Assistant',
    preview_title: `Invoice for ${client_name} (${tenantCurrency.toUpperCase()} ${total.toLocaleString()})`,
    requires_approval: true,
  };
}

async function proposeCreateClient({ name, email = '', phone = '', address = '' }, adminId) {
  const Client = mongoose.model('Client');
  const query = { name: new RegExp('^' + name.trim() + '$', 'i'), removed: false };
  if (adminId) query.createdBy = adminId;

  let existingClient = await Client.findOne(query).lean();
  return {
    action_type: 'CREATE_CLIENT',
    name: name.trim(),
    email: email || '',
    phone: phone || '',
    address: address || '',
    client_exists: Boolean(existingClient),
    preview_title: `New Client: ${name}`,
    requires_approval: true,
  };
}

async function proposeCreateQuote({ client_name, items = [], currency, notes = '', taxRate }, adminId) {
  const Client = mongoose.model('Client');
  const Setting = mongoose.model('Setting');
  const query = { name: new RegExp('^' + client_name.trim() + '$', 'i'), removed: false };
  if (adminId) query.createdBy = adminId;

  let existingClient = await Client.findOne(query).lean();
  let resolvedTaxRate = taxRate;
  let tenantCurrency = currency;

  if (adminId) {
    if (resolvedTaxRate === undefined || resolvedTaxRate === null) {
      const taxSetting = await Setting.findOne({ settingKey: 'default_tax_rate', createdBy: adminId }).lean();
      if (taxSetting && taxSetting.settingValue !== undefined && taxSetting.settingValue !== '') {
        resolvedTaxRate = Number(taxSetting.settingValue);
      }
    }
    if (!tenantCurrency) {
      const currencySetting = await Setting.findOne({ settingKey: 'default_currency_code', createdBy: adminId }).lean();
      if (currencySetting && currencySetting.settingValue) {
        tenantCurrency = currencySetting.settingValue;
      }
    }
  }

  if (resolvedTaxRate === undefined || resolvedTaxRate === null) resolvedTaxRate = 0;
  if (!tenantCurrency) tenantCurrency = 'USD';

  const processedItems = items.map((i) => ({
    itemName: i.itemName || 'Item',
    quantity: Number(i.quantity || 1),
    price: Number(i.price || 0),
    total: Number(i.quantity || 1) * Number(i.price || 0),
  }));

  const subTotal = processedItems.reduce((sum, item) => sum + item.total, 0);
  const taxTotal = (subTotal * resolvedTaxRate) / 100;
  const total = subTotal + taxTotal;

  return {
    action_type: 'CREATE_QUOTE',
    client_name: client_name.trim(),
    client_id: existingClient ? existingClient._id.toString() : null,
    client_exists: Boolean(existingClient),
    currency: tenantCurrency.toUpperCase(),
    items: processedItems,
    subTotal,
    taxRate: resolvedTaxRate,
    taxTotal,
    total,
    notes,
    preview_title: `Quote for ${client_name} (${tenantCurrency.toUpperCase()} ${total.toLocaleString()})`,
    requires_approval: true,
  };
}

async function proposeCreateExpense({ vendor, amount, category = 'Miscellaneous', date = null, description = '' }) {
  return {
    action_type: 'CREATE_EXPENSE',
    vendor: vendor.trim(),
    amount: Number(amount),
    category,
    date: date || new Date().toISOString().split('T')[0],
    description,
    preview_title: `Expense: ${vendor} (${amount})`,
    requires_approval: true,
  };
}

module.exports = {
  proposeCreateInvoice,
  proposeCreateClient,
  proposeCreateQuote,
  proposeCreateExpense,
};
