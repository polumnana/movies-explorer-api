const router = require('express').Router();

const {
  getUserMe, updateUserInfo,
} = require('../controllers/userControllers');
const { validateGetUser, validateUpdateUser } = require('../utils/validateRoutes');

// возвращает пользователя из БД
router.get('/me', validateGetUser, getUserMe);

// обновляет информацию о пользователе
router.patch('/me', validateUpdateUser, updateUserInfo);

module.exports = router;
