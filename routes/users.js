const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');
const { METHOD_NOT_ALLOWED } = require('../utils/errors');

// router.patch('/users/me', updateUserInfo);
router.route('/users/me')
  .patch(updateUserInfo)
  .all((req, res) => res.status(METHOD_NOT_ALLOWED).send({ message: `Для маршрута ${req.originalUrl} метод ${req.method} не допустим` }));
// router.get('/users', getUsers);
// router.post('/users', createUser);
router.route('/users')
  .get(getUsers)
  .post(createUser)
  .all((req, res) => res.status(METHOD_NOT_ALLOWED).send({ message: `Для маршрута ${req.originalUrl} метод ${req.method} не допустим` }));

// router.get('/users/:userId', getUser);
router.route('/users/:userId')
  .get(getUser)
  .all((req, res) => res.status(METHOD_NOT_ALLOWED).send({ message: `Для маршрута ${req.originalUrl} метод ${req.method} не допустим` }));

// router.patch('/users/me/avatar', updateUserAvatar);
router.route('/users/me/avatar')
  .patch(updateUserAvatar)
  .all((req, res) => res.status(METHOD_NOT_ALLOWED).send({ message: `Для маршрута ${req.originalUrl} метод ${req.method} не допустим` }));

module.exports = router;
