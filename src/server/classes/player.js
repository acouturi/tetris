import _ from 'lodash'
import * as help from '../helpers'
import {pieces} from '../helpers/pieces'
import Piece from './piece'

export default class Player {
    constructor(name, socketid) {
      this.name = name
      this.socketid = socketid
      this.state = help.PLAYER_NEW
    }

    init(newpiece) {
      this.waitLines = 0
      this.board = _.map(new Array(20), () => _.map(new Array(10), () => {return -1} ))
      this.index = 1
      this.state = help.PLAYER_ALIVE
      this.currentPiece = Object.assign( Object.create( Object.getPrototypeOf(newpiece)), newpiece)
      // this.currentPiece = JSON.parse(JSON.stringify(newpiece))
      console.log(newpiece)
      this.refreshScreen()
    }

    restart() {
      this.state = help.PLAYER_NEW
      this.board = []
      this.screen = []
      this.currentPiece = null
    }
      
    refreshScreen() {
      // calque sur lequel on a la piece qui bouge
      let screen = JSON.parse(JSON.stringify(this.board))
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
        this.refreshScreen()
      }
    }

    shiftLeft() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      if (thisPiece.length + currentPiece.position.y < this.board[0].length){
        currentPiece.position.y--
        this.refreshScreen()
      }
    }

    shiftDown() {
      this.currentPiece.position.x++
      this.refreshScreen()
      return JSON.stringify(this.board) == JSON.stringify(this.screen)
    }

    shiftFall() {
      this.currentPiece.position.x++
      this.refreshScreen()
      while (JSON.stringify(this.board) == JSON.stringify(this.screen)) {
        this.currentPiece.position.x++
        this.refreshScreen()
      }
    }

    rotatePiece() {
      this.currentPiece.rotate()
      this.currentPiece.position.x--
      this.refreshScreen()
      // while (JSON.stringify(this.board) == JSON.stringify(this.screen)) {
      //   this.currentPiece.position.x--
      //   this.refreshScreen()
      // }
    }

    newPiece(newpiece) {
      console.log('add',newpiece)
      this.index++
      this.board = this.screen
      this.currentPiece = Object.assign( Object.create( Object.getPrototypeOf(newpiece)), newpiece)

      // this.board = JSON.parse(JSON.stringify(this.screen))
      // this.currentPiece = JSON.parse(JSON.stringify(newpiece))
      console.log('add',this.currentPiece)
      this.refreshScreen()
      // if (JSON.stringify(this.board) != JSON.stringify(this.screen)) {
      //   //fillBadLine()
      //   return (JSON.stringify(this.board) != JSON.stringify(this.screen))
      // }
      // return false
      ////test if player dead
    }

    fillBadLine() {
      while (this.waitLines--) {
        let firstLine = this.board.shift()
        this.board.push(_.map(new Array(10), () => {return -2} ))
        this.refreshScreen()
      }
    }
}