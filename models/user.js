const mongoose = require("mongoose");
const card = require('./cards').Card;
const ad = require('./ads');

const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    password:{
        type: String,
        required: true,
        trim: false
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate(email){
            //validate
        }
    },
    tokens: [{
        token: {
            type: String,
            required: true
        }
    }],
    credit:{
        type: Number
    },
    avatar: {
        type: String
    }
});

userSchema.virtual('cards', {
    ref: 'Card',
    localField: '_id',
    foreignField: 'owner'
});

userSchema.virtual('ads', {
    ref: 'Ad',
    localField: '_id',
    foreignField: 'owner'
});

const User = mongoose.model('User', userSchema);
module.exports = User;