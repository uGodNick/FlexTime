const Course = require('../models/course');
const CourseContent = require('../models/course-content');
const CourseComment = require('../models/course-comment');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const path = require('path');
const async = require('async');

exports.courses_index = function (req, res) {
  async.parallel({
    courses_music: function (callback) {

      Course.find({ 'theme': 'music' })
        .exec(callback);
    },
    courses_health: function (callback) {

      Course.find({ 'theme': 'health' })
        .exec(callback);
    },
  }, function (err, results) {
    if (err) { return next(err); }
    if (req.session.user) {
      res.render('courses', {
        title: 'Курсы',
        courses_music_length: results.courses_music.length,
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
        res.render('courses-list', { title: 'Курсы|Музыка', user: req.session.user, user_url: req.session.user_url })
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
  res.render('courses-create', { title: 'Создать курс', user: req.session.user, user_id: req.session.user_id })
}

exports.courses_create = [
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
      res.render('error', { title: 'Ошибка', errors: errors.array() });
      return;
    } else {

      let contentArr = req.body.course_content.split('-')
      let contentConstructor = {
        keys: contentArr,
        content: []
      }

      for (let i = 0; i < contentArr.length; i++) {
        if (contentArr[i][0] == 'i') {
          let image = req.files[contentArr[i]];
          let imageName = image.name.slice(0, -3) + '-' + Date.now() + '.jpg'
          let src = path.join(__dirname, `../public/uploads/${imageName}`);
          image.mv(src, function (err) {
            if (err) { return next(err) }
          })
          contentConstructor.content.push(`/uploads/${imageName}`)
        } else {
          contentConstructor.content.push(req.body[contentArr[i]])
        }
      }

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
    .populate('author')
    .populate('content')
    .populate({
      path: 'comments',
      populate: {
        path: 'author'
      }
    })
    .exec(function (err, course) {
      if (err) { return next(err); }
      if (course) {
        upRating = course.rating + 1
        Course.findOneAndUpdate({ '_id': req.params.id }, { 'rating': upRating }, function (err, doc) {
          if (err) { return next(err) }
        });
        if (req.session.user) {
          let isLike = false;
          let isDislike = false;
          if (course.like_by.indexOf(req.session.user_id) != -1) {
            isLike = true
          }
          if (course.dislike_by.indexOf(req.session.user_id) != -1) {
            isDislike = true
          }
          res.render('course', {
            title: course.title,
            course: course,
            author: course.author,
            content: course.content,
            comments: course.comments,

            user: req.session.user,
            user_id: req.session.user_id,
            user_url: req.session.user_url,
            isLikeCourse: isLike,
            isDislikeCourse: isDislike
          })
        } else {
          res.render('course', {
            title: course.title,
            course: course,
            author: course.author,
            content: course.content,
            comments: course.comments,
          })
        }

      } else {
        res.redirect('back')
      }
    })
}

exports.course_like = function (req, res, next) {

  
  
  Course.findOne({ '_id': req.params.id }).exec(function (err, course) {
    if (course) {
      if (err) { return next(err) }
      let dislikeList = course.dislike_by
      let upRating = Number(course.rating) + 20

      if (dislikeList.indexOf(req.session.user_id) != -1) {
        dislikeList.splice(dislikeList.indexOf(req.session.user_id), 1)
        upRating += 20
      }

      
      let likeList = course.like_by
      likeList.push(req.session.user_id)
      Course.findOneAndUpdate({ '_id': req.params.id }, { 'dislike_by': dislikeList, 'like_by': likeList, 'rating': upRating }, function (err, doc) {
        if (err) { return next(err) }
        res.redirect('back')
      })
    }
    
  })

}

exports.course_dislike = function (req, res, next) {
  Course.findOne({ '_id': req.params.id }).exec(function (err, course) {
    if (course) {
      if (err) { return next(err) }
      let likeList = course.like_by
      let downRating = Number(course.rating) - 20

      if (likeList.indexOf(req.session.user_id) != -1) {
        likeList.splice(likeList.indexOf(req.session.user_id), 1)
        downRating -= 20
      }

      
      let dislikeList = course.dislike_by
      dislikeList.push(req.session.user_id)
      Course.findOneAndUpdate({ '_id': req.params.id }, { 'like_by': likeList, 'dislike_by': dislikeList, 'rating': downRating }, function (err, doc) {
        if (err) { return next(err) }
        res.redirect('back')
      })
    }

  })
}

exports.course_create_comment = [
  body('course_comment')
    .not().isEmpty()
    .trim()
    .escape(),

  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Отображение всех ошибок после валидации
      res.render('error', { title: 'Ошибка', errors: errors.array() });
      return;
    } else {


      let comment = new CourseComment({
        'author': req.session.user_id,
        'content': req.body.course_comment,
      })
      comment.save(function (err) {
        if (err) { return next(err) }
        CourseComment.findOne({ 'content': req.body.course_comment }).exec(function (err, comment) {
          Course.findOne({ '_id': req.params.id }).exec(function (err, course) {
            if (err) { return next(err) }
            let commentList = course.comments
            commentList.push(comment._id)
            Course.findOneAndUpdate({ '_id': req.params.id }, { 'comments': commentList }, function (err) {
              if (err) { return next(err) }
              res.redirect('back')
            })
          })
        })
        
      })
     

      
    }
  }
]

exports.course_comment_like = function (req, res, next) {
  CourseComment.findOne({ '_id': req.params.commentId }).exec(function (err, comment) {
    if (comment) {
      if (err) { return next(err) }
      let dislikeList = comment.dislike_by
      let upRating = Number(comment.rating) + 5
      if (dislikeList.indexOf(req.session.user_id) != -1) {
        dislikeList.splice(dislikeList.indexOf(req.session.user_id), 1)
        upRating += 5
      }
      
      let likeList = comment.like_by
      likeList.push(req.session.user_id)
      CourseComment.findOneAndUpdate({ '_id': req.params.commentId }, { 'dislike_by': dislikeList, 'like_by': likeList, 'rating': upRating }, function (err, doc) {
        if (err) { return next(err) }
        res.redirect('back')
      })
    }

  })
}

exports.course_comment_dislike = function (req, res, next) {
  CourseComment.findOne({ '_id': req.params.commentId }).exec(function (err, comment) {
    if (comment) {
      if (err) { return next(err) }
      let likeList = comment.like_by
      let downRating = Number(comment.rating) - 5

      if (likeList.indexOf(req.session.user_id) != -1) {
        likeList.splice(likeList.indexOf(req.session.user_id), 1)
        downRating -= 5
      }

      
      let dislikeList = comment.dislike_by
      dislikeList.push(req.session.user_id)
      CourseComment.findOneAndUpdate({ '_id': req.params.commentId }, { 'dislike_by': dislikeList, 'like_by': likeList, 'rating': downRating }, function (err, doc) {
        if (err) { return next(err) }
        res.redirect('back')
      })
    }

  })
}
