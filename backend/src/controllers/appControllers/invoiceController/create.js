const mongoose = require('mongoose');

const Model = mongoose.model('Invoice');

const { calculate } = require('@/helpers');
const { increaseBySettingKey } = require('@/middlewares/settings');
const schema = require('./schemaValidate');

const create = async (req, res) => {
  let body = req.body;
  const Client = mongoose.model('Client');
  const adminId = req.admin._id;

  // 1. Resolve client if passed as string name or missing valid ObjectId
  if (body.client) {
    if (typeof body.client === 'string' && !mongoose.Types.ObjectId.isValid(body.client)) {
      let existingClient = await Client.findOne({
        name: new RegExp('^' + body.client.trim() + '$', 'i'),
        createdBy: adminId,
        removed: false,
      });

      if (!existingClient) {
        existingClient = await new Client({
          name: body.client.trim(),
          createdBy: adminId,
        }).save();
      }
      body.client = existingClient._id.toString();
    }
  }

  // 2. Set default invoice fields if omitted
  if (!body.date) body.date = new Date();
  if (!body.expiredDate) {
    const exp = new Date(body.date);
    exp.setDate(exp.getDate() + 30);
    body.expiredDate = exp;
  }
  if (!body.year) body.year = new Date(body.date).getFullYear();
  if (!body.status) body.status = 'draft';
  if (body.taxRate === undefined || body.taxRate === null) {
    const Setting = mongoose.model('Setting');
    const taxSetting = await Setting.findOne({ settingKey: 'default_tax_rate', createdBy: adminId }).lean();
    body.taxRate = taxSetting && taxSetting.settingValue !== undefined ? Number(taxSetting.settingValue) : 0;
  }

  if (!body.number) {
    const count = await Model.countDocuments({ createdBy: adminId });
    body.number = count + 1;
  }

  // 3. Normalize items array
  if (Array.isArray(body.items)) {
    body.items = body.items.map((item) => {
      const quantity = Number(item.quantity || 1);
      const price = Number(item.price || 0);
      return {
        ...item,
        itemName: item.itemName || 'Item',
        quantity,
        price,
        total: calculate.multiply(quantity, price),
      };
    });
  }

  const { error, value } = schema.validate(body);
  if (error) {
    const { details } = error;
    return res.status(400).json({
      success: false,
      result: null,
      message: details[0]?.message,
    });
  }

  const { items = [], taxRate = 0, discount = 0 } = value;

  // default
  let subTotal = 0;
  let taxTotal = 0;
  let total = 0;

  //Calculate the items array with subTotal, total, taxTotal
  items.map((item) => {
    let total = calculate.multiply(item['quantity'], item['price']);
    //sub total
    subTotal = calculate.add(subTotal, total);
    //item total
    item['total'] = total;
  });
  taxTotal = calculate.multiply(subTotal, taxRate / 100);
  total = calculate.add(subTotal, taxTotal);

  body['subTotal'] = subTotal;
  body['taxTotal'] = taxTotal;
  body['total'] = total;
  body['items'] = items;

  let paymentStatus = calculate.sub(total, discount) === 0 ? 'paid' : 'unpaid';

  body['paymentStatus'] = paymentStatus;
  body['createdBy'] = req.admin._id;

  // Creating a new document in the collection
  const result = await new Model(body).save();
  const fileId = 'invoice-' + result._id + '.pdf';
  const updateResult = await Model.findOneAndUpdate(
    { _id: result._id },
    { pdf: fileId },
    {
      new: true,
    }
  ).exec();
  // Returning successfull response

  increaseBySettingKey({
    settingKey: 'last_invoice_number',
  });

  // Returning successfull response
  return res.status(200).json({
    success: true,
    result: updateResult,
    message: 'Invoice created successfully',
  });
};

module.exports = create;
