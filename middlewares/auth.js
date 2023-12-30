// auth.js
const jwt = require('jsonwebtoken');
const UnauthorizedError = require('../errors/UnauthorizedError');

const { SECRET_KEY, NODE_ENV } = process.env;
// console.log(SECRET_KEY);

const isAuthorized = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;

    if (!token) {
      return next(new UnauthorizedError('Необходимо войти'));
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(
      validToken,
      NODE_ENV === 'production' ? SECRET_KEY : 'some-secret-key',
    );
  } catch (error) {
    if (error.message === 'NotAuthenticated') {
      return next(new UnauthorizedError('Неправильные email или пароль'));
    }
    if (error.name === 'JsonWebTokenError') {
      return next(new UnauthorizedError('Неправильный токен'));
    }
    return next(error); // Передаем ошибку для централизованной обработки ошибок 500
  }
  req.user = payload;
  return next();
};

module.exports = {
  isAuthorized,
};
