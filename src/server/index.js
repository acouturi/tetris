import fs  from 'fs'
import debug from 'debug'
import { generatetoken } from './helpers'
import Game from './classes/game'
import Piece from './classes/piece'
import Player from './classes/player'
import * as help from './helpers'
import * as cmd from '../helpers'

const logerror = debug('tetris:error')
  , loginfo = debug('tetris:info')

const initApp = (app, params, cb) => {
  const {host, port} = params
  const handler = (req, res) => {
    const file = req.url === '/bundle.js' ? '/../../build/bundle.js' : '/../../index.html'
    fs.readFile(__dirname + file, (err, data) => {
      if (err) {
        logerror(err)
        res.writeHead(500)
        return res.end('Error loading index.html')
      }
      res.writeHead(200)
      res.end(data)
    })
  }

  app.on('request', handler)

  app.listen({host, port}, () =>{
    loginfo(`tetris listen on ${params.url}`)
    cb()
  })
}



/*
player structure = {
  socketid: 'Oh19QzuCMEW0cTCYAAAB',
  name: 'arthur',
  board[20][10]: [...],
  curentpiece: 3
}
*/

/*
generatedtoken = token qui identifie une session de jeu

room structure = {
  playeurs: [*player], (key; generated token, value: struct player)
  state: WAIT_PLAYEUR,
  lstpieces[20]: [62,41,23,00,12,...]
}
*/

/*
all states
WAIT_PLAYER
INIT_GAME
IN_GAME
GAME_OVER
*/

let mapGame = {}

var reponsetest= {
   "name":"toto",
  "socketid":"FQKOxEitv2_f6__YAAAA",
  "index":0,
  "board":[[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]],
  "currentPiece":{
    "form":2,
    "rotation":2,
    "position":{
      "x":5,
      "y":0},
    "color":318.7959148351146}}

const initEngine = io => {
  io.on('connection', function(socket){
    let socketid = socket.id
    loginfo("Socket connected: " + socketid)
    socket.on('register', (register) => {
      loginfo(socketid + " is now : " + register.player_name)

      let newplayer = new Player(register.player_name, socketid)
      let token = generatetoken()
      // newplayer.init(new Piece())

      let nb_player = 0
      let roomName = register.room
      console.log(roomName)
      if (!mapGame[roomName]) {
        let curentroom = new Game(token,newplayer)
        mapGame[roomName] = curentroom
        loginfo("creat the room " + roomName)
        socket.on(`room#${roomName}`, (action) => gamePlayerEvent(io, socket, action, curentroom, roomName, token)) ///gamePlayerEvent(io, socket, action, curentroom)
      }
      else {
        if (mapGame[roomName].state == help.WAIT_PLAYERS)
          mapGame[roomName].addplayer(token,newplayer)
        else
          {}//add in spectator mod
      }
      socket.on('disconnect', ()=> {
        loginfo(register.player_name, "ragequit", token)
        if (mapGame[roomName].removeplayer(token)){
          delete mapGame[roomName]
        }
      })
      socket.emit('register', { token: token, nb_player: nb_player } )
    })
  })
}

function gamePlayerEvent(io, socket, action, curentroom, roomName, token) {
  let player = curentroom.players[token]
  console.log(action, player.name)
  // console.log(player)
  // return;
  switch (action.command) {
    case cmd.RIGHT:
      if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE)
        player.shiftRight()
      io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
      break;
    case cmd.LEFT:
      if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE)
        player.shiftLeft()
      io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
      break;
    case cmd.ROTATE:
      if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE)
        player.rotatePiece()
      io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
      break;
    case cmd.DOWN:
    case cmd.FALL:    
      if (curentroom.state == help.IN_GAME && player.state == help.PLAYER_ALIVE) {
        let ok = action.command == cmd.DOWN ? player.shiftDown() : player.shiftFall()
        if (!ok) {
          ok = player.newPiece(curentroom.getPieces(player.index),curentroom.getPieces(player.index + 1))
          console.log(ok)
          if (ok[1]) {
              gameEvent(null, curentroom, cmd.ADD_LINE, null, ok[1])
          }
          if (!ok[0]) {
            curentroom.killplayer(token)
            loginfo(player.name, "is dead", token)
          } //// kill the player
          let nbline = 0;
          //// test remove line gameEvent(io, game, cmd.ADD_LINE, {socketid:socket,nbline:nbline})
        }
      }
      io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
      break;
    case cmd.PAUSE:
      if (Object.values(curentroom.players)[0].socketid == socket.id) {
        if (curentroom.state == help.IN_PAUSE) {
          io.emit(`room#${roomName}`, {command:cmd.END_PAUSE,data:null})
          curentroom.state = help.IN_GAME
        }
        else if (curentroom.state == help.IN_GAME) {
          io.emit(`room#${roomName}`, {command:cmd.START_PAUSE,data:null})
          curentroom.state = help.IN_PAUSE
        }
      }
      break;
    case cmd.START:
      if (curentroom.state == help.WAIT_PLAYERS || curentroom.state == help.GAME_OVER) {
        if (Object.values(curentroom.players)[0].socketid == socket.id) {
          curentroom.state = help.INIT_GAME
          loginfo("initialisation of the room " + roomName)
          curentroom.init()
          // socket.emit(`room#${roomName}`, action)
          // io.emit(`room#${roomName}`, {command:cmd.WAITING_TO_START,data:0})
          gameEvent(io, curentroom, cmd.START_TIMER, roomName, null)
        }
      }
      break;
  
    default:
      logerror('bad commande player',action.command, player)
      break;
  }
}

function gameEvent(io, game, command, roomName, data) {
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
            const player = game.players[tokens];
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

function gameClock(io, game, roomName, time) {
  console.log('tic')
  return setTimeout(() => {
    if (game.state == help.IN_GAME) {
      let tokens = Object.keys(game.players)
      for (let index = 0; index < tokens.length; index++) {
        const player = game.players[tokens];
        if (player.state == help.PLAYER_ALIVE) {
        console.log('tac',player.name,player.state)
          if (!player.shiftDown()) {
            let ok = player.newPiece(game.getPieces(player.index),game.getPieces(player.index + 1))
            console.log(ok)
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

export function create(params){
  const promise = new Promise( (resolve, reject) => {
    const app = require('http').createServer()
    initApp(app, params, () =>{
      const io = require('socket.io')(app)
      const stop = (cb) => {
        io.close()
        app.close( () => {
          app.unref()
        })
        loginfo(`Engine stopped.`)
        cb()
      }

      initEngine(io)
      resolve({stop})
    })
  })
  return promise
}
