import io from 'socket.io-client'

export const SOCKET_REQUEST = 'SOCKET_REQUEST'
export const SOCKET_SUCCESS = 'SOCKET_SUCCESS'
export const SOCKET_FAILURE = 'SOCKET_FAILURE'

export function socketRequest() {
    return {
        type: SOCKET_REQUEST,
    }
}

export function socketSuccess(socket) {
    return {
        type: SOCKET_SUCCESS,
        socket
    }
}

export function socketFailure(error) {
    return {
        type: SOCKET_FAILURE,
        error
    }
}

export function socketConnect(url) {
    return function (dispatch) {
        const socket = io(url)
        dispatch(socketSuccess(socket))
    }
}