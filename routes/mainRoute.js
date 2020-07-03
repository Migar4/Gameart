const express = require('express');
const sharp = require("sharp");
const multer = require('multer');

/////////////
//Get models
/////////////

const cardModel = require('../models/cards').Card;



///////////////
//Config Multer
///////////////

const upload = multer({
    limits: {
        fileSize: 10000000
    }
});

////////////////
///Routes begin
////////////////

const router = new express.Router();


//home
router.get("/", (req, res) => {
    res.render("index", {cards: {}});
});


//upload page
router.get("/upload", (req, res) => {
    res.render("upload");
});


//convert to png and save as a buffer to the db
router.post("/upload", upload.single('upload'), async (req, res) => {
    
    const buf = await sharp(req.file.buffer).resize({width: 250, height: 250}).png().toBuffer();
    let card = new cardModel({name: req.body.name, showImage: buf, description: req.body.desc});
    
    card.save();
    res.redirect("/");
}, (error, req, res, next) => {
    res.status(400).send({error : error.message});
});


//any other route redirect back to home
router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;