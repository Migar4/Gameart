class Card{
    constructor(id, name, image, desc){
        this.id = id;
        this.name = name;
        this.type = "";
        this.image = image;
        this.desc = desc;
        this.tags = [];
    }
}

module.exports = Card;