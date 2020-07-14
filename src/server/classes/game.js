import _ from 'lodash'
import piece from './piece'
import Piece from './piece'
import * as help from '../helpers'
import { pieces } from '../helpers/pieces'

const PIECES_BUFFER = 10

const DEFAULT_SPEED = 2000
const MIN_SPEED = 100
const STEP_SPEED = 10
const WATCH_DOG = 40

export default class Game {
  constructor(token, player) {
    this.players = {}
    this.players[token] = player
    this.internalClockEvent = null
    this.state = help.WAIT_PLAYERS
  }

  init() {
    this.badLines = 0
    this.playerAlive = Object.keys(this.players).length == 1 ? 2 : Object.keys(this.players).length
    clearInterval(this.internalClockEvent)
    this.internalClockEvent = null
    this.timespeed = DEFAULT_SPEED
    this.state = help.INIT_GAME
    this.watchdog = WATCH_DOG
    this.pieces = _.map(new Array(PIECES_BUFFER), () => new Piece())
    this.timeleft = 5
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
    this.watchdog = WATCH_DOG
    return this.pieces[index]
  }

  gameOver() {
    clearInterval(this.internalClockEvent)
    this.state = help.GAME_OVER
    this.internalClockEvent = null
  }

  /////// unused
  restart() {
    this.state = help.WAIT_PLAYERS
    let lsttoken = Object.keys(this.players)
    for (let index = 0; index < lsttoken.length; index++) {
      const player = this.players[lsttoken[index]];
      player.restart()
    }
    this.pieces = []
  }

  killplayer(token) {
    this.players[token].state = help.PLAYER_DEAD
    this.playerAlive--
    return this.playerAlive == 1
  }

  addplayer(token, player) {
    this.players[token] = player
  }

  removeplayer(token) {
    delete this.players[token]
    if (this.state == help.WAIT_PLAYERS || this.state == help.GAME_OVER)
      return 0
    this.playerAlive--
    if (Object.keys(this.players).length < 1){
      clearInterval(this.internalClockEvent)
      return 1
    }
    if(this.playerAlive <= 1)
      this.gameOver()
    return 0
  }
}