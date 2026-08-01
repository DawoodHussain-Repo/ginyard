const createCRUDController = require('@/controllers/middlewaresControllers/createCRUDController');
const summary = require('./summary');

const methods = createCRUDController('Quote');

methods.summary = summary;
methods.mail = async (req, res) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Mail feature stubs',
  });
};
methods.convert = async (req, res) => {
  return res.status(200).json({
    success: true,
    result: null,
    message: 'Convert quote feature stub',
  });
};

module.exports = methods;
