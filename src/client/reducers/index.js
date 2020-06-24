import { alert_reducer } from './alert'
import { socket_reducer } from './socket'
import { combineReducers } from 'redux'
// export default alert

export default combineReducers({
    socket_reducer,
    alert_reducer,
})



