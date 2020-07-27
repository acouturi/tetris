export const SETPLAYER = "SETPLAYER"

export const setPlayer = (name, room) => {
  return {
    type: SETPLAYER,
    name,
    room
  }
}