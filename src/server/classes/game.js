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
  constructor(token, player) {
    this.players = {}
    this.players[token] = player
    this.internalClockEvent = null
    this.state = help.WAIT_PLAYERS
  }

  log(msg) {
    console.log('on est ici',msg)
  }

  addNewPiece() {
    this.pieces.push(new Piece())
  }

  getPieces(index) {
    while (index + PIECES_BUFFER > this.pieces.length){
      if (this.timespeed > MIN_SPEED)
        this.timespeed -= STEP_SPEED
      this.addNewPiece()
    }
    console.log(this.pieces[index])
    return this.pieces[index]
  }

  init() {
    this.badLines = 0
    this.playerAlive = (Object.keys(this.players).length + 1)
    clearInterval(this.internalClockEvent)
    this.internalClockEvent = null
    this.timespeed = DEFAULT_SPEED
    this.state = help.INIT_GAME
    // generate pieces
    this.pieces = _.map(new Array(PIECES_BUFFER), () => new Piece())
    this.timeleft = 5
  }

  gameOver() {
    clearInterval(this.internalClockEvent)
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



  killplayer(token) {
    this.players[token].state = help.PLAYER_DEAD
    this.playerAlive--
    console.log(this.players[token])
    console.log(this.playerAlive)
    if (this.playerAlive == 1)
      this.gameOver()
  }

  addplayer(token, player) {
    this.players[token] = player
  }

  removeplayer(token) {
    delete this.players[token]
    if (Object.keys(this.players) == 0){
      clearInterval(this.internalClockEvent)
      return 1
    }
    else if(Object.keys(this.players) == 1)
      this.gameOver()
    return 0
  }
}