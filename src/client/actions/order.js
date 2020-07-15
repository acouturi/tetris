import * as cmd from '../../helpers'

export const right = (event) => {
    return {
        type: 'ArrowRight',
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
