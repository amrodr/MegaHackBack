const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const cors = require('cors');

const bookRoute = require('../src/routes/books');
const userRoute = require('../src/routes/user');

app.use(cors({
    origin: '*',
    exposeHeaders: ['WWW-Authenticate', 'Server-Authorization'],
    maxAge: 5,
    credentials: true,
    allowMethods: ['GET', 'POST', 'UPDATE', 'PUT', 'PATCH', 'DELETE'],
    allowHeaders: ['Content-Type', 'Authorization', 'Accept']
}));

app.use(bodyParser.json({}));
app.use(bodyParser.urlencoded({limit: '500mb', extended: false }));

app.use('/books', bookRoute);
app.use('/user', userRoute);

module.exports = app;