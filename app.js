const express = require('express');

// eslint-disable-next-line import/no-extraneous-dependencies
const mongoose = require('mongoose');

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

app.listen(PORT, () => {
  console.log(`Example app listening on port ${PORT}`);
});
