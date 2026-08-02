const crypto = require('crypto');

function generate() {
  return crypto.randomBytes(12).toString('hex');
}

module.exports = {
  generate,
};
