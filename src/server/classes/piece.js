import { getRandomInt } from "../helpers";
import {pieces} from '../helpers/pieces'

export default class Piece {
    constructor(form=getRandomInt(pieces.length), rotation=getRandomInt(4), position={x: 0, y: 2}, color=Math.random()*360) {
        // En regardant la grille dans le sujet => (index) forme du tetrimino - (index) rotation
        this.form = form
        this.rotation = rotation
        this.position = position
        this.color = color
    }

    rotate() {
        this.rotation = (this.rotation + 1) % 4
    }
}