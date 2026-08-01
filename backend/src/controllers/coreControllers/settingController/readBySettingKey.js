const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const readBySettingKey = async (req, res) => {
  // Find document by id
  const settingKey = req.params.settingKey || undefined;

  if (!settingKey) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settingKey provided ',
    });
  }

  const userFilter = req.admin
    ? { $or: [{ createdBy: req.admin._id }, { createdBy: { $exists: false } }, { createdBy: null }] }
    : {};

  const result = await Model.findOne({
    settingKey,
    ...userFilter,
  });

  // If no results found, return document not found
  if (!result) {
    return res.status(404).json({
      success: false,
      result: null,
      message: 'No document found by this settingKey: ' + settingKey,
    });
  } else {
    // Return success resposne
    return res.status(200).json({
      success: true,
      result,
      message: 'we found this document by this settingKey: ' + settingKey,
    });
  }
};

module.exports = readBySettingKey;
