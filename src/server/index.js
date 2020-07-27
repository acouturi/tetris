import fs  from 'fs'
import debug from 'debug'
import { generatetoken } from './helpers'
import Game from './classes/game'
import Player from './classes/player'
import {playerEvent} from './playerEvent'
import * as cmd from '../helpers'

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

const initEngine = io => {
  io.on('connection', function(socket){
    let socketid = socket.id
    loginfo("Socket connected: " + socketid)

    socket.on('action', (action) => {
      if(action.type === 'server/ping'){
        socket.emit('action', {type: 'pong'})
      }
    })

    socket.on('register', (register) => {

      if (!register.player_name || register.player_name.length == 0 || !register.room || register.room.length == 0)
        return socket.emit('msgError', { msg: "username or room name invalide" } )

      loginfo(socketid + " is now : " + register.player_name)

      let newplayer = new Player(register.player_name, socketid)
      let token = generatetoken()

      let roomName = register.room
      let thisroom = mapGame[roomName]
      if (!thisroom) {
        let curentroom = new Game(token,newplayer,io,roomName)
        mapGame[roomName] = curentroom
        thisroom = mapGame[roomName]
        loginfo("creat the room " + roomName)
      }
      else
        thisroom.addplayer(token,newplayer)
      console.log(Object.keys(thisroom.players))
      socket.on(`room#${roomName}`, (action) => playerEvent(action, thisroom, token))

      socket.on('disconnect', ()=> {
        thisroom.emit(cmd.PLAYER_LEFT,thisroom.data())
        loginfo(register.player_name, "ragequit", token)
        mapGame[roomName].info()
        if (thisroom.removeplayer(token))
          delete mapGame[roomName]
      })
      console.log(token)
      thisroom.emit(cmd.PLAYER_JOIN,thisroom.data())
      mapGame[roomName].info()
      socket.emit('register', { token: token} )
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
