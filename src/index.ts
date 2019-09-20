import IntlPolyfill from 'intl';

Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

import createError, { HttpError } from 'http-errors';
import express, { Request, Response } from 'express';
import path from 'path';
import logger from 'morgan';
import exphbs from 'express-handlebars';
import dotenv from 'dotenv';

dotenv.config();

import indexRouter from './routes/index';
import productRouter from './routes/product';
import customerRouter from './routes/customer';

const app = express();

app.set('views', path.join(__dirname, 'views'));
app.engine('.hbs', exphbs({ extname: '.hbs' }));
app.set('view engine', '.hbs');

app.use(express.json());
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(path.join(__dirname, 'public')));

app.use('/', indexRouter);
app.use('/product', productRouter);
app.use('/customer', customerRouter);

// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next(createError(404));
});

// error handler
app.use(function (err: HttpError, req: Request, res: Response) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get('env') === 'development' ? err : {};

    // render the error page
    res.status(err.status || 500);
    res.render('error', { title: 'Figaro - Erro ' + err.status });
});

const port = process.env.PORT || 3000;

app.listen(port, () => console.log('App listening on port ' + port));
