// middlewares/auth.js

const jwt = require('jsonwebtoken');
const dotenv = require('dotenv'); // Импортируем dotenv

// Загружаем переменные окружения из файла .env
dotenv.config();

const { SECRET_KEY } = process.env;
console.log(SECRET_KEY);

const generateJwtToken = (payload) => jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });

module.exports = {
  generateJwtToken,
};
