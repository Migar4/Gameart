const mongoose = require("mongoose");
const crypto = require('crypto');
const card = require('./cards').Card;
const ad = require('./ads');
const jwt  = require('jsonwebtoken');
const validator = require('validator');

const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_priv.pem');
const PRIV_KEY = fs.readFileSync(pathToKey, 'utf8');


const userSchema = new mongoose.Schema({
    username:{
        type: String,
        unique: true,
        required: true,
        validate:{
            validator: async function(name){

                const user = await User.find({name});
                if(user){
                    Promise.resolve(false);
                }
            },
            message: `username already exist`
        },
        trim: true
    },
    password_hash:{
        type: String,
        // required: true,
        trim: false
    },
    password_salt:{
        type: String,
        // required: true,
        trim: false
    },
    email:{
        type: String,
        unique: true,
        trim: true,
        lowercase: true,
        validate:{
            validator: async function(email){

                if(!validator.isEmail(email)){
                    throw new Error("Email is not valid");
                }

                const user = await User.find({email});
                if(user){
                    Promise.resolve(false);
                }
            },
            message: "User with email already exist"
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

userSchema.methods.verifyPassword = async function(password){
    const user = this;
    var hashVerify = crypto.pbkdf2Sync(password, user.password_salt, 10000, 64, 'sha512').toString('hex');

    return hashVerify === user.password_hash;
};

userSchema.methods.generateAuthToken = async function(){
    const user = this;

    const data = {
        id: user.id
    };
    const token = jwt.sign(data, PRIV_KEY, { algorithm: 'RS256' });
    user.tokens = user.tokens.concat({token});

    try{
        await user.save();
        return 'Bearer ' + token;
    }catch(e){
        return(e);
    }
}

const User = mongoose.model('User', userSchema);
module.exports = User;