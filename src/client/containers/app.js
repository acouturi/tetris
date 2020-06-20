import React from 'react'
import { connect } from 'react-redux'


const App = ({socket}) => {
  console.log(socket)
  return (
    <div>
      {/* <span>{socket}</span> */}
      <button onClick={() => {
        // socket.emit('action', {type: 'server/ping'});
      }}>click</button>
      {/* <script> {maincode(socket)}</script> */}
    </div>
  )
}

function maincode(socket){
  console.log("socket:", socket)
  // socket.on('action', (msg) => console.log(msg))
}

const mapStateToProps = (state) => {
  return {
    socket: state.socket,
  }
}
export default connect(mapStateToProps, null)(App)


