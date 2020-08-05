const cardModel = require('./models/cards').Card;
const fs = require('fs');
const sharp = require('sharp');
const util = require('util');
const {catAll, cat2D, cat3D, catIso, catUI, catSound} = require('./models/categories');
const user = require('./models/user');
const Ad = require('./models/ads');


let u = new user({
    username: "Theodore",
    password: "abc123",
    email: "abc@gmail.com",
    tokens: ["abdc"]
});

let ad = new Ad({
    adUrl: 'ctfo.io/ad',
    gameLink: 'ctfo.mp4',
    owner: u
}).save();

let data = [
    {
        name: "Spongebob",
        description: "Spongebob and his friends",
        showImage: null,
        type: "2D",
        owner: u
    },
    {
        name: "Looney toons",
        description: "Looney toons characters",
        showImage: null,
        type: "2D",
        owner: u
    },
    {
        name: "Tweety",
        description: "Tweety the bird",
        showImage: null,
        type: "2D",
        owner: u
    },
    {
        name: "Daffy",
        description: "Daffy duck",
        showImage: null,
        type: "2D",
        owner: u
    },
    {
        name: "Bugs bunny",
        description: "Bugs bunny the rabbit",
        showImage: null,
        type: "2D",
        owner: u
    },
    {
        name: "Road runner and coyote",
        description: "Road runner running away from coyote",
        showImage: null,
        type: "2D",
        owner: u
    },
    {
        name: "Taz",
        description: "Tasmanian wolf taz",
        showImage: null,
        type: "2D",
        owner: u
    },
];



async function seedDB(){
    try{
        for(let i = 0; i < 7; i++){
            let img = fs.readFileSync('./images/' + (i + 1) + '.png')
            const buf = await sharp(img).resize({width: 250, height: 250}).png().toBuffer();
            data[i].showImage = buf;
        }
        
        let doc = await cardModel.deleteMany({});
        if(!doc){
            console.log("Couldn't delete cards");
        }else{
            console.log("deleted the cards");
        }

        //delete all in categories
        let cat_All = await catAll.deleteMany({}),
        cat_2D = await cat2D.deleteMany({}), 
        cat_3D = await cat3D.deleteMany({}), 
        cat_Iso = await catIso.deleteMany({}), 
        cat_UI = await catUI.deleteMany({}), 
        cat_Sound = await catSound.deleteMany({});

        if(!cat_All || !cat_2D || !cat_3D || !cat_Iso || !cat_UI || !cat_Sound){
            console.log("Couldn't delete categories");
        }else{
            console.log("Deleted the categories");
        }

        let cat_All_cr = await catAll.create({}),
            cat_2D_cr = await cat2D.create({}), 
            cat_3D_cr = await cat3D.create({}), 
            cat_Iso_cr = await catIso.create({}), 
            cat_UI_cr = await catUI.create({}), 
            cat_Sound_cr = await catSound.create({});
        

        data.forEach(async (seed) => {
            try{
                const card = await cardModel.create(seed);

                let cat = Math.floor(Math.random() * 5) + 1;


                switch(cat){
                    case 1:
                        await cat_2D_cr.cards.push(card);
                        break;
                    case 2:
                        await cat_3D_cr.cards.push(card);  
                        break;
                    case 3:
                        await cat_Iso_cr.cards.push(card);
                        break;
                    case 4:
                        await cat_UI_cr.cards.push(card);
                        break;
                    case 5:
                        await cat_Sound_cr.cards.push(card);
                        break;
                        
                }

                await cat_All_cr.cards.push(card);

                if(!card)
                    console.log("Could not create card");
                else
                    console.log("Created card on category " + cat);
            }catch(e){
                console.log(e);
            }
        }
        );
        
        await cat_Sound_cr.save(); //this is not working for some reason
        await cat_2D_cr.save();
        await cat_3D_cr.save();
        await cat_Iso_cr.save();
        await cat_UI_cr.save();
        await cat_All_cr.save();
        
    }catch(e){
        console.log(e);
    }

    let ans = await u.populate('ads').execPopulate();
    console.log(ans.ads);
}

module.exports = seedDB;