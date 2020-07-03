const cardModel = require('./models/cards').Card;
const fs = require('fs');
const sharp = require('sharp');
const util = require('util');


let data = [
    {
        name: "Spongebob",
        description: "Spongebob and his friends",
        showImage: null,
        type: "2D"
    },
    {
        name: "Looney toons",
        description: "Looney toons characters",
        showImage: null,
        type: "2D"
    },
    {
        name: "Tweety",
        description: "Tweety the bird",
        showImage: null,
        type: "2D"
    },
    {
        name: "Daffy",
        description: "Daffy duck",
        showImage: null,
        type: "2D"
    },
    {
        name: "Bugs bunny",
        description: "Bugs bunny the rabbit",
        showImage: null,
        type: "2D"
    },
    {
        name: "Road runner and coyote",
        description: "Road runner running away from coyote",
        showImage: null,
        type: "2D"
    },
    {
        name: "Taz",
        description: "Tasmanian wolf taz",
        showImage: null,
        type: "2D"
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

        data.forEach(async (seed) => {
            try{
                const card = await cardModel.create(seed);

                if(!card)
                    console.log("Could not create card");
                else
                    console.log("Created card");
            }catch(e){
                console.log(e);
            }
        });

    }catch(e){
        console.log(e);
    }
}

module.exports = seedDB;