const express = require('express');
const app = express();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let router = require('./router');
let userMaps = [];
let mongoose = require('mongoose');
let flash = require('connect-flash');
let bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost/slackclone');

//set the template engine ejs:
app.set('view engine', 'hbs');
//Intitialize express sessions.
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(passport.initialize());
app.use(passport.session());
//middlewares:
app.use(express.static('public'));
// Connect Flash
app.use(flash());
//Add route handling middleware:
app.use('/', router);

// Global Vars
app.use(function (req, res, next) {
    res.locals.success_msg = req.flash('success_msg');
    res.locals.error_msg = req.flash('error_msg');
    res.locals.error = req.flash('error');
    res.locals.user = req.user || null;
    next();
  });
  

//Listen on port 3000:
server = app.listen(3000, () => {
    console.log('Server listening on port ' + 3000);
});

//socket.io instantiation
const io = require("socket.io")(server);

//listen on every connection
io.on('connection', (socket) => {
    //listen on new_message:
    socket.on('new_message', (data) => {
        io.sockets.emit('new_message', { message: data.message, sender: data.sender, receiver: data.receiver, username: data.sender.replace('#', '') });
        //broadcast the new message:
    });
    //listen on typing:
    // socket.on('typing', (data) => {
    //     console.log(data);
    //     //socket.broadcast.emit('typing', { username: data.username })
    // });

    socket.on('disconnect', ()=>{
        console.log('User disconnected');
    });

    socket.on('user_created', (data)=>{
        io.sockets.emit('user_added', {username: data.username, previous_members: userMaps});
        userMaps.push(data.username);
    });
})
