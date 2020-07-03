var express = require("express");
var app = express();
const socketio = require("socket.io");


const mainRouter = require('./routes/mainRoute');

// const cardModel = require('./models/cards').Card;
// // require('./seed')();

app.set("view engine", "ejs");

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