import _ from 'lodash'
import * as help from '../helpers'
import {pieces} from '../helpers/pieces'
import Pieces from './piece'

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
      this.nextPiece = JSON.parse(JSON.stringify(nextPiece))
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
            if (screen[x + currentPiece.positionx] && screen[x + currentPiece.positionx][y + currentPiece.positiony]) {
              if (screen[x + currentPiece.positionx][y + currentPiece.positiony] == -1)
                screen[x + currentPiece.positionx][y + currentPiece.positiony] = currentPiece.color
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
      currentPiece.positiony++
      if (!this.refreshScreen()) {
        currentPiece.positiony--
        this.refreshScreen()
      }
    }

    shiftLeft() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      currentPiece.positiony--
      if (!this.refreshScreen()) {
        currentPiece.positiony++
        this.refreshScreen()
      }
    }

    shiftDown() {
      this.currentPiece.positionx++
      if (!this.refreshScreen()) {
        this.currentPiece.positionx--
        this.refreshScreen()
        return false
      }
      return true
    }

    shiftFall() {
      this.currentPiece.positionx++
      while (this.refreshScreen()) {
        this.currentPiece.positionx++
      }
      this.currentPiece.positionx--
      this.refreshScreen()
      return false
    }

    rotatePiece() {
      this.currentPiece.rotate()
      let ok = this.refreshScreen()
      let tmp = ok
      while (!ok) {
        if(this.currentPiece.positiony < 0)
          this.currentPiece.positiony++
        if(this.currentPiece.positionx < 0)
          this.currentPiece.positionx++
        if(this.currentPiece.positiony + pieces[this.currentPiece.form][0].length > this.board[0].length)
          this.currentPiece.positiony--
        ok = this.refreshScreen()
        tmp = ok
        if (this.currentPiece.positionx > 0 && this.currentPiece.positiony > 0 && (this.currentPiece.positiony + pieces[this.currentPiece.form][0].length + 1) < this.board[0].length)
          ok = true
      }
      return tmp
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
          removed++
          this.board.splice(x, 1);
          this.board.unshift(_.map(new Array(10), () => {return -1}))
        }
      }
      return removed == 0 ? 0 : (removed - 1)
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