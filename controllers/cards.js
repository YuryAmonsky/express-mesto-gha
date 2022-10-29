/* eslint no-console: ["error", { allow: ["log"] }] */
const mongoose = require('mongoose');
const Card = require('../models/card');
const {
  OK,
  BAD_REQUEST,
  NOT_FOUND,
  FORBIDDEN,
  INTERNAL_SERVER,
} = require('../utils/errors');

module.exports.getCards = (req, res) => {
  Card.find({}).populate('owner')
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch((err) => res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` }));
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
      if (err instanceof mongoose.Error.ValidationError) {
        return res.status(BAD_REQUEST).send({ message: `Переданы некорректные данные карточки. ${err.message}` });
      }
      return res.status(INTERNAL_SERVER).send({ message: `Произошла ошибка на сервере. ${err.message}` });
    });
};

module.exports.deleteCard = (req, res) => {
  Card.findById(req.params.cardId).orFail()
    .then((cardDoc) => {
      console.log(req.user._id);
      console.log(cardDoc.owner.toString());
      if (req.user._id !== cardDoc.owner.toString()) {
        const err = new Error('Нельзя удалять чужую карточку');
        err.name = 'Forbidden';
        return Promise.reject(err);
      }
      return Card.findByIdAndRemove(req.params.cardId).orFail();
    })
    .then((card) => res.status(OK).send({ message: `Карточка _id:${card._id} удалена` }))
    .catch((err) => {
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Не найдена карточка с указанным _id.' });
      }
      if (err.name === 'Forbidden') {
        return res.status(FORBIDDEN).send({ message: err.message });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
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
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Не найдена карточка с указанным _id.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
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
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
      if (err instanceof mongoose.Error.DocumentNotFoundError) {
        return res.status(NOT_FOUND).send({ message: 'Не найдена карточка с указанным _id.' });
      }
      return res.status(INTERNAL_SERVER).send({ message: 'Произошла ошибка на сервере.' });
    });
};
