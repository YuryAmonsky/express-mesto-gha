const router = require('express').Router();
const {
  getCards,
  createCard,
  deleteCard,
  likeCard,
  dislikeCard,
} = require('../controllers/cards');
const { METHOD_NOT_ALLOWED } = require('../utils/errors');

// router.get('/cards', getCards);
// router.post('/cards', createCard);
router.route('/cards')
  .get(getCards)
  .post(createCard)
  .all((req, res) => res.status(METHOD_NOT_ALLOWED).send({ message: `Для маршрута ${req.originalUrl} метод ${req.method} не допустим` }));

// router.delete('/cards/:cardId', deleteCard);
router.route('/cards/:cardId')
  .delete(deleteCard)
  .all((req, res) => res.status(METHOD_NOT_ALLOWED).send({ message: `Для маршрута ${req.originalUrl} метод ${req.method} не допустим` }));

// router.put('/cards/:cardId/likes', likeCard);
// router.delete('/cards/:cardId/likes', dislikeCard);
router.route('/cards/:cardId/likes')
  .put(likeCard)
  .delete(dislikeCard)
  .all((req, res) => res.status(METHOD_NOT_ALLOWED).send({ message: `Для маршрута ${req.originalUrl} метод ${req.method} не допустим` }));

module.exports = router;
