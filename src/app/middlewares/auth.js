const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

module.exports.requireAuth = function (req, res, next) {
  try {
    const token = req.cookies.token;
    const id = jwt.verify(token, 'mk')._id;
    const user = Account.findOne({ _id: id });
    if (!user) {
      res.redirect('login');
    }
    next();
  } catch (err) {
    res.redirect('login');
  }
};
