import * as cmd from '../../helpers'

// key.code
const mapKey = {
  ArrowRight: cmd.RIGHT,
  ArrowLeft: cmd.LEFT,
  ArrowUp: cmd.ROTATE,
  ArrowDown: cmd.DOWN,
  Space: cmd.FALL,
  Escape: cmd.PAUSE
}

export const right = (event) => {
    return {
<<<<<<< HEAD
        type: mapKey[event.code],
=======
        type: 'ArrowRight',
>>>>>>> refactoring
        event: event
    }
}

export const left = (event) => {
    return {
        type: 'ArrowLeft',
        event: event
    }
}

export const rotate = (event) => {
    return {
        type: 'ArrowUp',
        event: event
    }
}

export const down = (event) => {
    return {
        type: 'ArrowDown',
        event: event
    }
}

export const fall = (event) => {
    return {
        type: 'Space',
        event: event
    }
}

export const pause = (event) => {
    return {
        type: 'Escape',
        event: event
    }
}
