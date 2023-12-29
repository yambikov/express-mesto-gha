const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Импортируем dotenv

// Загружаем переменные окружения из файла .env
dotenv.config();

const { SECRET_KEY, NODE_ENV } = process.env;
const generateJwtToken = (payload) => jwt.sign(payload, NODE_ENV === 'production' ? SECRET_KEY : 'some-secret-key', { expiresIn: '7d' });

module.exports = {
  generateJwtToken,
};
