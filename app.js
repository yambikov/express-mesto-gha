const express = require('express'); // eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const userRouter = require('./routes/routes-users'); // импортируем роуты юзера
const CardModel = require('./models/card');
const UserModel = require('./models/user');
// const card = require('./models/card');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies
app.use('/users', userRouter); // подключаем роуты юзера

app.use((req, res, next) => {
  req.user = {
    _id: '652ba3c78f45280218a223f7',
  };
  // console.log(req.user);
  next();
});

app.post('/cards', (req, res) => {
  const { name, link } = req.body;
  console.log(req.body);

  return CardModel.create({ name, link, owner: req.user._id })
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error' });
    });
});

app.get('/cards', (req, res) => {
  CardModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    // eslint-disable-next-line arrow-body-style, no-unused-vars
    .catch((err) => {
      return res.status(500).send({ message: 'Server error' });
    });
});

app.delete('/cards/:cardId', (req, res) => {
  const { cardId } = req.params;
  CardModel.findByIdAndDelete(cardId)
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Card not found' });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid card ID' });
      }
      res.status(500).send({ message: 'Server error' }); // Отправляем ошибку
    });
});

app.patch('/users/me', (req, res) => {
  const { name, about } = req.body;
  console.log(req.body);

  UserModel.findByIdAndUpdate(req.user._id, { name, about }, {
    new: true, // обработчик then получит на вход обновлённую запись
    runValidators: true, // данные будут валидированы перед изменением
  })
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        // Если data равен null, значит пользователь с указанным _id не найден
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (!name && !about) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении профиля' });
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: 'Ошибка валидации' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
});

app.patch('/users/me/avatar', (req, res) => {
  const { avatar } = req.body;

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
  })
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        // Если data равен null, значит пользователь с указанным _id не найден
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      if (!avatar) {
        return res.status(400).send({ message: 'Переданы некорректные данные при обновлении аватара.' });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line no-unused-vars
    .catch((err) => res.status(500).send({ message: 'Ошибка по умолчанию.' }));
});

app.put('/cards/:cardId/likes', (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((data) => {
      // if (req.params.cardId !== data._id.toString()) {
      //   return res.status(404).send({ message: 'Card not found' });
      // }
      res.status(200).send(data);
    })
    // eslint-disable-next-line no-unused-vars, consistent-return
    .catch((err) => {
      console.log(err);
      //   if (err.name === 'CastError') {
      //     return res.status(404).send({ message: 'Invalid user ID' });
      //   }
      //   res.status(500).send({ message: 'Server error' }); // Отправляем ошибку
      // });
      if (err.name === 'TypeError') {
        return res.status(404).send({ message: 'Несуществующий в БД id карточки' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id карточки' });
      }
      res.status(500).send({ message: 'Server error' }); // Отправляем ошибку
    });
});

app.delete('/cards/:cardId/likes', (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } }, // убрать _id из массива
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((data) => {
      // if (req.params.cardId !== data._id.toString()) {
      //   return res.status(404).send({ message: 'Card not found' });
      // }
      res.status(200).send(data);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'TypeError') {
        return res.status(404).send({ message: 'Несуществующий в БД id карточки' });
      }
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id карточки' });
      }
      res.status(500).send({ message: 'Server error' }); // Отправляем ошибку
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
