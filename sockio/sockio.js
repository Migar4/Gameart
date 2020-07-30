const io = require('../servers').io;
const mongoose = require('mongoose');
const archiver = require('archiver');
const fs = require('fs');

//the javascript class
var Card = require('../classes/cards');

//the mongoose model
const cardModel = require('../models/cards').Card;

//categories
const {catAll, cat2D, cat3D, catIso, catUI, catSound} = require('../models/categories');


//when there is a connection
io.on('connection', async (socket) => {

    //make a variable to hold the cards to be sent
    let cards = [];

    /////////
    //initial
    /////////
    try{

        //find all cards and push for the cards array
        await cardModel.find({}, (err, data) => {
            if(err)
                console.log(err);
            else{
                data.forEach((card) => {
                    var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                    cards.push(c);
                });
            }
        });
    }catch(e){
        console.log(e);
    }

    //send it once when joined
    socket.emit('cards', cards);



    /////////
    //on type
    /////////

    //get the input that was given in the search bar
    socket.on('find', async (input) => {
        //clear all the cards
        cards = [];

        try{
            let data = [];
            
            //if there is input make a regular expression with the input and search the db
            if(input != ''){
                let reg = new RegExp('^' + input, 'i');
                data = await cardModel.find({name: reg});
            }
            else
                data = await cardModel.find({});


            //for all that is in the data array make a new instance of the card class and push for the array
            data.forEach((card) => {
                var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                cards.push(c);
            });
                

        }catch(e){
            console.log(e);
        }

        //emit the cards array with the event
        socket.emit('cards', cards);

    });


    /////////////
    //on category
    /////////////

    //get the category that was clicked
    socket.on('cat', async (cat) => {

        //clear all cards
        cards = [];

        //select the category
        switch(cat){

            case 0:
                try{
                    let data = await catAll.find({}).populate('cards').exec();

                    data[0].cards.forEach((card) => {
                        var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                        cards.push(c);
                    });

                    break;
                }catch(e){
                    console.log(e);
                }

            case 1:
                try{
                    let data = await cat2D.find({}).populate('cards').exec();

                    data[0].cards.forEach((card) => {
                        var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                        cards.push(c);
                    });

                    break;
                }catch(e){
                    console.log(e);
                }

            case 2:
                try{
                    let data = await catIso.find({}).populate('cards').exec();

                    data[0].cards.forEach((card) => {
                        var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                        cards.push(c);
                    });

                    break;
                }catch(e){
                    console.log(e);
                }
            
            case 3:
                try{
                    let data = await cat3D.find({}).populate('cards').exec();

                    data[0].cards.forEach((card) => {
                        var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                        cards.push(c);
                    });

                    break;
                }catch(e){
                    console.log(e);
                }
                            
            case 4:
                try{
                    let data = await catUI.find({}).populate('cards').exec();

                    data[0].cards.forEach((card) => {
                        var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                        cards.push(c);
                    });

                    break;
                }catch(e){
                    console.log(e);
                }
                            
            case 5:
                try{
                    let data = await catSound.find({}).populate('cards').exec();

                    data[0].cards.forEach((card) => {
                        var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                        cards.push(c);
                    });

                    break;
                }catch(e){
                    console.log(e);
                }

                            
            default:
                try{
                    let data = await catAll.find({}).populate('cards').exec();

                    data[0].cards.forEach((card) => {
                        var c = new Card(card._id.toString(), card.name, card.showImage, card.description);
                        cards.push(c);
                    });

                    break;
                }catch(e){
                    console.log(e);
                }

        }

        //emit the cards array with the event
        socket.emit('cards', cards);
    });
});