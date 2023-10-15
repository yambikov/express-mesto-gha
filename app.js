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
app.use('/users', userRouter); // подключаем роуты юзера

app.use((req, res, next) => {
  req.user = {
    _id: '652ba3c78f45280218a223f7',
  };
  // console.log(req.user);
  next();
});

app.post('/cards', (req, res) => {
  const { name, link, owner } = req.body;

  return CardModel.create({ name, link, owner })
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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
