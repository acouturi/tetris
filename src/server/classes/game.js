import _ from 'lodash'
import piece from './piece'
import Piece from './piece'
import * as help from '../helpers'
import { pieces } from '../helpers/pieces'

const PIECES_BUFFER = 10

const DEFAULT_SPEED = 2000
const MIN_SPEED = 100
const STEP_SPEED = 10

export default class Game {
  constructor(tocken, player) {
    this.players = {}
    this.players[tocken] = player
    this.internalClockEvent = null
    this.state = help.WAIT_PLAYERS
  }

  testpieces(index) {
    while (index + PIECES_BUFFER > pieces.length){
      if (this.timespeed > MIN_SPEED)
        this.timespeed -= STEP_SPEED
      addNewPiece()
    }
  }

  init() {
    this.playerAlive = this.players.length
    clearInterval(this.internalClockEvent)
    this.internalClockEvent = null
    this.timespeed = DEFAULT_SPEED
    this.state = help.INIT_GAME
    // generate pieces
    this.pieces = _.map(new Array(PIECES_BUFFER), addNewPiece())
    this.timeleft = 5
  }

  gameOver() {
    this.state = help.GAME_OVER
    clearInterval(this.internalClockEvent)
    this.internalClockEvent = null
  }

  restart() {
    this.state = help.WAIT_PLAYERS
    for (let index = 0; index < players.length; index++) {
      const player = players[index];
      player.restart()
    }
    this.pieces = []
  }

  addNewPiece() {
    this.pieces.push(new Piece())
  }

  addplayer(tocken, player) {
    this.players[tocken] = player
  }
}