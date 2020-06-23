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
      if (!mapGame[roomName]) {
        mapGame[roomName] = new Game(token,newplayer)
        loginfo("creat the room " + roomName)

        socket.on(`room#${roomName}`, (action) => gameEvent(socket, action, roomName))
      }
      else {
        if (mapGame[roomName].state == help.WAIT_PLAYERS)
          mapGame[roomName].addplayer(token,newplayer)
      }
      socket.emit('register', { token: token, nb_player: nb_player } )
      })
  })
}

function gameEvent(socket, action, roomName) {
  switch (action.command) {
    case cmd.RIGHT:
      if (mapGame[roomName].state == help.IN_GAME ) {

      }
      break;
    case cmd.LEFT:
      
      break;
    case cmd.DOWN:
      
      break;
    case cmd.ROTATE:
      
      break;
    case cmd.FALL:
      
      break;
    case cmd.PAUSE:
      
      break;
    case cmd.START:
      if (Object.values(mapGame[roomName].players)[0].socketid == socket.id) {
        loginfo("initialisation of the room " + roomName)
        mapGame[roomName].init()
        // socket.emit(`room#${roomName}`, action)
        socket.local.emit(`room#${roomName}`, {command:cmd.WAITING_TO_START,data:0})
        startGame(mapGame[roomName])
      }
      break;
  
    default:
      break;
  }

  function startGame(game) {
    game.state = help.IN_GAME
    let allPlayers = Object.values(game.players)
    for (let i = 0; i < allPlayers.length; i++) {
      allPlayers[i].init(game.pieces[0]);
    }
  }

  // console.log(cmd.START_PAUSE)
  // console.log('action:', action)
  // mapGame[roomName].init()
  // console.log(mapGame[roomName])
  // console.log(socket)
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
