const crypto = require('crypto');
const bcrypt = require('bcryptjs');

const algorithm = 'aes-256-cbc';
const key = '@Thisisfordesign2023';
const iv = crypto.randomBytes(16);

// Encrypt data using AES-256-CBC algorithm
module.exports.encrypt = (data) => {
  const cipher = crypto.createCipheriv(algorithm, key, iv);
  let encryptedData = cipher.update(data, 'utf8', 'hex');
  encryptedData += cipher.final('hex');
  return `${iv.toString('hex')}:${encryptedData}`;
};

// Decrypt data using AES-256-CBC algorithm
module.exports.decrypt = (encryptedData) => {
  const [ivHex, data] = encryptedData.split(':');
  const decipher = crypto.createDecipheriv(algorithm, key, Buffer.from(ivHex, 'hex'));
  let decryptedData = decipher.update(data, 'hex', 'utf8');
  decryptedData += decipher.final('utf8');
  return decryptedData;
};

// Hash a password using bcrypt
module.exports.hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  return hashedPassword;
};

// Compare a password with a hashed password using bcrypt
module.exports.comparePassword = async (password, hashedPassword) => {
  const isMatch = await bcrypt.compare(password, hashedPassword);
  return isMatch;
};
