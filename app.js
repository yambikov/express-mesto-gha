const express = require('express'); // eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');
const userRouter = require('./routes/routes-users'); // импортируем роуты юзера
const CardModel = require('./models/card');

mongoose.connect('mongodb://localhost:27017/mestodb', {
  useNewUrlParser: true,
}).then(() => {
  console.log('Connected to MongoDB');
});

const app = express();
const PORT = 3000;

app.use(express.json()); // to support JSON-encoded bodies

app.use((req, res, next) => {
  req.user = {
    _id: '652ba3c78f45280218a223f7',
  };
  // console.log(req.user);
  next();
});

app.use('/users', userRouter); // подключаем роуты юзера
app.use('/cards', userRouter); // подключаем роуты юзера

// app.post('/cards', (req, res) => {
//   const { name, link } = req.body;
//   console.log(req.body);

//   return CardModel.create({ name, link, owner: req.user._id })
//     .then((data) => {
//       res.status(201).send(data);
//     })
//     .catch((err) => {
//       if (err.name === 'ValidationError') {
//         return res.status(400).send({ message: err.message });
//       }
//       return res.status(500).send({ message: 'Server error' });
//     });
// });

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

app.put('/cards/:cardId/likes', (req, res) => {
  CardModel.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } }, // добавить _id в массив, если его там нет
    { new: true },
  )
    // eslint-disable-next-line consistent-return
    .then((data) => {
      if (!data) {
        return res.status(404).send({ message: 'Некорректный id карточки' });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
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
      if (!data) {
        return res.status(404).send({ message: 'Некорректный id карточки' });
      }
      res.status(200).send(data);
    })
    // eslint-disable-next-line consistent-return
    .catch((err) => {
      if (err.name === 'CastError') {
        return res.status(400).send({ message: 'Некорректный id карточки' });
      }
      res.status(500).send({ message: 'Server error' }); // Отправляем ошибку
    });
});

app.patch('/*', (req, res) => res.status(404).send({ message: 'Страница не найдена' }));

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
