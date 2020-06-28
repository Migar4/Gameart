var express = require("express");
var app = express();
const socketio = require("socket.io");
const mongoose = require("mongoose");
const cardModel = require('./models/cards').Card;
// require('./seed')();

app.use(express.static(__dirname + '/public'));

mongoose.connect('mongodb://127.0.0.1:27017/gameart', {
    useNewUrlParser: true,
    useCreateIndex: true,
    useFindAndModify: false,
    useUnifiedTopology: true
}).then((data)=>{
    console.log("Connected to database");
}).catch((e) => {
    console.log(e);
});

const expressServer = app.listen(3000, () => {
    console.log("listening on port 3000");
});
const io = socketio(expressServer);

//made
var Card = require("./classes/cards");


app.set("view engine", "ejs");
app.use(express.static(__dirname + '/views'));


app.get("*", (req, res) => {
    res.render("index", {cards: {}});
});



io.on('connection', async (socket) => {
    let cards = [];

    /////////
    //initial
    /////////
    try{
        await cardModel.find({}, (err, data) => {
            if(err)
                console.log(err);
            else{
                data.forEach((card) => {
                    var c = new Card(card.name, card.image, card.description);
                    cards.push(c);
                });
            }
        });
    }catch(e){
        console.log(e);
    }
    
    socket.emit('cards', cards);

    /////////
    //on type
    /////////

    socket.on('find', async (input) => {
        cards = [];

        try{
            let data = [];
            
            if(input != ''){
                let reg = new RegExp('^' + input, 'i');
                data = await cardModel.find({name: reg});
            }
            else
                data = await cardModel.find({});

            data.forEach((card) => {
                var c = new Card(card.name, card.image, card.description);
                cards.push(c);
            });
                

        }catch(e){
            console.log(e);
        }

        socket.emit('cards', cards);

    });
});
