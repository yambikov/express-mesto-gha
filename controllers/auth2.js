const adminModel2 = require('../models/admins2');

const register2 = (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).send({ message: 'Email или пароль не может быть пустым' });
  };

  adminModel2.create({ email, password })
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

const auth2 = (req, res) => { };

module.exports = {
  register2,
  auth2,
};