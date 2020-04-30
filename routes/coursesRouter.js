const express = require('express');
const router = express.Router();

var course_controller = require('../controllers/coursesController');

/// МАРШРУТЫ КУРСОВ///

// GET Домашнюю страницу
router.get('/', course_controller.courses_index);

// GET страницу с курсами по музыке
router.get('/music', course_controller.courses_music_list);

// GET страницу с курсами по здоровью
router.get('/health', course_controller.courses_health_list);

// GET страницу создания курса
router.get('/create', course_controller.courses_create_form);

// GET страницу куса
router.get('/course:id', course_controller.course_content);

// POST созданный курс
router.post('/create', course_controller.courses_create);

module.exports = router;
