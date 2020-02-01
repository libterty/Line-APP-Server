if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const redis = require('redis');
const cors = require('cors');
const passport = require('passport');
const dataBaseConnect = require('./database/index');
const helpers = require('./_helper');

const app = express();
const port = process.env.PORT || 3001;
const REDIS_URL =
  process.env.NODE_ENV === 'production'
    ? process.env.REDIS_URL
    : 'redis://127.0.0.1:6379';
let RedisStore = require('connect-redis')(session);
let redisClient = redis.createClient(REDIS_URL);

dataBaseConnect();
require('./middlewares/passport');

app.use(
  cors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(
  session({
    store: new RedisStore({ client: redisClient }),
    secret: 'lineappserver',
    name: 'lineappserver',
    resave: false,
    saveUninitialized: false
  })
);
app.use(function(req, res, next) {
  if (!req.session) return next(new Error('lost Connections'));
  next();
});
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.user = helpers.getUser(req);
  next();
});

app.listen(port, () => {
  console.log(`Example Redis Port Listening on port: ${REDIS_URL}`);
  console.log(`Example app listening on port http://localhost:${port}!`);
});

require('./routes')(app);

module.exports = app;
