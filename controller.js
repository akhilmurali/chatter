let passport = require('passport');
let User = require('./models/User');
let bcrypt = require('bcryptjs');

const root = (req, res) => {
    res.render('chat');
}

const getRegistrationForm = (req, res) => {
    res.render('register');
}

const login = (req, res) => {
    res.render('login');
}

const homeRedirect = (req, res)=>{
    res.redirect('/');
}

const logout = (req, res) => {
    req.logout();
    req.flash('success_msg', 'You are logged out');
    res.redirect('/login');
}

const register = (req, res) => {
    if (req.body.password == req.body.password2) {
        let salt = bcrypt.genSaltSync(8);
        let hash = bcrypt.hashSync(req.body.password, salt);
        console.log(hash);
        req.body.password = hash;
        User.findOne({ username: req.body.username })
            .then((user) => {
                if (user) {
                    req.flash('status', 'User exits');
                    res.redirect('/login');
                }
            }).catch((err) => {
                res.json({ err: err });
            });
        User.create(req.body)
            .then((user) => {
                req.flash('status', 'singup successful');
                res.redirect('/login');
            })
            .catch((err) => {
                res.json({ err: err });
            })
    } else {
        req.flash('status', 'Password mismatch');
        res.redirect('/register');
    }
}

module.exports = { root, login, register, getRegistrationForm, logout, homeRedirect };













