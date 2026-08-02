const mongoose = require('mongoose');
const moment = require('moment');

const InvoiceModel = mongoose.model('Invoice');

const summary = async (Model, req, res) => {
  let defaultType = 'month';
  const { type } = req.query;

  if (type && ['week', 'month', 'year'].includes(type)) {
    defaultType = type;
  } else if (type) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid type',
    });
  }

  const currentDate = moment();
  let startDate = currentDate.clone().startOf(defaultType);
  let endDate = currentDate.clone().endOf(defaultType);

  const adminIdStr = req.admin?._id ? req.admin._id.toString() : null;
  const userFilter = adminIdStr
    ? mongoose.Types.ObjectId.isValid(adminIdStr)
      ? {
          $or: [
            { createdBy: new mongoose.Types.ObjectId(adminIdStr) },
            { createdBy: adminIdStr },
          ],
        }
      : { createdBy: adminIdStr }
    : {};

  const pipeline = [
    {
      $facet: {
        totalClients: [
          {
            $match: {
              removed: false,
              enabled: true,
              ...userFilter,
            },
          },
          {
            $count: 'count',
          },
        ],
        newClients: [
          {
            $match: {
              removed: false,
              created: { $gte: startDate.toDate(), $lte: endDate.toDate() },
              enabled: true,
              ...userFilter,
            },
          },
          {
            $count: 'count',
          },
        ],
        activeClients: [
          {
            $match: {
              removed: false,
              enabled: true,
              ...userFilter,
            },
          },
          {
            $lookup: {
              from: InvoiceModel.collection.name,
              localField: '_id',
              foreignField: 'client',
              as: 'invoice',
            },
          },
          {
            $match: {
              invoice: {
                $elemMatch: {
                  removed: false,
                  ...(req.admin ? { createdBy: req.admin._id } : {}),
                },
              },
            },
          },
          {
            $group: {
              _id: '$_id',
            },
          },
          {
            $count: 'count',
          },
        ],
      },
    },
  ];

  const aggregationResult = await Model.aggregate(pipeline);

  const result = aggregationResult[0];
  const totalClients = result.totalClients[0] ? result.totalClients[0].count : 0;
  const totalNewClients = result.newClients[0] ? result.newClients[0].count : 0;
  const activeClients = result.activeClients[0] ? result.activeClients[0].count : 0;

  const totalActiveClientsPercentage = totalClients > 0 ? (activeClients / totalClients) * 100 : 0;
  const totalNewClientsPercentage = totalClients > 0 ? (totalNewClients / totalClients) * 100 : 0;

  return res.status(200).json({
    success: true,
    result: {
      new: Math.round(totalNewClientsPercentage),
      active: Math.round(totalActiveClientsPercentage),
    },
    message: 'Successfully get summary of new clients',
  });
};

module.exports = summary;
