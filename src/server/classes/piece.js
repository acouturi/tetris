function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

export default class Piece {
    constructor(form=getRandomInt(7), rotation=getRandomInt(4), position={x: 5, y: 0}, color=Math.random()*360) {
        // En regardant la grille dans le sujet => (index) forme du tetrimino - (index) rotation
        this.form = form
        this.rotation = rotation
        this.position = position
        this.color = color
    }
}