import fs  from 'fs'
import debug from 'debug'
import { generatetoken } from './helpers'
import Game from './classes/game'
import Piece from './classes/piece'

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
  token:'abcde',
  players:'wip'
}

const initEngine = io => {
  io.on('connection', function(socket){
    loginfo("Socket connected: " + socket.id)
    console.log(socket.id)
    socket.on('action', (action) => {
      console.log("received", action, socket)
      if(action.type === 'server/ping'){
        socket.emit('action', {type: 'pong'})
      }
    })
    socket.on('register', (register) => {
      //si player id exist
        // return error
      //si newroom exist
        //join room
      //else
        //creat room
      console.log(register)
      register.socket = socket.id
      let token = 'abcde'//generatetoken()
      socket.emit('register', { token: token, nb_player: 0 } )
      console.log(mapGame)
      if (!mapGame[register.room]) {
        mapGame[register.room] = new Game()
        socket.on(`room#${register.room}`, (action) => {
          console.log('action:', action)
          mapGame[register.room].init()
          console.log(mapGame[register.room])
          socket.emit(`room#${register.room}`, action)
        })
      }
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
