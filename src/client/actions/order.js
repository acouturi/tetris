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

export const order = (event) => {
    return {
        type: mapKey[event.code],
        event: event
    }
}