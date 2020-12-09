const crypto = require("crypto");

async function hash(password){
    try{
        var salt = crypto.randomBytes(32).toString('hex');
        var genHash = crypto.pbkdf2Sync(password, salt, 10000, 64, 'sha512').toString('hex');

        return {
            salt,
            genHash
        };
    
    }catch(e){
        throw new Error(e);
    }
}

module.exports = hash;