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

    init(newpiece,nextPiece) {
      this.waitLines = 0
      this.board = _.map(new Array(20), () => _.map(new Array(10), () => {return -1} ))
      this.index = 1
      this.state = help.PLAYER_ALIVE
      this.currentPiece = Object.assign( Object.create( Object.getPrototypeOf(newpiece)), newpiece)
      this.nextPiece =JSON.parse(JSON.stringify(nextPiece))
      // this.currentPiece = JSON.parse(JSON.stringify(newpiece))
      // console.log(newpiece)
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
          if (thisPiece[x][y] == 1) {
            if (screen[x + currentPiece.position.x] && screen[x + currentPiece.position.x][y + currentPiece.position.y]) {
              if (screen[x + currentPiece.position.x][y + currentPiece.position.y] == -1)
                screen[x + currentPiece.position.x][y + currentPiece.position.y] = currentPiece.color
              else {
                console.error('error 1', 'le pixel est deja rempli')
                return false
              }
            }
            else{
              console.error('error 1', 'la piece est en a l\'exterieur du cadre')
              return false
            }
          }
        }
      }
      this.screen = screen
      return true
    }

    shiftRight() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      currentPiece.position.y++
      if (!this.refreshScreen()) {
        currentPiece.position.y--
        this.refreshScreen()
      }
    }

    shiftLeft() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      currentPiece.position.y--
      if (!this.refreshScreen()) {
        currentPiece.position.y++
        this.refreshScreen()
      }
    }

    shiftDown() {
      this.currentPiece.position.x++
      if (!this.refreshScreen()) {
        this.currentPiece.position.x--
        this.refreshScreen()
        return false
      }
      return true
    }

    shiftFall() {
      this.currentPiece.position.x++
      while (this.refreshScreen()) {
        this.currentPiece.position.x++
      }
      this.currentPiece.position.x--
      this.refreshScreen()
      return false
    }

    rotatePiece() {
      this.currentPiece.rotate()
      // this.currentPiece.position.x--
      this.refreshScreen()
      // while (JSON.stringify(this.board) == JSON.stringify(this.screen)) {
      //   this.currentPiece.position.x--
      //   this.refreshScreen()
      // }
    }

    removeline() {
      let removed = 0
      for (let x = 0; x < this.board.length; x++) {
        let line = this.board[x];

        testelem :{
          for (let y = 0; y < line.length; y++) {
            let elem = line[y];
            if (elem <= -1)
              break testelem
          }
          console.log('full', x)
          removed++
          this.board.splice(x, 1);
          this.board.unshift(_.map(new Array(10), () => {return -1}))
        }
      }
      console.log(removed)
      let tmp = removed == 0 ? 0 : (removed - 1)
      console.log(tmp)
      return tmp
    }

    addbadline() {
      while (this.waitLines > 0) {
        let line = this.board.shift()
        this.board.push(_.map(new Array(10), () => {return -2}))
        for (let x = 0; x < line.length; x++) {
          const element = line[x];
          if (element != -1) {
            return true
          }
        }
        this.waitLines--
      }
      return false
    }

    newPiece(newpiece,nextPiece) {
      this.index++
      this.board = this.screen

      let removeline = this.removeline()
      this.waitLines -= removeline

      if (this.addbadline())
        return [false, removeline]

      this.currentPiece = Object.assign( Object.create( Object.getPrototypeOf(newpiece)), newpiece)
      this.nextPiece =JSON.parse(JSON.stringify(nextPiece))

      // this.board = JSON.parse(JSON.stringify(this.screen))
      // this.currentPiece = JSON.parse(JSON.stringify(newpiece))
      let ok = this.refreshScreen()
      console.log(ok)
      return [ok, removeline]
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