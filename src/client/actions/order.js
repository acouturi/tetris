const ORDER = 'ORDER'

export const order = (event) => {
    return {
        type: ORDER,
        event: event
    }
}