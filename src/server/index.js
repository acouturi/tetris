import fs  from 'fs'
import debug from 'debug'

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
playeur structure = {
  socketid: 'Oh19QzuCMEW0cTCYAAAB',
  name: 'arthur',
  roomid: 'room123',
  board[20][10]: [...],
  curentpiece: 3
}
*/

/*
room structure = {
  roomid: 'room123',
  playeurs: ['Oh19QzuCMEW0cTCYAAAB'],
  state: WAIT_PLAYEUR,
  lstpieces[20]: [62,41,23,00,12,...]
}
*/

/*
all states
WAIT_PLAYEUR
INIT_GAME
IN_GAME
GAME_OVER
*/

let playeurLst = []

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
      console.log(register)
      if(register.type === 'server/vlay'){
        socket.emit('register', {type: '1'})
      }
    })
    socket.on('actnewplayer', () => {

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
