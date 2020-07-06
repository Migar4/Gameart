const express = require('express');
const sharp = require("sharp");
const multer = require('multer');
const archiver = require('archiver');
const fs = require('fs');


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
router.post("/upload", upload.fields([{name: "upload", maxCount: 1}, {name: "imgs", maxCount: 20}]), async (req, res) => {

    try{
        const buf = await sharp(req.files.upload[0].buffer).png().toBuffer();
        let imgs = new Array;

        for(let i = 0; i < req.files.imgs.length; i++){
            let img = await sharp(req.files.imgs[i].buffer).resize({width: 250, height: 250}).png().toBuffer();
            imgs.push(img);
        }

        //create a zip here
        
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
                console.log("END");
                fs.unlink(file, () => {
                    console.log(`Deleted ${card.name}`);
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

//any other route redirect back to home
router.get("*", (req, res) => {
    res.redirect("/");
});

module.exports = router;