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

    //tested full
    init(newpiece,nextPiece) {
      this.score = 0
      this.waitLines = 0
      this.board = _.map(new Array(20), () => _.map(new Array(10), () => {return -1} ))
      this.index = 1
      this.state = help.PLAYER_ALIVE
      this.currentPiece = Object.assign( Object.create( Object.getPrototypeOf(newpiece)), newpiece)
      this.nextPiece = JSON.parse(JSON.stringify(nextPiece))
      this.refreshScreen()
    }

    //tested full
    restart() {
      this.state = help.PLAYER_NEW
      this.board = []
      this.screen = []
      this.currentPiece = null
    }

    //tested full
    refreshScreen() {
      let screen = JSON.parse(JSON.stringify(this.board))
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      for (let x = 0; x < thisPiece.length; x++) {
        for (let y = 0; y < thisPiece[x].length; y++) {
          if (thisPiece[x][y] == 1) {
            if (screen[x + currentPiece.positionx] && screen[x + currentPiece.positionx][y + currentPiece.positiony]) {
              if (screen[x + currentPiece.positionx][y + currentPiece.positiony] == -1)
                screen[x + currentPiece.positionx][y + currentPiece.positiony] = currentPiece.color
              else
                return false
            }
            else
              return false
          }
        }
      }
      this.screen = screen
      return true
    }

    //tested full
    shiftRight() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      currentPiece.positiony++
      if (!this.refreshScreen()) {
        currentPiece.positiony--
        this.refreshScreen()
      }
    }

    //tested full
    shiftLeft() {
      let currentPiece = this.currentPiece
      const thisPiece = pieces[currentPiece.form][currentPiece.rotation]
      currentPiece.positiony--
      if (!this.refreshScreen()) {
        currentPiece.positiony++
        this.refreshScreen()

      }
    }

    //tested full
    shiftDown() {
      this.currentPiece.positionx++
      if (!this.refreshScreen()) {
        this.currentPiece.positionx--
        this.refreshScreen()
        return false
      }
      return true
    }

    //tested full
    shiftFall() {
      this.currentPiece.positionx++
      while (this.refreshScreen())
        this.currentPiece.positionx++
      this.currentPiece.positionx--
      this.refreshScreen()
      return false
    }

    //tested
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
        if (this.currentPiece.positionx > 0 && this.currentPiece.positiony > 0 && (this.currentPiece.positiony + pieces[this.currentPiece.form][0].length + 1) < this.board[0].length){
          ok = true
          console.error('usless 1')
        }
      }
      return tmp
    }

    //tested full
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
      this.score += (10 * (removed))
      return removed == 0 ? 0 : (removed - 1)
    }

    //tested full
    addbadline() {
      while (this.waitLines > 0) {
        let line = this.board.shift()
        this.board.push(_.map(new Array(10), () => {return -2}))
        for (let x = 0; x < line.length; x++) {
          const element = line[x];
          if (element != -1)
            return true
        }
        this.waitLines--
      }
      return false
    }

    //tested full
    newPiece(newpiece,nextPiece) {
      this.index++
      this.board = this.screen
      this.score += 4

      let removeline = this.removeline()
      this.waitLines -= removeline

      if (this.addbadline())
        return [false, removeline]

      this.currentPiece = Object.assign( Object.create( Object.getPrototypeOf(newpiece)), newpiece)
      this.nextPiece =JSON.parse(JSON.stringify(nextPiece))
      let ok = this.refreshScreen()
      return [ok, removeline]
    }

    //tested full
    data() {
      if (this.screen){
        const cleared = (({ socketid,name,state,screen,score }) => ({ socketid,name,state,screen,score }))(this);
        cleared.nextPiece = pieces[this.nextPiece.form][this.nextPiece.rotation]
        return cleared
      }
      const cleared = (({socketid,name,state}) => ({socketid,name,state}))(this);
      return cleared
    }
}