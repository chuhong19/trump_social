const siteRouter = require('./site');
const accountRouter = require('./account');
const userRouter = require('./user');

function route(app) {
    app.use('/account', accountRouter);
    app.use('/user', userRouter);
    app.use('/', siteRouter);
}

module.exports = route;