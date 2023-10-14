const express = require('express');

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
