const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    image:{
        type: String,
        required: true
    },
    name: {
        type: String
    },
    description:{
        type: String
    },
    type:{
        type: String
    },
    tags:{
        type: Array
    }
});

const Card = mongoose.model("Card", cardSchema);

module.exports = {Card};