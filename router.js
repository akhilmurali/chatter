let express = require('express');
let router = express.Router();
let controller = require('./controller');
let passport = require('passport');

//GET homepage:
router.get('/', controller.checkAuthentication, controller.root);
// GET Login: 
router.get('/login', controller.login);
//GET Registration:
router.get('/register', controller.getRegistrationForm);
// POST Registration:
router.post('/register', controller.register);
// POST Login:
router.post('/login', passport.authenticate('local', { failureRedirect: '/login' }), controller.homeRedirect);
//GET Logout:
router.get('/logout', controller.logout);

module.exports = router;