import React from 'react'
import { connect } from 'react-redux'
import { register } from '../actions/server'

console.log(window.location)

const params = window.location.hash
console.log(params)

let player_name = 'toto'
let room_name = 'tata'

const App = ({socket}) => {
  if (!socket)
    return (
      <div></div>
    )
  console.log('socket:',socket)
  return (
    <div>
      {/* <span>{socket}</span> */}
      <button onClick={() => {
        socket.emit('register', register(room_name, player_name));
      }}>register</button>
      <button onClick={() => {
        socket.emit(`room#${room_name}`, "right");
      }}>room</button>
      <script> {maincode(socket)}</script>
    </div>
  )
}

function maincode(socket){
  console.log("mainSocket socket:", socket)
  socket.on('register', (msg) => console.log(msg))
  socket.on(`room#${room_name}`, (msg) => console.log(msg))
}

const mapStateToProps = (state) => {
  return {
    socket: state.socket,
  }
}
export default connect(mapStateToProps, null)(App)


