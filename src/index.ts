import IntlPolyfill from 'intl';

Intl.NumberFormat = IntlPolyfill.NumberFormat;
Intl.DateTimeFormat = IntlPolyfill.DateTimeFormat;

import createError, { HttpError } from 'http-errors';
import express, { Request, Response } from 'express';
import bodyParser from 'body-parser';
import path from 'path';
import logger from 'morgan';
import exphbs from 'express-handlebars';
import dotenv, { config } from 'dotenv';
import session from 'express-session';
import redis from 'redis';
import connectRedis from 'connect-redis';

dotenv.config();

import indexRouter from './routes/index';
import dashboardRouter from './routes/dashboard';
import productRouter from './routes/product';
import customerRouter from './routes/customer';
import userRouter from './routes/user';
import shoppingCartRouter from './routes/shopping-cart';
import saleHistory from './routes/sales-history';
import screenConfig from './routes/screen-config';

const app = express();

// Setup session store
const RedisStore = connectRedis(session);
const client = redis.createClient({
    url: process.env.REDIS_URL
});

app.use(session({
    store: new RedisStore({ client }),
    secret: 'G$xBSHDNWea$L#USxmvVJtd4*6*N&KPu36wesqHLdqF#5zTY3-e9BjqaLYc^U!s8',
    resave: false,
    saveUninitialized: false,
}));

const publicDir = process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '..', 'src', 'public')
    : path.join(__dirname, 'public');

const viewsDir = process.env.NODE_ENV === 'development'
    ? path.resolve(__dirname, '..', 'src', 'views')
    : path.join(__dirname, 'views');

// Setup view engine
const hbs: any = exphbs.create({
    extname: '.hbs',
    helpers: {
        eq: (a: any, b: any) => a == b,
        isAnonId: (id: any) => id == process.env.ANON_ID,
        json: (obj: any) => JSON.stringify(obj)
    }
});

app.set('views', viewsDir);
app.engine('.hbs', hbs.engine);
app.set('view engine', '.hbs');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(logger('dev'));
app.use(express.urlencoded({ extended: false }));
app.use(express.static(publicDir));

app.use('/', indexRouter);
app.use('/dashboard', dashboardRouter);
app.use('/product', productRouter);
app.use('/customer', customerRouter);
app.use('/user', userRouter);
app.use('/shopping-cart', shoppingCartRouter);
app.use('/sales-history', saleHistory);
app.use('/screen-config', screenConfig);

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

app.listen(port, () => console.log('App started at http://localhost:' + port));
