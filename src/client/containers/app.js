import React from 'react'
import { connect } from 'react-redux'
import { register } from '../actions/server'
import * as cmd from '../../helpers'
import Game from '../components/game'
import io from 'socket.io-client'
import params from '../../../params'

console.log(window.location)

const url = window.location.hash
console.log(url)

const mapKey = {
  ArrowRight: cmd.RIGHT,
  ArrowLeft: cmd.LEFT,
  ArrowUp: cmd.ROTATE,
  ArrowDown: cmd.DOWN,
  Space: cmd.FALL,
  Escape: cmd.PAUSE
}

let socket = io(params.server.url)
let token = null
let nb_player = null
let player_name = url.slice(url.indexOf('[')+1, -1)
let room_name = url.substr(1, url.indexOf('[')-1)
let player_state = null
let game_state = null

const App = () => {
  console.log('socket:',socket)
  return (
    <div>
      <h2>Welcome to Red Tetris</h2>
      <button onClick={() => {
        console.log("token nb_player:", token, nb_player)
      }}>token player</button>
      <button onClick={() => {
        console.log({token, command: cmd.START})
        socket.emit(`room#${room_name}`, {token, command: cmd.START})
      }}>START</button>
      <textarea id='tmpScreen' rows="30" cols="50"></textarea>
      <textarea id='tmpScreen2' rows="30" cols="50"></textarea>
      <script> {maincode(socket)}</script>
      <Game player_name={player_name} room_name={room_name}/>
    </div>
  )
}

function maincode(socket){
  socket.emit('register', register(room_name, player_name))
  console.log("mainSocket socket:", socket)
  // replace the null value of token and nb_player by the response of the server
  socket.on('register', (msg) => ({token, nb_player} = msg))
  socket.on(`room#${room_name}`, (msg) => {
    console.log(`[REPONSE] room#${room_name}`, msg)
    if (msg.command == "REFRESH_PLAYER")
      if (msg.data.socketid == socket.id)
        document.getElementById('tmpScreen').value = JSON.stringify(msg.data.screen).replace(/],/g,'\n').replace(/\[/g,'').replace(']]','')
      else
        document.getElementById('tmpScreen2').value = JSON.stringify(msg.data.screen).replace(/],/g,'\n').replace(/\[/g,'').replace(']]','')
  })

  // Ecoute les key pressed et les envoies au back
  document.addEventListener('keyup', (key) => {
    if (key.code in mapKey) {
      const command = mapKey[key.code]
      console.log(`[SEND] room#${room_name}`, {token, command})
      socket.emit(`room#${room_name}`, {token, command})
    }
  })
}

export default App


