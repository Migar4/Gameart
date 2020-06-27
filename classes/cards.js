class Card{
    constructor(name, image, desc){
        this.name = name;
        this.type = "";
        this.image = image;
        this.desc = desc;
        this.tags = [];
    }
}

module.exports = Card;