const router = require('express').Router();
const {
  getUsers,
  getUser,
  updateUserInfo,
  updateUserAvatar,
} = require('../controllers/users');

router.get('/me', getUser);
router.patch('/me', updateUserInfo);
router.get('/', getUsers);
router.get('/:userId', getUser);
router.patch('/me/avatar', updateUserAvatar);

module.exports = router;
