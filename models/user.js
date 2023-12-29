// models/user.js

const mongoose = require('mongoose');
const validator = require('validator');
const bcrypt = require('bcryptjs');

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
      validator: (value) => {
        const regex = /^(https?:\/\/)?(www\.)?([a-zA-Z0-9-_.~:/?#[\]@!$&'()*+,;=]+)(#[a-zA-Z0-9-_.~:/?#[\]@!$&'()*+,;=]+)?$/;
        return regex.test(value);
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
    minlength: 8,
    select: false, // не возвращать пароль при запросе
  },

});

userSchema.statics.findUserByCredentials = function (email, password) {
  return this.findOne({ email })
    .then((user) => {
      if (!user) {
        return Promise.reject(new Error('Неправильные почта или пароль'));
      }

      return bcrypt.compare(password, user.password)
        .then((matched) => {
          if (!matched) {
            return Promise.reject(new Error('Неправильные почта или пароль'));
          }

          return user;
        });
    });
};

module.exports = mongoose.model('user', userSchema);
