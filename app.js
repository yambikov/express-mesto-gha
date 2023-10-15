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

// CRUD (create, read, update, delete) //
// GET /users — возвращает всех пользователей
app.get('/users', (req, res) => {
  UserModel.find()
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ error: 'Ошибка при получении пользователей' }); // Отправляем ошибку
    });
});

// GET /users/:userId - возвращает пользователя по _id
app.get('/users/:userId', (req, res) => {
  const { userId } = req.params;
  UserModel.findById(userId)
    .then((data) => {
      res.status(200).json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ error: 'Ошибка при получении пользователя' }); // Отправляем ошибку
    });
});

// POST /users — создаёт пользователя
app.post('/users', (req, res) => {
  const userData = req.body; // получаем данные из тела запроса

  UserModel.create(userData) // Создаём нового пользователя
    .then((data) => {
      res.status(201).json(data);
    })
    .catch((err) => {
      console.log(err.message);
      res.status(500).json({ error: 'Ошибка при создании пользователя' }); // Отправляем ошибку
    });
});

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
