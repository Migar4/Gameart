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

passport.use(new localStrat(async (username, password, done) => {
    //authentication method
    const found_user = await User.findOne({username});

    if(!found_user){
        return done(null, false, {message: "No user with that username"});
    }

    try{
        if(await bcrypt.compare(password, found_user.password)){
            return done(null, found_user);
        }else{
            return done(null, false, {message: "Password incorrect"});
        }
    }catch(e){
        return done(e);
    }
}));

const find_user_id = async (id) => {
    return await User.findById(id);
}

//serialization and deserialization of the user
passport.serializeUser((user, done) => done(null, user.id));
passport.deserializeUser((id, done) => {
    return done(null, find_user_id(id));
});

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