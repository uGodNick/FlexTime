const express = require('express');
const router = express.Router();
const user_controller = require('../controllers/userController');



/* GET домашнюю страницу */
router.get('/', function (req, res, next) {
  res.redirect('/')
});

/* GET запрос на определенного пользователя*/
router.get('/user:id', user_controller.user_load)

/* POST запрос на выход из аккаунта*/
router.post('/logout', user_controller.user_exit)

module.exports = router;
