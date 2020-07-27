import { connect } from 'react-redux'
import React from 'react'
import PropTypes from 'prop-types'

const Game = ({ player_name, room_name }) => {
  return (
    <div>
        <h2>GAME</h2>
        <h3>My name is {player_name} and I want to join the room {room_name}</h3>
        <script> {maincode(player_name, room_name)}</script>
    </div>
  )
}

function maincode(player_name, room_name){
  console.log("[GAME] player name:", player_name)
  console.log("[GAME] room name:", room_name)

  // Ecoute les key pressed et les envoies au back
  document.addEventListener('keyup', (key) => {
    console.log(`[GAME] room#${room_name}`, key)

  })
}

Game.prototype = {
    player_name : PropTypes.string.isRequired,
    room_name : PropTypes.string.isRequired,
}

export default Game