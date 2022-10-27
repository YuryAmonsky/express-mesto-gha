const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/users/me', getUser);
router.patch('/users/me', updateUserInfo);
router.get('/users', getUsers);
router.get('/users/:userId', getUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
