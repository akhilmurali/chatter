let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

const root = (req, res) => {
    res.render('index');
}

const getRegistrationForm = (req, res) => {
    res.render('register');
}

const login = (req, res) => {
    res.render('login');
}

const checklogincredentials = () => {
    passport.authenticate('local', { successRedirect: '/', failureRedirect: '/users/login', failureFlash: true });
}

const logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
}

const register = (req, res) => {
    var name = req.body.name;
    var email = req.body.email;
    var username = req.body.username;
    var password = req.body.password;
    var password2 = req.body.password2;

    let errors = null;

    if (errors) {
        res.render('register', {
            errors: errors
        });
    }
    else {
        //checking for email and username are already taken
        User.findOne({
            username: {
                "$regex": "^" + username + "\\b", "$options": "i"
            }
        }, function (err, user) {
            User.findOne({
                email: {
                    "$regex": "^" + email + "\\b", "$options": "i"
                }
            }, function (err, mail) {
                if (user || mail) {
                    res.render('register', {
                        user: user,
                        mail: mail
                    });
                }
                else {
                    var newUser = new User({
                        name: name,
                        email: email,
                        username: username,
                        password: password
                    });
                    User.createUser(newUser, function (err, user) {
                        if (err) throw err;
                        console.log(user);
                    });
                    req.flash('success_msg', 'You are registered and can now login');
                    res.redirect('/login');
                }
            });
        });
    }
}

passport.use(new LocalStrategy(
    function (username, password, done) {
        User.getUserByUsername(username, function (err, user) {
            if (err) throw err;
            if (!user) {
                return done(null, false, { message: 'Unknown User' });
            }

            User.comparePassword(password, user.password, function (err, isMatch) {
                if (err) throw err;
                if (isMatch) {
                    return done(null, user);
                } else {
                    return done(null, false, { message: 'Invalid password' });
                }
            });
        });
    }));

passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.getUserById(id, function (err, user) {
        done(err, user);
    });
});

module.exports = { root, login, register, checklogincredentials, getRegistrationForm, logout };