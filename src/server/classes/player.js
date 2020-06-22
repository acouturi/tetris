import _ from 'lodash'

export default class Player {
    constructor(name, socketid) {
        this.name = name
        this.socketid = socketid
        this.index = 0
    }

    init(piece) {
        this.board = _.map(new Array(10), () => new Array(20))
        // calque sur lequel on a la piece qui bouge
        this.currentPiece = JSON.parse(JSON.stringify(piece))
    }

    newpiece(piece) {
        this.index++


        this.currentPiece = JSON.parse(JSON.stringify(piece))
    }
}