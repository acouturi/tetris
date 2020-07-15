import debug from 'debug'
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
          game.emit(cmd.REFRESH_PLAYER,allPlayers[i].data())
      }

      let waitTimer = setInterval(() => {
          game.emit(cmd.WAITING_TO_START,game.timeleft)

          game.timeleft--
          if (game.timeleft < 0){
            clearInterval(waitTimer)
            gameEvent(io, game, cmd.START_GAME, roomName)
          }
      },100)   //////// mettre 1000
      break;
    case cmd.START_GAME:
      game.state = cmd.IN_GAME
      let lstplayer= []
      Object.keys(game.players).forEach(token => {
        lstplayer.push(game.players[token].data())
      });
      game.emit(cmd.GAMESTART,game.lstplayer)
      game.internalClockEvent = gameClock(io, game, roomName, game.timespeed)
      break;
    case cmd.END_GAME:
      game.gameOver()
      let lstplayer2 = []
      Object.keys(game.players).forEach(token => {
        lstplayer2.push(game.players[token].data())
      });
      game.emit(cmd.GAMEOVER,game.lstplayer2)
      break;
    case cmd.ADD_LINE:
        if (game.state == cmd.IN_GAME) {
          let tokens = Object.keys(game.players)
          for (let index = 0; index < tokens.length; index++) {
            const player = game.players[tokens[index]];
            if (player.state == cmd.PLAYER_ALIVE)
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
    if (game.state == cmd.IN_GAME) {
      let tokens = Object.keys(game.players)
      for (let index = 0; index < tokens.length; index++) {
        const player = game.players[tokens[index]];
        if (player.state == cmd.PLAYER_ALIVE) {
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
          game.emit(cmd.REFRESH_PLAYER,player.data())
        }
      } 
      game.internalClockEvent = gameClock(io, game, roomName, game.timespeed)
    }
  }, time);
}