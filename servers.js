const express = require("express");
const app = express();
const socketio = require("socket.io");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const User = require('./models/user');

const mainRouter = require('./routes/mainRoute');


//authentication libs
const passport = require('passport');

//////////////////
//config passport
//////////////////

require('./config/passport')(passport);

///////////////
//config app
//////////////

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

app.set("view engine", "ejs");

// app.use(session({
//     secret: SECRET,
//     resave: false,
//     saveUninitialized: false
// }));

app.use(passport.initialize());

app.use(express.static(__dirname + '/views'));
app.use(express.static(__dirname + '/public'));

app.use(mainRouter);


const expressServer = app.listen(3000, () => {
    console.log("listening on port 3000");
});
const io = socketio(expressServer);

module.exports = {
    app,
    io
};