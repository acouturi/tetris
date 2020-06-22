export const ping = () => {
  return {
    type: 'server/ping'
  }
}

export const register = (room, name) => {
  return {
    room: room,
    player_name: name
  }
}