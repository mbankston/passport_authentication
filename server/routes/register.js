var express = require('express');
var router = express.Router();
var passport = require('passport');
var path = require('path');
var Users = require('../models/user');

router.post('/', function(req,res,next) {
    Users.create(req.body, function (err, post) {
        if (err)
            next(err);
        else
            res.redirect('/users');
    })
});

router.get('/', function(req, res, next){
    res.sendFile(path.resolve(__dirname, '../public/assets/views/register.html'));
});



module.exports = router;