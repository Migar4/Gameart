const mongoose = require('mongoose');

const adsSchema = mongoose.Schema({
    adUrl: {
        type: String,
        required: true
    },
    gameLink: {
        type: String,
        required: true
    },
    owner: {
        type: mongoose.Types.ObjectId,
        required: true,
        ref: 'User'
    }
});

const ad = mongoose.model('Ad', adsSchema);

module.exports = ad;