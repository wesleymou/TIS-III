const createError = require('http-errors');
const express = require('express');
const path = require('path');
const logger = require('morgan');
const exphbs = require('express-handlebars');
const dotenv = require('dotenv');

const indexRouter = require('./routes/index')

dotenv.config();

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
  next(createError(404));
});

// error handler
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get('env') === 'development' ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render('error', { title: 'Error' });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('App listening on port ' + port));
