let express = require('express');
let router = express.Router();
let controller = require('./controller');
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;

router.get('/', controller.root);

// Login:
router.get('/login', controller.login);

router.get('/register', controller.getRegistrationForm);

// Register User:
router.post('/register', controller.register);

router.post('login',controller.checklogincredentials);

router.get('/logout', controller.logout);

module.exports = router;