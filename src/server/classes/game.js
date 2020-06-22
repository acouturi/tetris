import _ from 'lodash'
import piece from './piece'
import Piece from './piece'

let WAIT_PLAYERS = 'WAIT_PLAYERS'
let INIT_GAME = 'INIT_GAME'
let IN_GAME = 'IN_GAME'
let GAME_OVER = 'GAME_OVER'

export default class Game {
    constructor(player) {
        this.players = {1 : player}
        this.state = WAIT_PLAYERS
        this.pieces = []
    }

    init() {
        // Change game state
        this.state = INIT_GAME
        // generate pieces
        this.pieces = _.map(new Array(10), (x) => new Piece())
        this.timeleft = 5
    }
}