const jwt = require('jsonwebtoken');
const SECRET_KEY = 'some-secret-key';

const isAuthorized = (req, res, next) => {
  let payload;
  try {
    const token = req.headers.authorization;
    console.log(token);

    if (!token) {
      throw new Error('NotAuthenticated');
    }

    const validToken = token.replace('Bearer ', '');
    payload = jwt.verify(validToken, SECRET_KEY);
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
  next();
};

module.exports = {
  isAuthorized
}