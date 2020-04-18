const express = require('express');
const router = express.Router();

var course_controller = require('../controllers/courseController');

/// МАРШРУТЫ КУРСОВ///

// GET courses home page. 
router.get('/courses', course_controller.index);

router.get('/courses/create', course_controller.course_create_get);

// POST request for creating course.
router.post('/courses/create', course_controller.course_create_post);

// POST request to delete course.
router.post('/courses/:id/delete', course_controller.course_delete_post);

// GET request to update course.
router.get('/courses/:id/update', course_controller.course_update_get);

// POST request to update course.
router.post('/courses/:id/update', course_controller.course_update_post);

// GET request for one course.
router.get('/courses/:id', course_controller.course_detail);

module.exports = router;
