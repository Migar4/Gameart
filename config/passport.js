const User = require('../models/user');
const JWTStrategy = require('passport-jwt').Strategy;
const ExtractJWT = require('passport-jwt').ExtractJwt;

const fs = require('fs');
const path = require('path');

const pathToKey = path.join(__dirname, '..', 'id_rsa_pub.pem');
const PUB_KEY = fs.readFileSync(pathToKey, 'utf8');


const options = {
    jwtFromRequest: ExtractJWT.fromAuthHeaderAsBearerToken(),
    secretOrKey: PUB_KEY,
    algorithms: ['RS256'],
    passReqToCallback: true
};

const strategy = new JWTStrategy(options, async (req, payload, done) => {
    try{
        const user = await User.findOne({
            _id: payload.id
        });
        
        if(user){
            req.userID = user._id
            return done(null, user);
        }else{
            return done(null, false);
        }
    }catch(err){
        return done(err, false);
    }
});

module.exports = (passport) => {
    passport.use(strategy);
}