const express = require('express');
const app = express();
let passport = require('passport');
let LocalStrategy = require('passport-local').Strategy;
let router = require('./router');
let mongoose = require('mongoose');
let flash = require('connect-flash');
let bodyParser = require('body-parser');
let User = require('./models/User');
let bcrypt = require('bcryptjs');
let userMaps = [];

//set the template engine hbs:
app.set('view engine', 'hbs');
//Intitialize express sessions:
app.use(require('express-session')({
    secret: 'keyboard cat',
    resave: false,
    saveUninitialized: false
}));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(passport.initialize());
app.use(passport.session());
//middlewares:
app.use(express.static('public'));
// Connect Flash:
app.use(flash());
//Add route handling middleware:
app.use('/', router);
//Set up the strategy for passport middleware:
//Use passport local strategy:
passport.use(new LocalStrategy(
    function (username, password, done) {
        User.findOne({ username: username })
            .then((user) => {
                if (!user) {
                    return done(done, false);
                }
                else {
                    if (verifyPassword(user, password)) {
                        user.password = null;
                        return done(null, user);
                    } else {
                        return done(null, false);
                    }
                }
            }).catch((err) => {
                if (err) {
                    return done(err);
                }
            });
    }));


passport.serializeUser(function (user, done) {
    done(null, user.id);
});

passport.deserializeUser(function (id, done) {
    User.findById(id, function (err, user) {
        done(err, user);
    });
});

// Set Global Vars:
app.use(function (req, res, next) {
    //Set up necessary flash messages:
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

    socket.on('disconnect', () => {
        console.log('User disconnected');
    });

    socket.on('user_created', (data) => {
        io.sockets.emit('user_added', { username: data.username, previous_members: userMaps });
        userMaps.push(data.username);
    });
})

//Set up connection to the database:
mongoose.Promise = global.Promise;
mongoose.connect('mongodb://localhost/slackclone', { useNewUrlParser: true })
    .then(() => {
        console.log('Establised connection to database');
    })
    .catch((err) => {
        console.error('Cannot connect to database');
    });

// Log the error upon an error event: 
mongoose.connection.on('error', (err) => {
    console.log('An error occured ' + err);
    console.error('Lost connection to database');
});

const verifyPassword = (user, password) => {
    return bcrypt.compareSync(password, user.password);
}

