//Модули
const express = require('express');
const createError = require('http-errors');
const path = require('path');
const favicon = require('serve-favicon');
const logger = require('morgan');
const bodyParser = require('body-parser');
const cookieParser = require('cookie-parser');
const morgan = require('morgan');



const session = require('express-session');
const MongoStore = require('connect-mongo')(session);


//Переменные навигации
const indexRouter = require('./routes/indexRouter');
const userRouter = require('./routes/userRouter');
const coursesRouter = require('./routes/coursesRouter');

const compression = require('compression');
const helmet = require('helmet');

const app = express();


//Устанавка подключения к датабазе
const mongoose = require('mongoose');

const dev_db_url = 'mongodb://localhost/flextime'
const mongoDB = process.env.MONGODB_URI || dev_db_url;
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'pug');

app.use(logger('dev'));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(helmet());
app.use(compression());


app.use(express.static(path.join(__dirname, 'public')));
app.use(favicon(path.join(__dirname, 'public', 'favicon.ico')));

//Использование сессий с хранением ключа в MongoDB
app.use(
  session({
    secret: 'secret word',
    resave: true,
    saveUninitialized: false,
    store: new MongoStore({
      mongooseConnection: db
    }),
    cookie: {
      secure: false,
      httpOnly: true,
      maxAge: 365 * 24 * 60 * 60 * 1000
    }
  })
);

//Установка путей
app.use('/', indexRouter);
app.use('/users', userRouter);
app.use('/courses', coursesRouter);

//Ловля ошибок и передача их в обработчик ошибок
app.use(function (req, res, next) {
  next(createError(404));
});

// Обработчик ошибок
app.use(function (err, req, res, next) {
  // Установка локальной ошибки(только в режиме разработки)
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // Рендер страницы с ошибкой
  res.status(err.status || 500);
  res.render('error', {title: 'Ошибка'});
});

module.exports = app;
