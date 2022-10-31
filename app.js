/* eslint no-console: ["error", { allow: ["log"] }] */
const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const { celebrate, Joi, errors } = require('celebrate');
const { validateToken } = require('./middlewares/auth');
const { login, createUser } = require('./controllers/users');
const users = require('./routes/users');
const cards = require('./routes/cards');
const NotFoundError = require('./utils/errors/not-found-error');
const handleError = require('./middlewares/handleError');
const URL_PATTERN = require('./utils/constants');

const app = express();
const { PORT = 3000 } = process.env;
mongoose.connect('mongodb://localhost:27017/mestodb');
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.post('/signin', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
  }),
}), login);
app.post('/signup', celebrate({
  body: Joi.object().keys({
    email: Joi.string().email().required(),
    password: Joi.string().required(),
    name: Joi.string().default('Жак-Ив Кусто').min(2).max(30),
    about: Joi.string().default('Исследователь').min(2).max(30),
    avatar: Joi.string().regex(URL_PATTERN)
      .default('https://pictures.s3.yandex.net/resources/jacques-cousteau_1604399756.png'),
  }),
}), createUser);
app.use('/users', validateToken, users);
app.use('/cards', validateToken, cards);
app.use('*', (req, res, next) => {
  const err = new NotFoundError('По указанному пути ничего не найдено');
  next(err);
});
app.use(errors(), handleError);
app.listen(PORT, () => {
  console.log(`App listening on port ${PORT}`);
});
