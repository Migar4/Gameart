const express = require('express');
const sharp = require('sharp');
const multer = require('multer');
const passport = require('passport');
const archiver = require('archiver');
const fs = require('fs');

const User = require('../models/user');
const auth = require('../middleware/auth');


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
router.get("/upload", passport.authenticate('jwt', {session: false}), (req, res) => {
    res.render("upload");
});


//convert to png and save as a buffer to the db
router.post("/upload", passport.authenticate('jwt', {session: false}), upload.fields([{name: "upload", maxCount: 1}, {name: "imgs", maxCount: 20}]), async (req, res) => {

    try{
        const buf = await sharp(req.files.upload[0].buffer).png().toBuffer();
        let imgs = new Array;

        for(let i = 0; i < req.files.imgs.length; i++){
            let img = await sharp(req.files.imgs[i].buffer).resize({width: 250, height: 250}).png().toBuffer();
            imgs.push(img);
        }

        //create a zip here
        
        let card = new cardModel({name: req.body.name, showImage: buf, description: req.body.desc, images: imgs});


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
});


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
    //pass in the password 'pre' will take care of hashing
    console.log(req.query.username);
    const newUser = new User({username: req.query.username, password: req.query.password, email: req.query.email});

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
            username: req.body.username
        });
    
        if(!user){
            res.status(401).send("Could not find user");
        }
    
        let isValid = await user.verifyPassword(req.body.password);
    
        if(isValid){
            const token = user.generateAuthToken();
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
    req.logout();
});

//any other route redirect back to home
router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;