import fs  from 'fs'
import debug from 'debug'
import { generatetoken } from './helpers'
import Game from './classes/game'
import Player from './classes/player'
import {playerEvent} from './playerEvent'

const logerror = debug('tetris:main_error')
  , loginfo = debug('tetris:main_info')

  logerror('test')
  loginfo('test')

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

let mapGame = {}

var reponsetest= {
   "name":"toto",
  "socketid":"FQKOxEitv2_f6__YAAAA",
  "index":0,
  "board":[[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1],[-1,-1,-1,-1,-1,-1,-1,-1,-1,-1]],
  "currentPiece":{
    "form":2,
    "rotation":2,
    "positionx": 5,
    "positiony": 0,
    "color":318.7959148351146}
}

const initEngine = io => {
  io.on('connection', function(socket){
    let socketid = socket.id
    loginfo("Socket connected: " + socketid)
    socket.on('register', (register) => {
      loginfo(socketid + " is now : " + register.player_name)

      let newplayer = new Player(register.player_name, socketid)
      let token = generatetoken()
      // newplayer.init(new Piece())

      let roomName = register.room
      if (!mapGame[roomName]) {
        let curentroom = new Game(token,newplayer)
        mapGame[roomName] = curentroom
        loginfo("creat the room " + roomName)
      }
      else {
        // if (mapGame[roomName].state == help.WAIT_PLAYERS)
          mapGame[roomName].addplayer(token,newplayer)
        // else
          // {}//add in spectator mod
      }
      console.log(Object.keys(mapGame[roomName].players))
      socket.on(`room#${roomName}`, (action) => playerEvent(io, socket, action, mapGame[roomName], roomName, token)) ///gamePlayerEvent(io, socket, action, curentroom)

      socket.on('disconnect', ()=> {
        loginfo(register.player_name, "ragequit", token)
        if (mapGame[roomName].removeplayer(token)){
          delete mapGame[roomName]
        }
      })
      console.log(token)
      socket.emit('register', { token: token, nb_player: null } )
    })
  })
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
