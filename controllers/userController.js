var User = require('../models/user');
const { body, validationResult } = require('express-validator');

/// МАРШРУТЫ ГЛАВНОЙ СТАРНИЦЫ///

// Загрузка пользователя
exports.user_load = function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) { return next(err); }
    if (user == null) {
      var err = new Error('Пользователь не найден');
      err.status = 404;
      return next(err);
    }
    if (req.session.user) {
      if (req.session.user_id === req.params.id) {
        res.render('user', {
          title: user.username,
          user: req.session.user,
          current_user: user,
          user_url: req.session.user_url,
          is_user: true
        });
      } else {
        res.render('user', {
          title: user.username,
          user: req.session.user,
          user_url: req.session.user_url,
          current_user: user
        });
      }
    } else {
      res.render('user', {
        title: user.username,
        current_user: user
      });
    }

  });
};

// Выход пользователя
exports.user_exit = function (req, res) {
  req.session.destroy();
  res.redirect('/')
}
