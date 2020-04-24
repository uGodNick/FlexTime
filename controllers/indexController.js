const User = require('../models/user');
const async = require('async');
const { check, validationResult } = require('express-validator');
const { body } = require('express-validator');

/// МАРШРУТЫ ГЛАВНОЙ СТАРНИЦЫ///

// Отобразить главную страницу
exports.index = function (req, res, next) {
  if (req.session.user) {
    User.findOneAndUpdate({ '_id': req.session.user_id }, { 'last_active_date': new Date() }, function (err) {
      if (err) { return next(err) }
    });
    res.render('index', {
      title: 'Главная',
      user: req.session.user,
      user_url: req.session.user_url
    });
  } else {
    res.render('index', { title: 'Главная'});
  }
};

// Отобразить страницу входа
exports.index_login = function (req, res, next) {
  if (req.session.user) {
    res.redirect('/')
  } else if (req.session.new_login) {
    res.render('login', { title: 'Вход', login: req.session.new_login, password: req.session.new_password });
  } else {
    res.render('login', { title: 'Вход' });
  }
}

// Отобразить страницу контактов
exports.index_contacts = function (req, res) {
  if (req.session.user) {
    User.findOneAndUpdate({ '_id': req.session.user_id }, { 'last_active_date': new Date() }, function (err) {
      if (err) { return next(err) }
    });
    res.render('contacts', {
      title: 'Контакты',
      username: req.session.user.username,
      user: req.session.user,
      user_url: req.session.user_url
    })
  } else {
    res.render('contacts', { title: 'Контакты' });
  }
}

// Зарегистрировать пользователя
exports.user_create = [
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
      res.render('index', { title: 'Главная', errors: errors.array() });
      return;
    }
    else {
      // Информация формы прошла проверку

      // Создание пользователя
      let user = new User(
        {
          username: req.body.username,
          password: req.body.password,
          email: req.body.email,
        });
      user.save(function (err) {
        if (err) { return next(err); }
        // Создание пользователя завершено
        req.session.new_login = req.body.username
        req.session.new_password = req.body.password
        res.redirect('login');
      });
    }
  }
  
];

// Вход пользователя
exports.user_login = function (req, res, next) {

  User.findOne({ 'username': req.body.login })
    .exec(function (err, user) {
      if (err) { return next(err); }
      if (user) {
        if (user.password === req.body.password) {

          req.session.user = user
          req.session.user_id = user._id
          req.session.user_url = user.url

          User.findOneAndUpdate({ 'username': user.username }, { 'last_active_date': new Date() }, function (err, doc) {
            if (err) { return next(err) }
          });

          res.redirect(user.url)
        } else {
          res.render('login', { title: 'Вход', error: 'Неверный логин или пароль'})
        }
      } else {
        res.render('login', { title: 'Вход', error: 'Неверный логин или пароль' })
      }
    })

};

// Проверка на существующего пользователя
exports.isExist = function (req, res, next) {
  User.findOne({ 'username': req.body.username }).exec(function (err, user) {
    if (user) {
      res.redirect('back');

    } else {
      next();
    }
  })
}
