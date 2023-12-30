// models/user.js

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

const UnauthorizedError = require('../errors/UnauthorizedError');

const userSchema = new mongoose.Schema({
  name: {
    type: String, // тип данных - строка
    // required: true, // обязательное поле
    minlength: 2, // минимальная длина строки
    maxlength: 30, // максимальная длина строки
    default: 'Жак-Ив Кусто', // Значение по умолчанию для name
  },
  about: {
    type: String,
    // required: true,
    minlength: 2,
    maxlength: 30,
    default: 'Исследователь',
  },
  avatar: {
    type: String,
    default: 'https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png',
    validate: {
      validator: (string) => {
        validator.isURL(string);
      },
      message: 'Неправильный формат ссылки на аватар',
    },
  },
  email: {
    type: String,
    required: true,
    unique: true,
    validate: {
      validator: (value) => validator.isEmail(value),
      message: 'Неправильный формат почты',
    },
  },
  password: {
    type: String,
    required: true,
    select: false, // не возвращать пароль при запросе
  },

});

// eslint-disable-next-line func-names
userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .select('+password')
    .then((user) => {
      if (!user) {
        throw new UnauthorizedError('Неверные логин или пароль');
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            throw new UnauthorizedError('Неверные логин или пароль');
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
