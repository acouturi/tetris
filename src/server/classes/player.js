import _ from 'lodash'
import * as cmd from '../../helpers'
import {pieces} from '../helpers/pieces'

export default class Player {
  constructor(name, socketid, bot = 0) {
    this.name = name
    this.socketid = socketid
    this.state = cmd.PLAYER_NEW
    this.bot = bot
  }

  //tested full
  init(newpiece,nextPiece) {
    this.score = 0
    this.waitLines = 0
    this.board = _.map(new Array(20), () => _.map(new Array(10), () => {return -1} ))
    this.index = 1
    this.state = cmd.PLAYER_ALIVE
    this.currentPiece = Object.assign( Object.create( Object.getPrototypeOf(newpiece)), newpiece)
    this.nextPiece = JSON.parse(JSON.stringify(nextPiece))
    this.refreshScreen()
  }

  //tested full
  restart() {
    this.state = cmd.PLAYER_NEW
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
    let ret = true
    let histox = this.currentPiece.positionx
    let histoy = this.currentPiece.positiony

    if (!ok) {
      ret = ok
      while(this.currentPiece.positiony < 0)
        this.currentPiece.positiony++
      while(this.currentPiece.positionx < 0)
        this.currentPiece.positionx++
      while(this.currentPiece.positiony + pieces[this.currentPiece.form][0].length > this.board[0].length)
        this.currentPiece.positiony--
      while(this.currentPiece.positionx + pieces[this.currentPiece.form][0].length > this.board.length){
        this.currentPiece.positionx--
        ret = null
      }
      ok = this.refreshScreen()
    }
    if (!ok) {
      this.currentPiece.rotate()
      this.currentPiece.rotate()
      this.currentPiece.rotate()
      this.currentPiece.positionx = histox
      this.currentPiece.positiony = histoy
      ret = false
    }
    return ret
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
    const clearedshort = (({socketid,name,state}) => ({socketid,name,state}))(this);
    return clearedshort
  }

  virtualScreen(virtualboard,virtualpiece) {
    const thisPiece = pieces[virtualpiece.form][virtualpiece.rotation]
    for (let x = 0; x < thisPiece.length; x++) {
      for (let y = 0; y < thisPiece[x].length; y++) {
        if (thisPiece[x][y] == 1) {
          if (virtualboard[x + virtualpiece.positionx] && virtualboard[x + virtualpiece.positionx][y + virtualpiece.positiony]) {
            if (virtualboard[x + virtualpiece.positionx][y + virtualpiece.positiony] == -1)
              virtualboard[x + virtualpiece.positionx][y + virtualpiece.positiony] = virtualpiece.color
            else
              return false
          }
          else
            return false
        }
      }
    }
    return true
  }

  gridcalculator(virtualpiece) {
    let gridvalue = 0
    let virtualboard = JSON.parse(JSON.stringify(this.board))
    this.virtualScreen(virtualboard,virtualpiece)
    for (let x = 0; x < virtualboard.length; x++) {
      for (let y = 0; y < virtualboard[x].length; y++) {
        if (virtualboard[x][y] != -1) {
          gridvalue += (virtualboard.length - x) * 1000 + y
        }
      }
    }
    return gridvalue
  }

  botmove() {
    let mainvirtualpiece = Object.assign( Object.create( Object.getPrototypeOf(this.currentPiece)), this.currentPiece)
    let nbrotmax = pieces[mainvirtualpiece.form].length
    let besty = 0;
    let bestrot = 0;
    let bestscore = 99999999;

    for (let rot = 0; rot < nbrotmax; rot++) {
      let rotvirtualpiece = Object.assign( Object.create( Object.getPrototypeOf(mainvirtualpiece)), mainvirtualpiece)
      rotvirtualpiece.rotation = rot

      const thisPiece = pieces[rotvirtualpiece.form][rotvirtualpiece.rotation]
      
      for (let y = -thisPiece.length; y < this.board[0].length; y++) {
        let virtualpiece = Object.assign( Object.create( Object.getPrototypeOf(rotvirtualpiece)), rotvirtualpiece)
        virtualpiece.positiony = y
        let tmpboard = JSON.parse(JSON.stringify(this.board))
        if(this.virtualScreen(tmpboard,virtualpiece)) {

          virtualpiece.positionx++
          while (this.virtualScreen(tmpboard = JSON.parse(JSON.stringify(this.board)),virtualpiece))
            virtualpiece.positionx++
          virtualpiece.positionx--
          this.virtualScreen(tmpboard = JSON.parse(JSON.stringify(this.board)),virtualpiece)

          this.virtualScreen(JSON.parse(JSON.stringify(this.board)),virtualpiece)
          let result = this.gridcalculator(virtualpiece)
          console.log(JSON.stringify(tmpboard).replace(/],/g,'\n').replace(/\[/g,'').replace(']]',''))
          console.log(virtualpiece.positiony,virtualpiece.positionx)
          console.log(y,result)
          if (result < bestscore) {
            bestscore = result
            besty = y
            bestrot = rot
          }
        }
      }
    }
    this.currentPiece.positiony = besty
    this.currentPiece.rotation = bestrot
    console.log(besty)
  }
}