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
    // socket.on('action', (action) => {
    //   console.log("received", action, socket)
    //   if(action.type === 'server/ping'){
    //     socket.emit('action', {type: 'pong'})
    //   }
    // })
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
      socket.emit('register', { token: token, nb_player: nb_player } )
      })
  })
}

function gamePlayerEvent(io, socket, action, curentroom, roomName, token) {
  let player = curentroom.players[token]
  console.log(action,curentroom.players,socket.id)
  // console.log(player)
  // return;
  switch (action.command) {
    case cmd.RIGHT:
      if (curentroom.state == help.IN_GAME)
        player.shiftRight()
      io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
      break;
    case cmd.LEFT:
      if (curentroom.state == help.IN_GAME)
        player.shiftLeft()
      io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
      break;
    case cmd.ROTATE:
      if (curentroom.state == help.IN_GAME)
        player.rotatePiece()
    case cmd.DOWN:
      if (curentroom.state == help.IN_GAME) {
        if (player.shiftDown()) {
          if (!player.newPiece(curentroom.pieces[player.index]))
            {} //// kill the player
          curentroom.testPieces(player.index)
          let nbline = 0;
          //// test remove line gameEvent(io, game, cmd.ADD_LINE, {socketid:socket,nbline:nbline})
        }
      }
      io.emit(`room#${roomName}`, {command:cmd.REFRESH_PLAYER,data:player})
      break;
    case cmd.FALL:
      if (curentroom.state == help.IN_GAME) {
        player.shiftFall()
        if (!player.newPiece(curentroom.pieces[player.index]))
          {} //// kill the player
        curentroom.testPieces(player.index)
        let nbline = 0;
        //// test remove line gameEvent(io, game, cmd.ADD_LINE, {socketid:socket,nbline:nbline})
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
      if (curentroom.state == help.WAIT_PLAYERS) {
        if (Object.values(curentroom.players)[0].socketid == socket.id) {
          loginfo("initialisation of the room " + roomName)
          curentroom.init()
          // socket.emit(`room#${roomName}`, action)
          // io.emit(`room#${roomName}`, {command:cmd.WAITING_TO_START,data:0})
          game.state = help.INIT_GAME
          gameEvent(io, game, cmd.START_TIMER, null)
        }
      }
      break;
  
    default:
      logerror('bad commande player',action.command, player)
      break;
  }
}

function gameEvent(io, game, command, data) {
  switch (command) {
    case cmd.START_TIMER:
      let waitTimer = setInterval(() => {
        //decrays time left to start
        io.emit(`room#${roomName}`, {command:cmd.WAITING_TO_START,data:game.timeleft})
        game.timeleft--
        if (game.timeleft < 0){
          clearInterval(waitTimer)
          let allPlayers = Object.values(game.players)
          for (let i = 0; i < allPlayers.length; i++) {
            allPlayers[i].init(game.pieces[0]);
          }
          game.state = help.IN_GAME
        }
      },1000)
      break;
  
    case cmd.START_GAME:
      game.internalClockEvent = gameClock(io, game, game.timespeed)
      break;
    case cmd.ADD_LINE: {
        data.socket
      }
      break;
    default:
      logerror('bad game event', game, command)
      break;
  }
}

function gameClock(io, game, time) {
  setTimeout(() => {
    if (game.state == help.IN_GAME) {
      for (let index = 0; index < game.players.length; index++) {
        const player = game.players[index];
        if (player.state == help.PLAYER_ALIVE) {
          if (player.shiftDown()) {
            if (!player.newPiece(game.pieces[player.index]))
              {} //// kill the player
            game.testPieces(player.index)
            let nbline = 0;
            //// test remove line gameEvent(io, game, cmd.ADD_LINE, {socketid:socket,nbline:nbline})
          }
        }
      } 
      game.internalClockEvent = gameClock(io, game, game.timespeed)
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
