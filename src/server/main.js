import params  from '../../params'
import * as server from './index'
server.create(params.server).then( () => console.log('yet ready to play tetris with U ...') )
