const express = require('express');
const sharp = require("sharp");
const multer = require('multer');
const bodyParser = require('body-parser');

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

///////////////
//config route
//////////////

router.use(bodyParser.urlencoded({extended: false}));
router.use(bodyParser.json());

//home
router.get("/", (req, res) => {
    res.render("index", {cards: {}});
});


//upload page
router.get("/upload", (req, res) => {
    res.render("upload");
});


//convert to png and save as a buffer to the db
router.post("/upload", upload.fields([{name: "upload", maxCount: 1}, {name: "imgs", maxCount: 20}]), async (req, res) => {

    try{
        const buf = await sharp(req.files.upload[0].buffer).resize({width: 250, height: 250}).png().toBuffer();
        let imgs = new Array;

        for(let i = 0; i < req.files.imgs.length; i++){
            let img = await sharp(req.files.imgs[i].buffer).resize({width: 250, height: 250}).png().toBuffer();
            imgs.push(img);
        }
        
        let card = new cardModel({name: req.body.name, showImage: buf, description: req.body.desc, images: imgs});
        
        card.save();
        res.redirect("/");
    }catch(e){
        console.log(e);
        res.redirect("back");
    }
    
}, (error, req, res, next) => {
    console.log(error);
    res.status(400).send({error : error.message});
});


//any other route redirect back to home
router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;