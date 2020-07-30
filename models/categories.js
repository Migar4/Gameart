let mongoose = require("mongoose");

let catAllSchema = new mongoose.Schema({
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }]
});

let catAll = mongoose.model("CatAll", catAllSchema);

let cat2DSchema = new mongoose.Schema({
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }]
});

let cat2D = mongoose.model("Cat2D", cat2DSchema);


let cat3DSchema = new mongoose.Schema({
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }]
});

let cat3D = mongoose.model("Cat3D", cat3DSchema);

let catIsoSchema = new mongoose.Schema({
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }]
});

let catIso = mongoose.model("CatIso", catIsoSchema);


let catUISchema = new mongoose.Schema({
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }]
});

let catUI = mongoose.model("CatUI", catUISchema);

let catSoundSchema = new mongoose.Schema({
    cards: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Card"
    }]
});

let catSound = mongoose.model("CatSound", catSoundSchema);

module.exports = {catAll, cat2D, cat3D, catIso, catUI, catSound};