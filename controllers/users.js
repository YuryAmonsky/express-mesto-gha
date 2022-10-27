/* eslint no-console: ["error", { allow: ["log"] }] */
const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/user');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  UNAUTHORIZED,
  INTERNAL_SERVER,
} = require('../utils/errors');

module.exports.login = (req, res) => {
  const { email, password } = req.body;
  return User.findUserByCredentials(email, password)
    .then((user) => {
      const token = jwt.sign({ _id: user._id }, 'aj3h4bng9f9g8bspa0fk', { expiresIn: '7d' });
      res.status(OK).send({ token });
    })
    .catch((err) => {
      console.log(err.name);
      if (err instanceof mongoose.Error.DocumentNotFoundError || err.name === 'NOTAUTHORIZED') {
        return res.status(UNAUTHORIZED).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};

module.exports.getUsers = (req, res) => {
  User.find({})
    .then((users) => res.status(OK).send({ data: users }))
    .catch(() => res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' }));
};

module.exports.getUser = (req, res) => {
  User.findById(req.params.userId).orFail()
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя. Формат Id пользователя не верный' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id:${req.params._id} не найден` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};

module.exports.createUser = (req, res) => {
  const {
    name, about, avatar, email, password,
  } = req.body;
  bcrypt.hash(password, 10)
    .then((hash) => User.create({
      name, about, avatar, email, password: hash,
    }))
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      console.log(err);
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};

module.exports.updateUserInfo = (req, res) => {
  const { name, about } = req.body;
  User.findByIdAndUpdate(req.user._id, { name, about }, { new: true, runValidators: true }).orFail()
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id:${req.user._id} не найден` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};

module.exports.updateUserAvatar = (req, res) => {
  const { avatar } = req.body;
  User.findByIdAndUpdate(req.user._id, { avatar }, { new: true, runValidators: true }).orFail()
    .then((user) => res.status(OK).send({ data: user }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные пользователя.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Пользователь с id:${req.user._id} не найден` });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};
