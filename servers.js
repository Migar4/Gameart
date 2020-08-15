const express = require("express");
const app = express();
const socketio = require("socket.io");
const bodyParser = require('body-parser');
const helmet = require('helmet');
const User = require('./models/user');

const mainRouter = require('./routes/mainRoute');

const SECRET = "GAMEART";

//authentication libs
const passport = require('passport');
const localStrat = require('passport-local');
const session = require('express-session');

//////////////////
//config passport
//////////////////

passport.use(new localStrat(User.authenticate));

//serialization and deserialization of the user
passport.serializeUser(User.serializeUser);
passport.deserializeUser(User.deserializeUser);

///////////////
//config app
//////////////

app.use(bodyParser.urlencoded({extended: false}));
app.use(bodyParser.json());
app.use(helmet());

app.set("view engine", "ejs");

app.use(session({
    secret: SECRET,
    resave: false,
    saveUninitialized: false
}));

app.use(passport.initialize());
app.use(passport.session());

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