const express = require('express');
const {engine} = require('express-handlebars');
const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const cookieParser = require('cookie-parser');

const app = express();
const port = 3000;

const route = require('./routes');
const db = require('./config');

// Connect to DB
db.connect();

app.use(cookieParser());
app.use(methodOverride('_method'));

// HTTP logger
//app.use(morgan('combined'));

app.use(express.static(path.join(__dirname, 'public')));

app.use(express.urlencoded({
  extended: true
}));
app.use(express.json());

// Template engine
app.engine('hbs', engine({
  extname: '.hbs'
}));

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources\\views'));

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`)
})