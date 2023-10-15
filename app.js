const express = require('express'); // eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const userRouter = require('./routes/routes-users'); // импортируем роуты юзера
const CardModel = require('./models/card');
const UserModel = require('./models/user');

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
    // upsert: true, // если пользователь не найден, он будет создан
  })
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        // Если data равен null, значит пользователь с указанным _id не найден
        return res.status(404).send({ message: 'Пользователь с указанным _id не найден.' });
      }
      res.status(200).send(data);
    })
    .catch((err) => {
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: ' Переданы некорректные данные при обновлении профиля' });
      }
      return res.status(500).send({ message: 'Ошибка по умолчанию' });
    });
});

app.patch('/users/me/avatar', (req, res) => {
  const { avatar } = req.body;
  console.log(req.body);

  UserModel.findByIdAndUpdate(req.user._id, { avatar }, {
    new: true, // обработчик then получит на вход обновлённую запись
    // runValidators: true, // данные будут валидированы перед изменением
    // upsert: true, // если пользователь не найден, он будет создан
  })
    .then((data) => {
      res.status(200).send(data);
    })
    .catch((err) => {
      console.log(err.message);
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error' });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
