import { alert_reducer } from './alert'
import { socket_reducer } from './socket'
import { order_reducer } from './order'
import { combineReducers } from 'redux'
// export default alert

export default combineReducers({
    socket_reducer,
    alert_reducer,
    order_reducer,
})



