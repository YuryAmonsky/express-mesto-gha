/* eslint no-console: ["error", { allow: ["log"] }] */
const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  INTERNAL_SERVER,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({}).orFail().populate('owner')
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch((err) => {
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Карточки не найдены. ${err.message}` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};

module.exports.createCard = (req, res) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner')
        .then((cardDoc) => {
          res.status(OK).send({ data: cardDoc });
        })
        .catch((err) => res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` }));
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findByIdAndRemove(req.params.cardId).orFail()
    .then((card) => {
      Card.findById(req.params.cardId).orFail()
        .then(() => res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. Карточка _id:${card._id} не была удалена` }))
        .catch((err) => {
          if (err instanceof mongoose.Error.DocumentNotFoundError) {
            res.status(OK).send({ message: `Карточка _id:${card._id} удалена` });
          }
        });
    })
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Не найдена карточка с указанным _id. ${err.message}` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};

module.exports.likeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Не найдена карточка с указанным _id. ${err.message}` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};

module.exports.dislikeCard = (req, res) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail()
    .populate(['owner', 'likes'])
    .then((card) => res.status(OK).send({ data: card }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError
        || err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: `Не найдена карточка с указанным _id. ${err.message}` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};
