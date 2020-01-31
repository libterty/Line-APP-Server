const express = require('express');
const bodyParser = require('body-parser');
const methodOverride = require('method-override');
const session = require('express-session');
const cors = require('cors');
const dataBaseConnect = require('./database/index');

const app = express();
const port = process.env.PORT || 3001;

if (process.env.NODE_ENV !== 'production') {
  require('dotenv').config();
}

dataBaseConnect();

app.use(
  cors({
    credentials: true,
    origin: true,
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  })
);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(methodOverride('_method'));
app.use((req, res, next) => {
  res.locals.user = req.user;
  next();
});

app.listen(port, () => {
  console.log(`Example app listening on port http://localhost:${port}!`);
});

require('./routes')(app);

module.exports = app;
