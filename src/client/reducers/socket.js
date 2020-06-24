import { SOCKET_REQUEST, SOCKET_SUCCESS, SOCKET_FAILURE } from '../actions/socket'

export const socket_reducer = (state = {} , action) => {
  switch(action.type){
    case SOCKET_SUCCESS:
      return Object.assign({}, state, { socket: action.socket })
    default: 
      return state
  }
}