import debug from 'debug'
import * as help from './helpers'
import * as cmd from '../helpers'

const logerror = debug('tetris:game_error')
, loginfo = debug('tetris:game_info')

  logerror('test')
  loginfo('test')

export function gameEvent(io, game, command, roomName, data) {
  switch (command) {
    case cmd.START_TIMER:
      let allPlayers = Object.values(game.players)
      for (let i = 0; i < allPlayers.length; i++) {
          allPlayers[i].init(game.pieces[0],game.pieces[1]);
          io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:allPlayers[i]})
      }

      let waitTimer = setInterval(() => {
          //decrays time left to start
          io.emit(`room#${roomName}`, {command:cmd.WAITING_TO_START,data:game.timeleft})
          game.timeleft--
          if (game.timeleft < 0){
          clearInterval(waitTimer)
          gameEvent(io, game, cmd.START_GAME, roomName, null)
          }
      },100)
      break;
    case cmd.START_GAME:
      game.state = help.IN_GAME
      game.internalClockEvent = gameClock(io, game, roomName, game.timespeed)
      break;
    case cmd.ADD_LINE:
        if (game.state == help.IN_GAME) {
          let tokens = Object.keys(game.players)
          for (let index = 0; index < tokens.length; index++) {
            const player = game.players[tokens[index]];
            if (player.state == help.PLAYER_ALIVE) {
              player.waitLines += data
            }
          }
        }
      break;
    default:
      logerror('bad game event', game, command)
      break;
  }
}
  
export function gameClock(io, game, roomName, time) {
    console.log('tic', game.timespeed)
    loginfo('tic', game.timespeed)
    return setTimeout(() => {
      if (game.state == help.IN_GAME) {
        let tokens = Object.keys(game.players)
        for (let index = 0; index < tokens.length; index++) {
          const player = game.players[tokens[index]];
          if (player.state == help.PLAYER_ALIVE) {
          console.log('tac',player.name,player.state)
            if (!player.shiftDown()) {
              let ok = player.newPiece(game.getPieces(player.index),game.getPieces(player.index + 1))
              if (ok[1]) {
                gameEvent(null, game, cmd.ADD_LINE, null, ok[1])
              }
              if (!ok[0]) {
                game.killplayer(tokens[index])
                loginfo(player.name, "is dead", tokens[index])
              } //// kill the player
              let nbline = 0;
              //// test remove line gameEvent(io, game, cmd.ADD_LINE, {socketid:socket,nbline:nbline})
            }
            io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
          }
        } 
        game.internalClockEvent = gameClock(io, game, roomName, game.timespeed)
      }
    }, time);
  }