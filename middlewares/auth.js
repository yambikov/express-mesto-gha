// auth.js
const jwt = require('jsonwebtoken');

// const { SECRET_KEY, NODE_ENV } = process.env;
// console.log(SECRET_KEY);

const isAuthorized = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    // console.log(token);

    if (!token) {
      throw new Error('NotAuthenticated');
    }

    const validToken = token.replace('Bearer ', '');
    // console.log(validToken);
    // payload = jwt.verify(validToken, NODE_ENV === 'production' ? SECRET_KEY : 'some-secret-key');
    payload = jwt.verify(validToken, 'some-secret-key');
  } catch (error) {
    if (error.message === 'NotAuthenticated') {
      return res.status(401).send({ message: 'Неправильные email или пароль' });
    }
    if (error.name === 'JsonWebTokenError') {
      return res.status(401).send({ message: 'Неправильный токен' });
    }
    return res.status(500).send({ message: 'Произошла ошибка' });
  }
  req.user = payload;
  // console.log(req.user.id);
  return next();
};

module.exports = {
  isAuthorized,
};
