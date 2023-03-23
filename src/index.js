const express = require('express');
const { engine } = require('express-handlebars');
//const morgan = require('morgan');
const methodOverride = require('method-override');
const path = require('path');
const cookieParser = require('cookie-parser');
const session = require('express-session');
const RedisStore = require('connect-redis').default;
const Redis = require('ioredis');
const clientRedis = new Redis();

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

app.use(
  express.urlencoded({
    extended: true,
  })
);
app.use(express.json());

// Template engine
app.engine(
  'hbs',
  engine({
    extname: '.hbs',
  })
);

app.set('view engine', 'hbs');
app.set('views', path.join(__dirname, 'resources\\views'));

app.use(
  session({
    secret: 'keyboard cat',
    store: new RedisStore({ client: clientRedis }),
    resave: false,
    saveUninitialized: true,
    cookie: { secure: false },
  })
);

/////////////FACEBOOK LOGIN////////////////

const passport = require('passport');
const FacebookStrategy = require('passport-facebook').Strategy;

app.use(passport.initialize());
app.use(passport.session());

passport.serializeUser(function (user, done) {
  done(null, user);
});

passport.deserializeUser(function (user, done) {
  done(null, user);
});

passport.use(
  new FacebookStrategy(
    {
      clientID: '727200508718906',
      clientSecret: 'ac9309b2da39bf8bb614c6c83d6260ec',
      callbackURL:
        'https://9a7c-2405-4802-c3a2-8d50-746b-2658-5ef3-9c3f.ap.ngrok.io/auth/facebook/callback',
    },
    function (accessToken, refreshToken, profile, cb) {
      console.log(profile);
      return cb(null, profile);
    }
  )
);

app.get('/auth/facebook', passport.authenticate('facebook'));

app.get(
  '/auth/facebook/callback',
  passport.authenticate('facebook', { failureRedirect: '/login' }),
  function (req, res) {
    res.redirect('/');
  }
);

////////////////////////  FACEBOOKLOGIN //////////////////////////

route(app);

app.listen(port, () => {
  console.log(`Example app listening on port ${port}`);
});
