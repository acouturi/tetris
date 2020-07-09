import { getRandomInt } from "../helpers";
import {pieces} from '../helpers/pieces'

export default class Piece {
    constructor(form=getRandomInt(pieces.length), rotation=getRandomInt(4), positionx = null, positiony = 3, color=Math.random()*360) {
        // En regardant la grille dans le sujet => (index) forme du tetrimino - (index) rotation
        this.form = form
        this.rotation = rotation
        this.positiony = positiony
        this.positionx = 0;
        if (positionx)
            this.positionx = positionx
        else {
            const pieceform = pieces[this.form][this.rotation]
                            console.log(pieceform)
            let reduce = 0
            testelem :{
                for (let x = 0; x < pieceform.length; x++) {
                    const pieceline = pieceform[x];
                    for (let y = 0; y < pieceline.length; y++) {
                        const piecepixel = pieceline[y];        
                        if (piecepixel == 1){
                            break testelem}
                    }
                    reduce--
                }
            }
            this.positionx = reduce
        }
        console.log(this.positionx, this.form, this.rotation)
        this.color = Math.round(88)//color
    }

    rotate() {
        this.rotation = (this.rotation + 1) % 4
    }
}