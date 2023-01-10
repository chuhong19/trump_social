
const jwt = require('jsonwebtoken');
const Account = require('../models/Account');

module.exports.requireAuth = function (req, res, next) {
    try {
        var token = req.cookies.token;
        var id = jwt.verify(token, 'mk')._id;
        var user = Account.findOne({_id: id});
        if (!user) {
            res.redirect('login');
        }
        next();
    } catch (err) { 
        res.redirect('login'); 
    }
};