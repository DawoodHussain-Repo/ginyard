const mongoose = require('mongoose');

const summary = async (req, res) => {
  const Model = mongoose.model('Quote');

  const userFilter = req.admin ? { createdBy: req.admin._id } : {};

  const response = await Model.aggregate([
    {
      $match: {
        removed: false,
        ...userFilter,
      },
    },
    {
      $facet: {
        totalQuote: [
          {
            $group: {
              _id: null,
              total: { $sum: '$total' },
              count: { $sum: 1 },
            },
          },
        ],
        statusCounts: [
          {
            $group: {
              _id: '$status',
              count: { $sum: 1 },
            },
          },
        ],
      },
    },
  ]);

  const totalQuotes = response[0]?.totalQuote[0] || { total: 0, count: 0 };
  const statusResult = response[0]?.statusCounts || [];

  const performance = statusResult.map((item) => ({
    status: item._id,
    count: item.count,
    percentage: totalQuotes.count > 0 ? Math.round((item.count / totalQuotes.count) * 100) : 0,
  }));

  return res.status(200).json({
    success: true,
    result: {
      total: totalQuotes.total,
      total_undue: 0,
      performance,
    },
    message: 'Successfully retrieved quote summary',
  });
};

module.exports = summary;
