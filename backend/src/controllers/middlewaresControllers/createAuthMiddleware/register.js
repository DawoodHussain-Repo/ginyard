const Joi = require('joi');
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const authUser = require('./authUser');

const register = async (req, res, { userModel }) => {
  const UserPasswordModel = mongoose.model(userModel + 'Password');
  const UserModel = mongoose.model(userModel);
  const { email, password, name, surname } = req.body;

  // validate
  const objectSchema = Joi.object({
    email: Joi.string()
      .email({ tlds: { allow: true } })
      .required(),
    password: Joi.string().min(6).required(),
    name: Joi.string().required(),
    surname: Joi.string().allow('', null, ''),
  });

  const { error } = objectSchema.validate({ email, password, name, surname });
  if (error) {
    return res.status(409).json({
      success: false,
      result: null,
      error: error,
      message: error.message || 'Invalid registration details.',
    });
  }

  const existingUser = await UserModel.findOne({ email: email.toLowerCase(), removed: false });

  if (existingUser) {
    return res.status(409).json({
      success: false,
      result: null,
      message: 'An account with this email already exists.',
    });
  }

  // Create User
  const newUser = await new UserModel({
    email: email.toLowerCase(),
    name: name,
    surname: surname || '',
    enabled: true,
  }).save();

  // Create User Password & Salt
  const salt = bcrypt.genSaltSync(10);
  const newPasswordObj = new UserPasswordModel({
    user: newUser._id,
    salt: salt,
  });
  newPasswordObj.password = newPasswordObj.generateHash(salt, password);
  await newPasswordObj.save();

  // Seed default settings for the new tenant
  try {
    const { globSync } = require('glob');
    const fs = require('fs');
    const Setting = mongoose.model('Setting');

    const settingFiles = [];
    const settingsFiles = globSync('./src/setup/defaultSettings/**/*.json');

    for (const filePath of settingsFiles) {
      const file = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
      const items = file.map((item) => ({ ...item, createdBy: newUser._id }));
      settingFiles.push(...items);
    }

    if (settingFiles.length > 0) {
      await Setting.insertMany(settingFiles);
    }
  } catch (err) {
    console.error('Error seeding settings for new user:', err);
  }

  // Auto-login user upon successful registration
  authUser(req, res, {
    user: newUser,
    databasePassword: newPasswordObj,
    password,
    UserPasswordModel,
  });
};

module.exports = register;
