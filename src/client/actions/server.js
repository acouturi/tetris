export const ping = () => {
  return {
    type: 'server/ping'
  }
}

export const register = (name) => {
  return {
    type: `server/${name}`
  }
}