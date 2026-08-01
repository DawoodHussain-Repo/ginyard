const mongoose = require('mongoose');

const finishOnboarding = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const Setting = mongoose.model('Setting');
  const adminId = req.admin._id;

  const {
    company_name,
    company_email,
    company_address,
    company_phone,
    default_currency_code = 'USD',
    tax_rate = 0,
  } = req.body;

  // 1. Update company settings for this tenant
  const settingsToUpdate = [
    { settingKey: 'idurar_app_company_name', settingValue: company_name || req.admin.name + ' Company' },
    { settingKey: 'idurar_app_company_email', settingValue: company_email || req.admin.email },
    { settingKey: 'idurar_app_company_address', settingValue: company_address || '' },
    { settingKey: 'idurar_app_company_phone', settingValue: company_phone || '' },
    { settingKey: 'default_currency_code', settingValue: default_currency_code },
    { settingKey: 'default_tax_rate', settingValue: tax_rate },
  ];

  const bulkOps = settingsToUpdate.map(({ settingKey, settingValue }) => ({
    updateOne: {
      filter: { settingKey, createdBy: adminId },
      update: {
        $set: {
          settingKey,
          settingValue,
          createdBy: adminId,
          settingCategory: 'app_settings',
        },
      },
      upsert: true,
    },
  }));

  await Setting.bulkWrite(bulkOps);

  // 2. Mark onboarding as completed with timestamp
  const updatedAdmin = await Admin.findByIdAndUpdate(
    adminId,
    {
      onboarding_completed_at: new Date(),
      onboarding_step: 3,
    },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    result: {
      _id: updatedAdmin._id,
      name: updatedAdmin.name,
      surname: updatedAdmin.surname,
      role: updatedAdmin.role,
      email: updatedAdmin.email,
      photo: updatedAdmin.photo,
      onboarding_completed_at: updatedAdmin.onboarding_completed_at,
      onboarding_step: updatedAdmin.onboarding_step,
    },
    message: 'Onboarding completed successfully!',
  });
};

const updateStep = async (req, res) => {
  const Admin = mongoose.model('Admin');
  const { step } = req.body;

  const updatedAdmin = await Admin.findByIdAndUpdate(
    req.admin._id,
    { onboarding_step: step || 1 },
    { new: true }
  );

  return res.status(200).json({
    success: true,
    result: {
      onboarding_step: updatedAdmin.onboarding_step,
      onboarding_completed_at: updatedAdmin.onboarding_completed_at,
    },
    message: 'Onboarding step updated',
  });
};

module.exports = {
  finishOnboarding,
  updateStep,
};
