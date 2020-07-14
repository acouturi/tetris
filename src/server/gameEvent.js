import debug from 'debug'
import * as help from './helpers'
import * as cmd from '../helpers'

const logerror = debug('tetris:game_error')
, loginfo = debug('tetris:game_info')

  logerror('test')
  loginfo('test')

export function gameEvent(io, game, command, roomName, data= null) {
  switch (command) {
    case cmd.START_TIMER:
      let allPlayers = Object.values(game.players)
      for (let i = 0; i < allPlayers.length; i++) {
          allPlayers[i].init(game.pieces[0],game.pieces[1]);
          io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:allPlayers[i].data()})
      }

      let waitTimer = setInterval(() => {
          io.emit(`room#${roomName}`, {command:cmd.WAITING_TO_START,data:game.timeleft})
          game.timeleft--
          if (game.timeleft < 0){
          clearInterval(waitTimer)
          gameEvent(io, game, cmd.START_GAME, roomName)
          }
      },100)   //////// mettre 1000
      break;
    case cmd.START_GAME:
      game.state = help.IN_GAME
      game.internalClockEvent = gameClock(io, game, roomName, game.timespeed)
      break;
    case cmd.END_GAME:
      game.gameOver()
      let lstplayer= []
      Object.keys(game.players).forEach(token => {
        lstplayer.push(game.players[token].data())
      });
      io.emit(`room#${roomName}`, {command:cmd.GAMEOVER,data:lstplayer})
      break;
    case cmd.ADD_LINE:
        if (game.state == help.IN_GAME) {
          let tokens = Object.keys(game.players)
          for (let index = 0; index < tokens.length; index++) {
            const player = game.players[tokens[index]];
            if (player.state == help.PLAYER_ALIVE)
              player.waitLines += data
          }
        }
      break;
    default:
      logerror('bad game event', game, command)
      break;
  }
}
  
export function gameClock(io, game, roomName, time) {
    loginfo('tic', game.timespeed, game.watchdog)
    return setTimeout(() => {
      if (game.watchdog-- == 0)
        return
      if (game.state == help.IN_GAME) {
        let tokens = Object.keys(game.players)
        for (let index = 0; index < tokens.length; index++) {
          const player = game.players[tokens[index]];
          if (player.state == help.PLAYER_ALIVE) {
            loginfo('tac',player.name,player.state)
            if (!player.shiftDown()) {
              let ok = player.newPiece(game.getPieces(player.index),game.getPieces(player.index + 1))
              if (ok[1])
                gameEvent(null, game, cmd.ADD_LINE, null, ok[1])
              if (!ok[0]) {
                loginfo(player.name, "is dead", tokens[index])
                if(game.killplayer(tokens[index])) {
                  gameEvent(io, game, cmd.END_GAME, roomName)
                }
              }
            }
            io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player.data()})
          }
        } 
        game.internalClockEvent = gameClock(io, game, roomName, game.timespeed)
      }
    }, time);
  }