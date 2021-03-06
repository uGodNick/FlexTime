const express = require('express');
const router = express.Router();

const course_controller = require('../controllers/coursesController');

/// МАРШРУТЫ КУРСОВ///

// GET домашнюю страницу
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

// POST удалить курс
router.post('/course:id/delete_course', course_controller.course_delete)

// POST лайк курса
router.post('/course:id/likeCourse(#author)?', course_controller.course_like);

// POST дизлайк урса
router.post('/course:id/dislikeCourse(#author)?', course_controller.course_dislike);

// POST создать комментарий
router.post('/course:id/create_comment', course_controller.course_create_comment);

// POST удалить комментарий
router.post('/course:courseId/delete_comment:commentId', course_controller.course_delete_comment);

// POST лайк коммент
router.post('/course:courseId/likeComment:commentId', course_controller.course_comment_like);

// POST дизлайк коммент
router.post('/course:courseId/dislikeComment:commentId', course_controller.course_comment_dislike);

module.exports = router;
