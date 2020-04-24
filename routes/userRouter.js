const express = require('express');
const path = require('path');
const router = express.Router();
const user_controller = require('../controllers/userController');


const multer = require('multer')
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    cb(null, path.join(__dirname, '../public/uploads'))
  },
  filename: function (req, file, cb) {
    cb(null, file.fieldname + '-' + Date.now() + '.jpg')
  }
})

const upload = multer({ storage: storage })

/* GET домашнюю страницу */
router.get('/', function (req, res, next) {
  res.redirect('/')
});

/* GET запрос на определенного пользователя*/
router.get('/user:id', user_controller.user_load)

/* POST запрос на выход из аккаунта*/
router.post('/logout', user_controller.user_exit)

/* POST запрос на обновление аккаунта*/
router.post('/update', upload.single('profile__form__image'), user_controller.user_update)

module.exports = router; 
