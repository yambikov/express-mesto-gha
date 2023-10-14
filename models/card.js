/*
Поля схемы карточки:
name — имя карточки, строка от 2 до 30 символов, обязательное поле;
link — ссылка на картинку, строка, обязательно поле.
owner — ссылка на модель автора карточки, тип ObjectId, обязательное поле;
likes — список лайкнувших пост пользователей, массив ObjectId,
  по умолчанию — пустой массив (поле default);
createdAt — дата создания, тип Date, значение по умолчанию Date.now.
*/

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

const cardSchema = new mongoose.Schema({
  name: {
    type: String, // тип данных - строка
    required: true, // обязательное поле
    minlength: 2, // минимальная длина строки
    maxlength: 30, // максимальная длина строки
  },
  link: {
    type: String,
    required: true,
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId, // тип данных - ObjectId
    ref: 'user', // ссылка на модель автора карточки
    required: true,
  },
  likes: [{
    type: mongoose.Schema.Types.ObjectId,
    default: [],
  }],
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('card', cardSchema);
