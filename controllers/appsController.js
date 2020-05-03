const async = require('async');

/// МАРШРУТЫ ГЛАВНОЙ СТАРНИЦЫ///

// Отобразить главную страницу
exports.index = function (req, res, next) {
  if (req.session.user) {
    
    res.render('apps', {
      title: 'Приложения',
      user: req.session.user,
      user_url: req.session.user_url
    });
  } else {
    res.render('apps', { title: 'Приложения' });
  }
};
