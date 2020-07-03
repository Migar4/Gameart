const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    images:[{
        type: Buffer,
        required: true
    }],
    showImage:{
        type:  Buffer,
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