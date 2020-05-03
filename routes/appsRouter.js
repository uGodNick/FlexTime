const express = require('express');
const router = express.Router();

const apps_controller = require('../controllers/appsController');

/// МАРШРУТЫ ПРИЛОЖЕНИЙ///

// GET Домашнюю страницу
router.get('/', apps_controller.index);


module.exports = router;
