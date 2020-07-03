const cardModel = require('./models/cards').Card;

let data = [
    {
        name: "Spongebob",
        images: "https://upload.wikimedia.org/wikipedia/en/thumb/4/44/SpongeBob_SquarePants_characters_promo.png/370px-SpongeBob_SquarePants_characters_promo.png",
        description: "Spongebob and his friends",
        type: "2D"
    },
    {
        name: "Looney toons",
        image: "https://media.gq.com/photos/5b4d13b99eea1c27bfdb9e93/16:9/w_3556,h_2000,c_limit/Looney-Toons-GQ-July-2018-071618-3x2.jpg",
        description: "Looney toons characters",
        type: "2D"
    },
    {
        name: "Tweety",
        image: "https://www.wallpaperup.com/uploads/wallpapers/2013/10/16/161104/e4889be8a29c1f319ccdcc4ad9552abb.jpg",
        description: "Tweety the bird",
        type: "2D"
    },
    {
        name: "Daffy",
        image: "https://secure.img1-fg.wfcdn.com/im/07132753/resize-h800-w800%5Ecompr-r85/4145/41451795/Looney+Tunes+Daffy+Duck+Standup.jpg",
        description: "Daffy duck",
        type: "2D"
    },
    {
        name: "Bugs bunny",
        image: "https://i.pinimg.com/originals/84/5a/11/845a11fb8c7f73862f22c9aeb92f4030.png",
        description: "Bugs bunny the rabbit",
        type: "2D"
    },
    {
        name: "Road runner and coyote",
        image: "https://i.ytimg.com/vi/PkBu-mnXOAk/maxresdefault.jpg",
        description: "Road runner running away from coyote",
        type: "2D"
    },
    {
        name: "Taz",
        image: "https://www.wikihow.com/images/f/f2/Taz-Color-Step-9.jpg",
        description: "Tasmanian wolf taz",
        type: "2D"
    },
];


async function seedDB(){
    try{
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