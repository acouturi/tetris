import _ from 'lodash'
import * as help from '../helpers'
import pieces from '../helpers/pieces'

export default class Player {
    constructor(name, socketid) {
      this.name = name
      this.socketid = socketid
      this.state = help.PLAYER_NEW
    }

    init(newpiece) {
      this.board = _.map(new Array(20), () => _.map(new Array(10), () => {return -1} ))
      this.index = 1
      this.state = help.PLAYER_ALIVE
      this.currentPiece = JSON.parse(JSON.stringify(newpiece))
      refreshScreen()
    }

    restart() {
      this.state = help.PLAYER_NEW
      this.board = []
      this.screen = []
      this.currentPiece = null
    }
      
    refreshScreen() {
      // calque sur lequel on a la piece qui bouge
      let screen = JSON.parse(JSON.stringify(board))
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      for (let x = 0; x < thisPiece.length; x++) {
        for (let y = 0; y < thisPiece[x].length; y++) {
          if (screen[x + currentPiece.position.x] && screen[x + currentPiece.position.x][y + currentPiece.position.y]) {
            if (thisPiece[x][y] == 1) {
              if (screen[x + currentPiece.position.x][y + currentPiece.position.y] == -1)
                screen[x + currentPiece.position.x][y + currentPiece.position.y] = currentPiece.color
              else
                console.error('error 1', 'le pixel est deja rempli')
            }
          }
          else
            console.error('error 1', 'la piece est en a l\'exterieur du cadre')
        }
      }
      this.screen = screen
    }

    shiftRight() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      if (thisPiece.length + currentPiece.position.y < this.board[0].length){
        currentPiece.position.y++
        refreshScreen()
      }
    }

    shiftLeft() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      if (thisPiece.length + currentPiece.position.y < this.board[0].length){
        currentPiece.position.y--
        refreshScreen()
      }
    }

    shiftDown() {
      this.currentPiece.position.x++
      refreshScreen()
      return JSON.stringify(this.board) == JSON.stringify(this.screen)
    }

    shiftFall() {
      this.currentPiece.position.x++
      refreshScreen()
      while (JSON.stringify(this.board) == JSON.stringify(this.screen)) {
        this.currentPiece.position.x++
        refreshScreen()
      }
    }

    rotatePiece() {
      this.currentPiece.rotate()
      this.currentPiece.position.x--
      refreshScreen()
      while (JSON.stringify(this.board) == JSON.stringify(this.screen)) {
        this.currentPiece.position.x--
        refreshScreen()
      }
    }

    newPiece(newpiece) {
      this.index++
      this.board = this.screen
      // this.board = JSON.parse(JSON.stringify(this.screen))
      this.currentPiece = JSON.parse(JSON.stringify(newpiece))
      refreshScreen()
      ////test if player dead
    }
}