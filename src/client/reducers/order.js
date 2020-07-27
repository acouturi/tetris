import * as cmd from '../../helpers'

export const order_reducer = (state = {}, action) => {
  switch (action.type) {
    default:
      console.log(action)
      return { lastorder : action.type }
  }
}