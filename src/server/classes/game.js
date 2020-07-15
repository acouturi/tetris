import _ from 'lodash'
import Piece from './piece'
import * as cmd from '../../helpers'

const PIECES_BUFFER = 10

const DEFAULT_SPEED = 2000
const MIN_SPEED = 100
const STEP_SPEED = 10
const WATCH_DOG = 40

export default class Game {
  constructor(token, player, io, name) {
    this.players = {}
    this.players[token] = player
    this.internalClockEvent = null
    this.state = cmd.WAIT_PLAYERS
    this.testing = false
    this.io = io
    this.name = name
  }

  init() {
    this.badLines = 0
    this.playerAlive = Object.keys(this.players).length == 1 ? 2 : Object.keys(this.players).length
    clearInterval(this.internalClockEvent)
    this.internalClockEvent = null
    this.timespeed = DEFAULT_SPEED
    this.state = cmd.INIT_GAME
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
    this.state = cmd.GAME_OVER
    this.internalClockEvent = null
  }

  /////// unused
  restart() {
    this.state = cmd.WAIT_PLAYERS
    let lsttoken = Object.keys(this.players)
    for (let index = 0; index < lsttoken.length; index++) {
      const player = this.players[lsttoken[index]];
      player.restart()
    }
    this.pieces = []
  }

  killplayer(token) {
    this.players[token].state = cmd.PLAYER_DEAD
    this.emit(cmd.PLAYER_GONE,this.data())
    this.playerAlive--
    return this.playerAlive == 1
  }

  addplayer(token, player) {
    this.players[token] = player
  }

  removeplayer(token) {
    delete this.players[token]
    if (this.state == cmd.WAIT_PLAYERS || this.state == cmd.GAME_OVER)
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

  data() {
    const cleared = (({state,name,playerAlive,timespeed,pieces}) => ({state,name,playerAlive,timespeed,pieces}))(this);
    let lstplayer = []
    Object.keys(this.players).forEach(token => {
      lstplayer.push(this.players[token].data())
    });
    return cleared
  }

  emit(cmd,data) {
    if (this.testing)
      return
    this.io.emit(`room#${this.name}`,{command:cmd,data:data})
  }
}