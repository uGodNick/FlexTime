const express = require('express');
const path = require('path');
const router = express.Router();
const user_controller = require('../controllers/userController');


/* GET домашнюю страницу */
router.get('/', function (req, res, next) {
  res.redirect('/')
});

/* GET запрос на определенного пользователя*/
router.get('/user:id', user_controller.user_load)

/* POST запрос на выход из аккаунта*/
router.post('/user:id/logout', user_controller.user_exit)

/* POST запрос на обновление аккаунта*/
router.post('/user:id/update', user_controller.user_update)

module.exports = router; 
