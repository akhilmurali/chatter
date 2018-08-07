const express = require('express');
const app = express();
let userMaps = [];
//set the template engine ejs:
app.set('view engine', 'hbs');

//middlewares:
app.use(express.static('public'));

//routes
app.get('/', (req, res) => {
    res.render('index');
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
