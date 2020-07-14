import debug from 'debug'
import * as help from './helpers'
import * as cmd from '../helpers'
import {gameEvent,gameClock} from './gameEvent'

const logerror = debug('tetris:player_error')
  , loginfo = debug('tetris:player_info')

  logerror('test')
  loginfo('test')

export function playerEvent(io, socket, action, curentroom, roomName, token) {
    let player = curentroom.players[token]
    loginfo(action, player.name)
    switch (action.command) {
      case cmd.RIGHT:
        if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE){
          player.shiftRight()
          io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player.data()})
        }
        break;
      case cmd.LEFT:
        if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE){
          player.shiftLeft()
          io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player.data()})
        }
        break;
      case cmd.ROTATE:
        if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE){
          player.rotatePiece()
          io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player.data()})
        }
        break;
      case cmd.DOWN:
      case cmd.FALL:    
        if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE) {
          let ok = action.command == cmd.DOWN ? player.shiftDown() : player.shiftFall()
          if (!ok) {
            ok = player.newPiece(curentroom.getPieces(player.index),curentroom.getPieces(player.index + 1))
            if (ok[1])
                gameEvent(null, curentroom, cmd.ADD_LINE, null, ok[1])
            if (!ok[0]) {
              loginfo(player.name, "is dead", token)
              if(curentroom.killplayer(token))
                gameEvent(io, curentroom, cmd.END_GAME, roomName)
            }
            let nbline = 0;
          }
          io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player.data()})
        }
        break;
      case cmd.PAUSE:
        if (Object.values(curentroom.players)[0].socketid == socket.id) {
          if (curentroom.state == help.IN_PAUSE) {
            io.emit(`room#${roomName}`, {command:cmd.END_PAUSE,data:null})
            curentroom.state = help.IN_GAME
            curentroom.internalClockEvent = gameClock(io, curentroom, roomName, curentroom.timespeed)
          }
          else if (curentroom.state == help.IN_GAME) {
            io.emit(`room#${roomName}`, {command:cmd.START_PAUSE,data:null})
            curentroom.state = help.IN_PAUSE
            clearInterval(curentroom.internalClockEvent)
          }
        }
        break;
      case cmd.START:
        if (curentroom.state == help.WAIT_PLAYERS || curentroom.state == help.GAME_OVER) {
          if (Object.values(curentroom.players)[0].socketid == socket.id) {
            curentroom.state = help.INIT_GAME
            loginfo("initialisation of the room " + roomName)
            curentroom.init()
            gameEvent(io, curentroom, cmd.START_TIMER, roomName)
          }
        }
        break;
    
      default:
        logerror('bad commande player',action.command, player)
        break;
    }
  }