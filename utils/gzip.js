const zlib = require("zlib");

function gzip(buffer, options = {}){
    return new Promise((resolve, reject) => {
        zlib.gzip(buffer, options, (err, buf) => {
            if(err){
                reject(err);
            }
            resolve(buf);
        });
    });
    
}

function gunzip(buffer, options = {}){
    return new Promise((resolve, reject) => {
        zlib.gzip(buffer, options, (err, buf) => {
            if(err){
                reject(err);
            }
            resolve(buf);
        });
    });
}

function unzip(buffer, options = {}){
    return new Promise((resolve, reject) => {
        zlib.unzip(buffer, options, (err, buf) => {
            if(err){
                reject(err);
            }
            resolve(buf);
        });
    });
}

module.exports = {gzip, gunzip, unzip};