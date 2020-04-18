const express = require('express');
const router = express.Router();

const index_controller = require('../controllers/indexController');

/* GET домашнюю страницу */
router.get('/', index_controller.index);

/* GET страницу входа*/
router.get('/login', index_controller.index_login);

/* GET страницу контактов*/
router.get('/contacts', index_controller.index_contacts);

/* POST нового пользователя*/
router.post('/', index_controller.user_create);

/* POST запрос на вход*/
router.post('/login', index_controller.user_login);



module.exports = router;
