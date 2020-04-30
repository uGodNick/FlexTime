const Course = require('../models/course');
const CourseContent = require('../models/course-content');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const path = require('path');
const async = require('async');

exports.courses_index = function (req, res) {
  async.parallel({
    courses_music: function (callback) {

      Course.find({'theme':'music'})
        .exec(callback);
    },
    courses_health: function (callback) {

      Course.find({'theme': 'health'})
        .exec(callback);
    },
  }, function (err, results) {
      if (err) { return next(err); }
      if (req.session.user) {
        res.render('courses', {
          title: 'Курсы',
          courses_music_length:results.courses_music.length,
          courses_health_length: results.courses_health.length,
          user: req.session.user,
          user_url: req.session.user_url
        });
      } else {
        res.render('courses', {
          title: 'Курсы',
          courses_music_length: results.courses_music.length,
          courses_health_length: results.courses_health.length
        });
      }
    
  });
}

exports.courses_music_list = function (req, res) {
  Course.find({ 'theme': 'music' }).exec(function (err, courses_list) {
    if (err) { return next(err); }
    if (req.session.user) {
      if (courses_list.length == 0) {
        res.render('courses-list', { title: 'Курсы|Музыка', user: req.session.user, user_url: req.session.user_url})
      } else {
        res.render('courses-list', {
          title: 'Курсы|Музыка',
          courses_list: courses_list,
          user: req.session.user,
          user_url: req.session.user_url
        })
      }
    } else {
      if (courses_list.length == 0) {
        res.render('courses-list', { title: 'Курсы|Музыка' })
      } else {
        res.render('courses-list', { title: 'Курсы|Музыка', courses_list: courses_list })
      }
    }
  })
}

exports.courses_health_list = function (req, res) {
  Course.find({ 'theme': 'health' }).exec(function (err, courses_list) {
    if (req.session.user) {
      if (courses_list.length == 0) {
        res.render('courses-list', { title: 'Курсы|Здоровье', user: req.session.user, user_url: req.session.user_url })
      } else {
        res.render('courses-list', {
          title: 'Курсы|Здоровье',
          courses_list: courses_list,
          user: req.session.user
        })
      }
    } else {
      if (courses_list.length == 0) {
        res.render('courses-list', { title: 'Курсы|Здоровье' })
      } else {
        res.render('courses-list', { title: 'Курсы|Здоровье', courses_list: courses_list })
      }
    }
  })
}

exports.courses_create_form = function (req, res) {
  res.render('courses-create', {title: 'Создать курс', user: req.session.user, user_id: req.session.user_id})
}

exports.courses_create =  [
  body('course_name')
    .not().isEmpty()
    .trim()
    .escape(),
  body('course_theme')
    .not().isEmpty()
    .trim(),
  
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Отображение всех ошибок после валидации
      res.render('error', { title: 'Ошибка' , errors: errors.array() });
      return;
    } else {

      let contentArr = req.body.course_content.split('-')
      let contentConstructor = {
        keys: contentArr,
        content: []
      }

      for (let i = 0; i < contentArr.length; i++) {
        contentConstructor.content.push(req.body[contentArr[i]])
      }
      console.log(contentConstructor)

      let content = new CourseContent(contentConstructor)
      content.save(function (err) {
        if (err) { return next(err); }
        // Создание контента завершено
        CourseContent.findOne({ 'keys': contentArr }).exec(function (err, courseContent) {
          if (err) { return next(err); }
          let course = new Course(
            {
              title: req.body.course_name,
              author: req.body.course_author,
              theme: req.body.course_theme,
              content: courseContent._id

            });
          course.save(function (err) {
            if (err) { return next(err); }
            // Создание курса завершено
            res.redirect('/courses');
          });
        });
      })
    }
    }
]

exports.course_content = function (req, res, next) {
  Course.findOne({ '_id': req.params.id })
    .populate('content')
    .exec(function (err, course) {
      if (err) { return next(err); }
      if (course) {
        upRating = course.rating + 1
        Course.findOneAndUpdate({ '_id': req.params.id }, { 'rating': upRating}, function (err, doc) {
          if (err) { return next(err) }
        });
        if (req.session.user) {
          res.render('course', {
            title: 'Курсы',
            course: course,
            content: course.content.content,
            user: req.session.user,
            user_url: req.session.user_url
          })
        } else {
          res.render('course', {
            title: 'Курсы',
            course: course,
            content: course.content.content
          })
        }
        
    } else {
      res.redirect('back')
    }
  })
}

