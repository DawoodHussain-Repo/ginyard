const mongoose = require('mongoose');

const Model = mongoose.model('Setting');

const updateManySetting = async (req, res) => {
  // req/body = { settings: [{ settingKey, settingValue }] }
  let settingsHasError = false;
  const updateDataArray = [];
  const { settings } = req.body;

  if (!Array.isArray(settings)) {
    return res.status(400).json({
      success: false,
      result: null,
      message: 'Invalid settings format',
    });
  }

  const userFilter = req.admin ? { createdBy: req.admin._id } : {};

  for (const setting of settings) {
    if (!setting.hasOwnProperty('settingKey') || !setting.hasOwnProperty('settingValue')) {
      settingsHasError = true;
      break;
    }

    const { settingKey, settingValue } = setting;

    updateDataArray.push({
      updateOne: {
        filter: { settingKey: settingKey, ...userFilter },
        update: {
          $set: {
            settingKey: settingKey,
            settingValue: settingValue,
            settingCategory: 'app_settings',
            ...(req.admin ? { createdBy: req.admin._id } : {}),
          },
        },
        upsert: true,
      },
    });
  }

  if (updateDataArray.length === 0) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'No settings provided',
    });
  }
  if (settingsHasError) {
    return res.status(202).json({
      success: false,
      result: null,
      message: 'Settings provided has Error',
    });
  }

  const result = await Model.bulkWrite(updateDataArray);

  return res.status(200).json({
    success: true,
    result: [],
    message: 'Successfully updated all settings',
  });
};

module.exports = updateManySetting;
