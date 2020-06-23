import _ from 'lodash'
import piece from './piece'
import Piece from './piece'
import * as help from '../helpers'

const PIECES_BUFFER = 10



export default class Game {
    constructor(tocken, player) {
        this.players = {}
        this.players[tocken] = player
        this.state = help.WAIT_PLAYERS
        this.pieces = []
    }

    init() {
        // Change game state
        this.state = help.INIT_GAME
        // generate pieces
        this.pieces = _.map(new Array(PIECES_BUFFER), (x) => new Piece())
        this.timeleft = 5
    }

    addplayer(tocken, player) {
        this.players[tocken] = player
    }
}