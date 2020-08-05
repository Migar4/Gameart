const mongoose = require("mongoose");

const cardSchema = new mongoose.Schema({
    images:[{
        type: Buffer,
    }],
    showImage:{
        type:  Buffer,
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
    },
    owner:{
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const Card = mongoose.model("Card", cardSchema);

module.exports = {Card};