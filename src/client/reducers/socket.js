import { SOCKET_REQUEST, SOCKET_SUCCESS, SOCKET_FAILURE } from '../actions/alert'

const socket_reducer = (state = {} , action) => {
  switch(action.type){
    case SOCKET_SUCCESS:
      return { socket: action.socket }
    default: 
      return state
  }
}

export default socket_reducer

