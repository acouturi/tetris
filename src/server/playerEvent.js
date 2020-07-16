import debug from 'debug'
import * as cmd from '../helpers'
import {gameEvent,gameClock,testnewpiece} from './gameEvent'
import Player from './classes/player'

const logerror = debug('tetris:player_error')
  , loginfo = debug('tetris:player_info')

  logerror('test')
  loginfo('test')

export function playerEvent(action, game, token) {
    let player = game.players[token]
    loginfo(action, player.name)
    switch (action.command) {
      case cmd.RIGHT:
        if (game.state == cmd.IN_GAME && player.state == cmd.PLAYER_ALIVE){
          player.shiftRight()
          game.emit(cmd.REFRESH_PLAYER,player.data())
        }
        break;
      case cmd.LEFT:
        if (game.state == cmd.IN_GAME && player.state == cmd.PLAYER_ALIVE){
          player.shiftLeft()
          game.emit(cmd.REFRESH_PLAYER,player.data())
        }
        break;
      case cmd.ROTATE:
        if (game.state == cmd.IN_GAME && player.state == cmd.PLAYER_ALIVE){
          let ret = player.rotatePiece()
          if(ret){
            game.emit(cmd.REFRESH_PLAYER,player.data())
            break;
          }
          if (ret == false) {
            game.emit(cmd.REFRESH_PLAYER,player.data())
            break;
          }
        }
      case cmd.DOWN:
      case cmd.FALL:    
        if (game.state == cmd.IN_GAME && player.state == cmd.PLAYER_ALIVE) {
          let ok = action.command == cmd.FALL ? player.shiftFall() : player.shiftDown()
          if (!ok)
            testnewpiece(game,token)
          game.emit(cmd.REFRESH_PLAYER,player.data())
        }
        break;
      case cmd.PAUSE:
        if (Object.keys(game.players)[0] == token) {
          if (game.state == cmd.IN_PAUSE) {
            game.emit(cmd.END_PAUSE,null)

            game.state = cmd.IN_GAME
            game.internalClockEvent = gameClock(game)
          }
          else if (game.state == cmd.IN_GAME) {
            game.emit(cmd.START_PAUSE,null)

            game.state = cmd.IN_PAUSE
            clearInterval(game.internalClockEvent)
          }
        }
        break;
      case cmd.START:
        if (game.state == cmd.WAIT_PLAYERS || game.state == cmd.GAME_OVER) {
          if (Object.keys(game.players)[0] == token) {
            game.state = cmd.INIT_GAME
            loginfo("initialisation of the room " + game.name)
            game.init()
            gameEvent(game, cmd.START_TIMER, game.name)
          }
        }
        break;
    
      default:
        logerror('bad commande player',action.command, player)
        break;
    }
  }