// middlewares/auth.js

const jwt = require('jsonwebtoken');
const SECRET_KEY ='some-secret-key';
// const userModel = require('../models/user');

const generateJwtToken = (payload) => {
  return jwt.sign(payload, SECRET_KEY, { expiresIn: '7d' });
};

// const isAuthorized = (token) => {
//   return jwt.verify(token, SECRET_KEY, function (err, decoded) {
//     if (err) {
//       return false;
//     }
//     return userModel.findById(decoded._id)
//       .then((user) => {
//         return Boolean(user)
//       })

//   });
// }

module.exports = {
  generateJwtToken
  // isAuthorized,
}











// const auth = (req, res, next) => {
//   const { authorization } = req.headers;

//   if (!authorization || !authorization.startsWith('Bearer ')) {
//     return res
//       .status(401)
//       .send({ message: 'Необходима авторизация' });
//   }

//   const token = authorization.replace('Bearer ', '');
//   let payload;

//   try {
//     payload = jwt.verify(token, 'some-secret-key');
//   } catch (err) {
//     return res
//       .status(401)
//       .send({ message: 'Необходима авторизация' });
//   }

//   req.user = payload; // записываем пейлоуд в объект запроса

//   next(); // пропускаем запрос дальше
// };

// module.exports = auth;