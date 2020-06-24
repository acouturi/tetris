import React from 'react'
import { connect } from 'react-redux'
import { register } from '../actions/server'
import * as cmd from '../../helpers'

console.log(window.location)

const params = window.location.hash
console.log(params)

const mapKey = {
  ArrowRight: cmd.RIGHT,
  ArrowLeft: cmd.LEFT,
  ArrowUp: cmd.ROTATE,
  ArrowDown: cmd.DOWN,
  Space: cmd.FALL,
  Escape: cmd.PAUSE
}

let token = null
let nb_player = null
let player_name = params.slice(params.indexOf('[')+1, -1)
let room_name = params.substr(1, params.indexOf('[')-1)

const App = ({socket}) => {
  if (!socket)
    return (
      <div></div>
    )
  console.log('socket:',socket)
  return (
    <div>
      <button onClick={() => {
        console.log("token nb_player:", token, nb_player)
      }}>token player</button>
      <script> {maincode(socket)}</script>
    </div>
  )
}

function maincode(socket){
  console.log("player name:", player_name)
  console.log("room name:", room_name)
  socket.emit('register', register(room_name, player_name))
  console.log("mainSocket socket:", socket)
  socket.on('register', (msg) => ({token, nb_player} = msg))
  socket.on(`room#${room_name}`, (msg) => console.log(`[REPONSE] room#${room_name}`, msg))

  // Ecoute les key pressed et les envoies au back
  document.addEventListener('keyup', (key) => {
    if (key.code in mapKey) {
      const command = mapKey[key.code]
      console.log(`[SEND] room#${room_name}`, {token, command})
      socket.emit(`room#${room_name}`, {token, command})
    }
  })
}

const mapStateToProps = (state) => {
  return {
    socket: state.socket_reducer.socket,
  }
}
export default connect(mapStateToProps, null)(App)


