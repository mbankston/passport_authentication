var express = require('express');
var mongoose = require('mongoose');
var bodyParser = require('body-parser');

//Route Files
var index = require('./routes/index');
var register = require('./routes/register');
var users = require('./routes/users');

//Passport Setup
var passport = require('passport');
var session = require('express-session');
var localStrategy = require('passport-local').Strategy;

//MongoDB setup
var User = require('./models/user');
var mongoURI = "mongodb://localhost:27017/mean-skeleton-auth";
var mongoDB = mongoose.connect(mongoURI).connection;
mongoDB.on('error', function(err){
    if(err) console.log("MONGO ERROR: ", err);
});
mongoDB.once('open', function(){
    console.log("CONNECTED TO MONGODB!");
});

var app = express();


app.use(session({
    secret: 'secret',
    key: 'user',
    resave: true,
    s: false,
    cookie: { maxAge: 60000, secure: false }
}));
app.use(passport.initialize());
app.use(passport.session());
passport.serializeUser(function(user, done) {
    done(null, user.id);
});
passport.deserializeUser(function(id, done) {
    User.findById(id, function(err,user){
        if(err) done(err);
        done(null, user);
    });
});
passport.use('local', new localStrategy({
        passReqToCallback : true,
        usernameField: 'username'
    },
    function(req, username, password, done){
        User.findOne({ username: username }, function(err, user) { //finds user by unique username
            if (err) throw err;
            if (!user) //if user not found
                return done(null, false, {message: 'Incorrect username and password.'});

            // test a matching password from the user we found
            user.comparePassword(password, function(err, isMatch) {
                if (err) throw err;
                if(isMatch) return done(null, user);
                else done(null, false, { message: 'Incorrect username and password.' });
            });
        });
    }
));

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({expanded:true}));

app.use('/register', register);
app.use('/users', users);
app.use('/', index);

app.set('port', (process.env.PORT || 5000));
app.listen(app.get('port'), function() {
    console.log("Now listening on port: " + app.get('port'));
});

module.exports = app;