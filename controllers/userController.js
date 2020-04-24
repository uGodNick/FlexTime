const User = require('../models/user');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');
const path = require('path');



/// МАРШРУТЫ ГЛАВНОЙ СТАРНИЦЫ///

// Загрузка пользователя
exports.user_load = function (req, res, next) {
  User.findById(req.params.id, function (err, user) {
    if (err) { return next(err); }
    if (user == null) {
      let err = new Error('Пользователь не найден');
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
  res.clearCookie('connect.sid');
  res.redirect('/')
}

// Обновление пользователя
exports.user_update = [
  // Валидация формы
  body('profile__form__email')
    .isEmail()
    .normalizeEmail(),
  body('profile__form__name')
    .not().isEmpty()
    .trim()
    .escape(),
  body('profile__form__password')
    .not().isEmpty()
    .trim()
    .escape(),
  check('profile__form__password').isLength({ min: 8 }),

  // Процесс запроса после проверки формы
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Отображение всех ошибок после валидации
      res.render(path.join('users/user', req.session.user_id), { title: req.session.user, errors: errors.array() });
      return;
    } else {
      // Информация формы прошла проверку
      
      // Создание пользователя
      let query = {
        '_id': req.session.user_id
      }
      let newData = {
        'username': req.body.profile__form__name,
        'password': req.body.profile__form__password,
        'email': req.body.profile__form__email
      }
      if (req.file) {
        newData.avatar = '/uploads/' + req.file.filename
      }

      User.findOneAndUpdate(query, newData, function (err, doc) {
        if (err) { return next(err) }
        
      });

      User.findOne({ 'username': req.body.profile__form__name })
        .exec(function (err, user) {
          if (err) { return next(err); }
          if (user) {
              req.session.user = user
              res.redirect('back')
          } else {
            res.status(err.status || 500);
            res.render('error', { title: 'Ошибка' });
          }
        })
    }
  }
]
