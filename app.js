/* eslint no-console: ["error", { allow: ["log"] }] */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const users = require('./routes/users');
const cards = require('./routes/cards');
const { NOT_FOUND } = require('./utils/errors');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use((req, res, next) => {
  req.user = {
    _id: '63487ac5221f99b0ec040222',
  };
  next();
});
app.use(users, cards);
app.use('*', (req, res) => {
  console.log(req.originalUrl);
  res.status(NOT_FOUND).send({ message: 'По указанному пути ничего не найдено' });
});
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
