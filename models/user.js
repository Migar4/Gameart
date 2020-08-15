const mongoose = require("mongoose");
const card = require('./cards').Card;
const ad = require('./ads');
const bcrypt = require('bcrypt');

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

userSchema.methods.verifyPassword = async function(password){
    const user = this;
    const isMatch = await bcrypt.compare(user.password, password);
    return (isMatch);
};

userSchema.statics.authenticate = async (username, password, done) => {
    //authentication method catered for passport js
    try{
        const found_user = await User.findOne({username});

        if(!found_user) return done(null, false);
        if(!found_user.verifyPassword(password)) return done(null, false);
        return done(null, found_user);
    }catch(e){
        return done(e);
    }
}

userSchema.statics.serializeUser = async function(user, done){
    done(null, user.id);
}

userSchema.statics.deserializeUser = async function(id, done){
    return done(null, await User.findId({id}));
}

userSchema.pre('save', async function(next){
    if(this.isModified("password")){
        try{
            this.password = await bcrypt.hash(this.password, 8);
        }catch(e){
            throw new Error(e);
        }
    }
    next();
});

const User = mongoose.model('User', userSchema);
module.exports = User;