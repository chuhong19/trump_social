const siteRouter = require('./site');
const accountRouter = require('./account');
const userRouter = require('./user');
const postRouter = require('./post');

function route(app) {
  app.use('/account', accountRouter);
  app.use('/user', userRouter);
  app.use('/post', postRouter);
  app.use('/', siteRouter);
}

module.exports = route;
