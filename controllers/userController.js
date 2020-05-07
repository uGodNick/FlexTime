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
  body('email')
    .isEmail()
    .normalizeEmail(),
  body('username')
    .not().isEmpty()
    .trim()
    .escape(),
  body('password')
    .not().isEmpty()
    .trim()
    .escape(),
  check('password').isLength({ min: 8 }),

  // Процесс запроса после проверки формы
  (req, res, next) => {
    let errors = validationResult(req);
    if (!errors.isEmpty()) {
      //Отображение всех ошибок после валидации
      res.render(path.join('error'), { title: 'Ошибка', errors: errors.array() });
      return;
    } else {
      // Информация формы прошла проверку

      // Создание пользователя
      let query = {
        '_id': req.session.user_id
      }
      let newData = {
        'username': req.body.username,
        'password': req.body.password,
        'email': req.body.email
      }
      if (req.files) {
        console.log('Почему')
        let image = req.files.image;
        let imageName = image.name.slice(0, -3) + '-' + Date.now() + '.jpg'
        let src = path.join(__dirname, `../public/uploads/${imageName}`);
        image.mv(src, function (err) {
          if (err) { return next(err) }
        })
        newData.avatar = '/uploads/' + imageName
      }

      User.findOneAndUpdate(query, newData, function (err, doc) {
        if (err) { return next(err) }
        User.findOne({ 'username': req.body.username })
          .exec(function (err, user) {
            if (err) { return next(err); }
            if (user) {
              req.session.user = user
              res.redirect('back')
            } else {
              res.status('500');
              res.render('error', { title: 'Ошибка' });
            }
          })
      });
    }
  }
]
