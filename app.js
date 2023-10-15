const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const UserModel = require('./models/user');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies

app.get('/', (req, res) => {
  res.status(200).send('Привет от GET!');
});

app.post('/post', (req, res) => {
  const { name } = req.body;
  res.status(201).send(`Привет от POST! ${name}`);
});

// GET /users — возвращает всех пользователей
app.get('/users', (req, res) => {
  UserModel.find()
    .then((data) => {
      res.status(200).send(data);
    })
    // eslint-disable-next-line arrow-body-style, no-unused-vars
    .catch((err) => {
      return res.status(500).send({ message: 'Server error' });
    });
});

// GET /users/:userId - возвращает пользователя по _id
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'User not found' });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      console.log(err);
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Invalid user ID' });
      }
      res.status(500).send({ message: 'Server error' }); // Отправляем ошибку
    });
});

// POST /users — создаёт пользователя
app.post('/users', (req, res) => {
  const { name, about, avatar } = req.body;

  return UserModel.create({ name, about, avatar }) // Создаём нового пользователя
    .then((data) => {
      res.status(201).send(data);
    })
    .catch((err) => {
      // console.log(err);
      // так как ниже мы пишем { message: 'Server error' }, то что действительно произошло
      // становиться непонятным, поэтому, чтобы дебажить нужно использовать console.log(err)
      if (err.name === 'ValidationError') {
        return res.status(400).send({ message: err.message });
      }
      return res.status(500).send({ message: 'Server error' });
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
