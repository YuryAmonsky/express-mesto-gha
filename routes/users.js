const router = require('express').Router();
const {
  getUsers,
  getUser,
  createUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.patch('/users/me', updateUserInfo);
router.get('/users', getUsers);
router.post('/users', createUser);
router.get('/users/:userId', getUser);
router.patch('/users/me/avatar', updateUserAvatar);

module.exports = router;
