import React from 'react'
import ReactDom from 'react-dom'
import createLogger from 'redux-logger'
import thunk from 'redux-thunk'
import { createStore, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'                                                                                                                                                    
import {storeStateMiddleWare} from './middleware/storeStateMiddleWare'
import reducer from './reducers'
import App from './containers/app'
import {alert} from './actions/alert'
import {socketConnect, socketRequest, socketSuccess} from './actions/socket'
import socketIOClient from "socket.io-client";
import io from 'socket.io-client'
import params from '../../params'

// const socket = io(params.server.url)

const initialState = {}

const store = createStore(
	reducer,
	initialState,
	applyMiddleware(thunk, createLogger())
)        

// socket.on('action', (msg) => console.log(msg))

console.log('tata')
ReactDom.render((
	<Provider store={store}>
		<App/>
	</Provider>
), document.getElementById('tetris'))

console.log('toto')
store.dispatch(socketSuccess(io(params.server.url)))
