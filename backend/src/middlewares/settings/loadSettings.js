const listAllSettings = require('./listAllSettings');

const loadSettings = async (userId) => {
  const allSettings = {};
  const datas = await listAllSettings(userId);
  datas.forEach(({ settingKey, settingValue }) => {
    allSettings[settingKey] = settingValue;
  });
  return allSettings;
};

module.exports = loadSettings;
