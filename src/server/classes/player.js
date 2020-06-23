import _ from 'lodash'
import * as help from '../helpers'

export default class Player {
    constructor(name, socketid) {
        this.name = name
        this.socketid = socketid
        this.state = help.PLAYER_NEW
    }

    init(piece) {
        this.board = _.map(new Array(20), () => _.map(new Array(10), () => {return -1} ))
        this.index = 0
        this.state = help.PLAYER_ALIVE
        // calque sur lequel on a la piece qui bouge
        this.currentPiece = JSON.parse(JSON.stringify(piece))
        refreshScreen()
    }

    refreshScreen() {
        this.screen = JSON.parse(JSON.stringify(board))
        
    }

    newpiece(piece) {
        this.index++


        this.currentPiece = JSON.parse(JSON.stringify(piece))
    }
}