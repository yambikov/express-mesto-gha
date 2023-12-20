const adminModel2 = require('../models/admins2');

const bcrypt = require('bcryptjs');
const saltRounds = 10;


const register2 = (req, res) => {
  const { name, about, avatar, email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
  };

  bcrypt.hash(password, 10)
    .then((hashedPassword) => {
      return adminModel2.create({ name, about, avatar, email, password: hashedPassword })
    })
    .then((admin) => {
      return res.status(201).send(admin);
    })
    .catch((err) => {
      if (err.code === 11000) {
        return res.status(409).send({ message: 'Такой пользователь уже существует' });
      }
      console.log(err);
      return res.status(500).send({ message: err.message });
    });
}

const auth2 = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
  };

  adminModel2.findOne({ email })
    .then((admin) => {
      if (!admin) {
        return res.status(401).send({ message: 'Такого пользователя не существует' });
      }
      bcrypt.compare(password, admin.password, function (err, isValidPassword) {
        if (!isValidPassword) {
          return res.status(401).send({ message: 'Неверный пароль' });
        }
        return res.status(200).send({ message: 'Вы успешно вошли' });
      });
    });
}

module.exports = {
  register2,
  auth2,
};