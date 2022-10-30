/* eslint no-console: ["error", { allow: ["log"] }] */
const Card = require('../models/card');
const NotFoundError = require('../utils/errors/not-found-error');
const ForbidenError = require('../utils/errors/forbidden-error');
const {
  OK,
} = require('../utils/constants');

module.exports.getCards = (req, res, next) => {
  Card.find({}).populate('owner')
    .then((cards) => res.status(OK).send({ data: cards }))
    .catch(next);
};

module.exports.createCard = (req, res, next) => {
  const { name, link } = req.body;
  Card.create({ name, link, owner: req.user._id })
    .then((card) => {
      card.populate('owner')
        .then((cardDoc) => {
          res.status(OK).send({ data: cardDoc });
        })
        .catch(next);
    })
    .catch(next);
  /*
        if (err instanceof mongoose.Error.ValidationError) {
          return res.status(BAD_REQUEST)
          .send({ message: `Переданы некорректные данные карточки. ${err.message}` });
        }
  */
};

module.exports.deleteCard = (req, res, next) => {
  Card.findById(req.params.cardId)
    .orFail(new NotFoundError('Не найдена карточка с указанным _id.'))
    .then((cardDoc) => {
      if (req.user._id !== cardDoc.owner.toString()) {
        const err = new ForbidenError('Нельзя удалять чужую карточку');
        return Promise.reject(err);
      }
      return Card.findByIdAndRemove(req.params.cardId)
        .orFail(new NotFoundError('Не найдена карточка с указанным _id.'));
    })
    .then((card) => res.status(OK).send({ message: `Карточка _id:${card._id} удалена` }))
    .catch(next);
  /*
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
  */
};

module.exports.likeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $addToSet: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Не найдена карточка с указанным _id.'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(OK).send({ data: card }))
    .catch(next);
  /*
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
  */
};

module.exports.dislikeCard = (req, res, next) => {
  Card.findByIdAndUpdate(
    req.params.cardId,
    { $pull: { likes: req.user._id } },
    { new: true, runValidators: true },
  )
    .orFail(new NotFoundError('Не найдена карточка с указанным _id.'))
    .populate(['owner', 'likes'])
    .then((card) => res.status(OK).send({ data: card }))
    .catch(next);
  /*
      if (err instanceof mongoose.Error.CastError) {
        return res.status(BAD_REQUEST).send({ message: 'Переданы некорректные данные карточки.' });
      }
  */
};
