const express = require('express');
//const sharp = require('sharp');
const multer = require('multer');
const archiver = require("archiver");

const fs = require('fs');


const gzip = require('../utils/gzip');
const User = require('../models/user');
const auth = require('../middleware/auth');
const hash = require("../utils/hash");
const adModel = require("../models/ads");


/////////////
//Get models
/////////////

const cardModel = require('../models/cards').Card;
const {catAll, cat2D, cat3D, catIso, catUI, catSound} = require('../models/categories');
const { assert } = require('console');

///////////////
//Config Multer
///////////////

const upload = multer({
    limits: {
        fileSize: 100000000000
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
router.get("/upload", auth, (req, res) => {
    res.render("upload");
});


//convert to png and save as a buffer to the db
/*router.post("/upload", auth, upload.fields([{name: "upload", maxCount: 1}, {name: "imgs", maxCount: 20}]), async (req, res) => {

    try{
        const buf = await sharp(req.files.upload[0].buffer).png().toBuffer();
        let imgs = new Array;

        for(let i = 0; i < req.files.imgs.length; i++){
            let img = await sharp(req.files.imgs[i].buffer).resize({width: 250, height: 250}).png().toBuffer();
            imgs.push(img);
        }

        const owner = User.findOne({_id: req.userID});
        
        let card = new cardModel({name: req.body.name, showImage: buf, description: req.body.desc, images: imgs, owner});


        //since only one document in each collection is there searching everything gives that document
        switch(req.body.category){
            case "1":
                await cat2D.updateOne({}, {$push: {cards: card}});
                break;
            case "2":
                await catIso.updateOne({}, {$push: {cards: card}});
                break;
            case "3":
                await cat3D.updateOne({}, {$push: {cards: card}});
                break;
            case "4":
                await catUI.updateOne({}, {$push: {cards: card}});
                break;
            case "5":
                await catSound.updateOne({}, {$push: {cards: card}});
                break;
        }
        await catAll.updateOne({}, {$push: {cards: card}});

        card.save();
        res.redirect("/");
    }catch(e){
        console.log(e);
        res.redirect("back");
    }
    
}, (error, req, res, next) => {
    console.log(error);
    res.status(400).send({error : error.message});
});*/


//download route
router.get("/download/:id", async (req, res) => {
    
    try{

        //find the card with id and add each image buffer to the archiver
        const card = await cardModel.findOne({_id: req.params.id});

        //////////////////
        //config archiver
        //////////////////

        let archive = archiver('zip', {
            zlib: {level: 9}
        });


        archive.on('warning', (err) => {
            if(err.code === 'ENOENT'){
                console.log(err);
            }else{
                throw err;
            }
        });

        archive.on('error', (err) => {
            console.log(err);
        });

        //config output stream
        const output = fs.createWriteStream(`${__dirname}/../zips/${card.name}.zip`);

        output.on('close', () => {
            console.log(archive.pointer() + ' total bytes');

            output.end();

            let file = `${__dirname}/../zips/${card.name}.zip`;
            
            let fileStream = fs.createReadStream(file);

            res.attachment(`${card.name}.zip`);
            fileStream.pipe(res);
            
            fileStream.on('end', () => {
                fs.unlink(file, () => {
                    
                });
            });

        });


        output.on('end', () => {
            console.log('Data has been drained');
        });

        //use achiver to pipe to the output stream
        archive.pipe(output);

        let imgs = card.images;

        for(let i = 0; i < imgs.length; i++){
            archive.append(imgs[i], {name: 'image' + i + '.png'});
        }  

        //archive.append(buf, {name: 'file.txt'});
        archive.finalize();
        
    }catch(e){
        console.log(e);
    }
    
});

//register route view
router.get('/register', (req, res) => {
    res.render('register');
});

router.post('/register', async (req, res) => {
    //pass in the password to hash to get the hash and salt

    const hash_and_salt = hash(req.query.password);
    const password_hash = (await hash_and_salt).genHash;
    const password_salt = (await hash_and_salt).salt;

    const newUser = new User({username: req.query.username, email: req.query.email, password_hash, password_salt, credit: 200});

    try{
        var user = await newUser.save();
        var token = await user.generateAuthToken();
        
        res.status(200).send({token});
    }catch(err){
        res.status(404).send({msg: err});
    }
    
});

//login route view
router.get('/login', (req, res) => {
    // const backURL = req.header('Referer') || '/';
    // req.session.backURL = backURL;
    res.render('login');
});

router.post('/login', async (req, res) => {
    try{
        const user = await User.findOne({
            username: req.query.username
        });
        
        if(!user){
            res.status(401).send("Could not find user");
        }
    
        let isValid = await user.verifyPassword(req.query.password);
        
        if(isValid){
            const token = await user.generateAuthToken();
            
            res.status(200).send({token});
        }else{
            res.status(401).send({
                msg: "Error loging in"
            });
        }
    }catch(err){
        res.status(404).send(err);
    }
});

//logout
router.post('/logout', (req, res) => {
    //work on this later
});

//ads
router.get('/ads', auth, (req, res) => {
    res.render("ads");
    console.log(req.userID);
});

router.post('/ads', auth, upload.fields([{name:'ads', maxCount: 5}]), async (req, res) => {
    try{
        const user = await User.findOne({_id: req.userID});
        let ads = new Array;

        for(i = 0; i < req.files.ads.length; i++){
            const comp = await gzip.gzip(req.files.ads[i].buffer, {windowBits: 14, memLevel: 9});
            ads.push(comp);
        }

        const ad = new adModel({ads, gameLink: "http://ctfo.io", owner: user});
        const adv = await ad.save();

        const ret = await adModel.find({}).populate('ads').exec();
        console.log(ret);
        res.status(200).send(ret);
    }catch(e){
        res.status(400).send(e);
    }
});

//any other route redirect back to home
router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;
