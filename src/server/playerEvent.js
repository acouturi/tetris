import debug from 'debug'
import * as cmd from '../helpers'
import {gameEvent,gameClock} from './gameEvent'

const logerror = debug('tetris:player_error')
  , loginfo = debug('tetris:player_info')

  logerror('test')
  loginfo('test')

export function playerEvent(io, socketid, action, game, roomName, token) {
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
          player.rotatePiece()
          game.emit(cmd.REFRESH_PLAYER,player.data())
        }
        break;
      case cmd.DOWN:
      case cmd.FALL:    
        if (game.state == cmd.IN_GAME && player.state == cmd.PLAYER_ALIVE) {
          let ok = action.command == cmd.DOWN ? player.shiftDown() : player.shiftFall()
          if (!ok) {
            ok = player.newPiece(game.getPieces(player.index),game.getPieces(player.index + 1))
            if (ok[1])
                gameEvent(null, game, cmd.ADD_LINE, null, ok[1])
            if (!ok[0]) {
              loginfo(player.name, "is dead", token)
              if(game.killplayer(token))
                gameEvent(io, game, cmd.END_GAME, roomName)
            }
            let nbline = 0;
          }
          game.emit(cmd.REFRESH_PLAYER,player.data())
        }
        break;
      case cmd.PAUSE:
        if (Object.values(game.players)[0].socketid == socketid) {
          if (game.state == cmd.IN_PAUSE) {
            game.emit(cmd.END_PAUSE,null)

            game.state = cmd.IN_GAME
            game.internalClockEvent = gameClock(io, game, roomName, game.timespeed)
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
          if (Object.values(game.players)[0].socketid == socketid) {
            game.state = cmd.INIT_GAME
            loginfo("initialisation of the room " + roomName)
            game.init()
            gameEvent(io, game, cmd.START_TIMER, roomName)
          }
        }
        break;
    
      default:
        logerror('bad commande player',action.command, player)
        break;
    }
  }