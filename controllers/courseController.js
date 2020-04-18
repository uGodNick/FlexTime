const course = require('../models/course');
const user = require('../models/user');
const async = require('async')

exports.index = function (req, res) {
  async.parallel({
    course_count: function (callback) {
      course.count({}, callback);
    }
  }, function (err, results) {
      res.render('courses', { pageName: 'Курсы', error: err, data: results });
  });
};

// Показать список всех курсов
exports.course_list = function (req, res) {
  course.find({}, 'title author')
    .populate('author')
    .exec(function (err, list_books) {
      if (err) { return next(err); }
      //Successful, so render
      res.render('book_list', { title: 'Book List', book_list: list_books });
    });
};

// Показать подробную страницу курса
exports.course_detail = function (req, res) {
  res.send('NOT IMPLEMENTED: course detail: ' + req.params.id);
};

// Показать форму создания курса по запросу GET.
exports.course_create_get = function (req, res) {
  res.send('NOT IMPLEMENTED: course create GET');
};

// Создать курс по запросу POST.
exports.course_create_post = function (req, res) {
  res.send('NOT IMPLEMENTED: course create POST');
};

// Удалить курс по запросу POST.
exports.course_delete_post = function (req, res) {
  res.send('NOT IMPLEMENTED: course delete POST');
};

// Показать форму обновления курса по запросу GET.
exports.course_update_get = function (req, res) {
  res.send('NOT IMPLEMENTED: course update GET');
};

// Обновить курс по запросу POST.
exports.course_update_post = function (req, res) {
  res.send('NOT IMPLEMENTED: course update POST');
};
