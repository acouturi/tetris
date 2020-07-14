import chai, { expect } from "chai"
import Player from '../src/server/classes/player'
import Piece from '../src/server/classes/piece'
import * as help from '../src/server/helpers/index'
import _ from 'lodash'

chai.should()

describe('creatplayer', () => {
    it('new player', () => {
        let fakeplayer = new Player("toto", "123")
        fakeplayer.name.should.equal("toto")
    });

    it('bad player init', () => {
        let fakeplayer = new Player("toto", "123")
        fakeplayer.state.should.equal(help.PLAYER_NEW)
        expect(fakeplayer.init).to.throw(Error)
    });

    it('player init', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(3,0,0,3,88)

        fakeplayer.state.should.equal(help.PLAYER_NEW)
        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.state.should.equal(help.PLAYER_ALIVE)
    });

    it('player refreshScreen', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(0,0,1,3,88)

        fakeplayer.init(fakepiece,fakepiece)
        let tmp = JSON.stringify(fakeplayer.screen)
        fakeplayer.shiftDown()
        JSON.stringify(fakeplayer.screen).should.not.equal(tmp)
        tmp = JSON.stringify(fakeplayer.screen)
        fakeplayer.refreshScreen()
        JSON.stringify(fakeplayer.screen).should.equal(tmp)


        fakepiece = new Piece(3,0,0,-3,88)
        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.refreshScreen().should.equal(false)
    });

    it('player shiftRight', () => {
        let fakeplayer = new Player("toto", "123")
        let testedy = 3
        let fakepiece = new Piece(0,1,1,testedy,88)

        fakeplayer.init(fakepiece,fakepiece)


        fakeplayer.currentPiece.positiony.should.equal(testedy)

        for (testedy; testedy < 7; testedy) {
            testedy++
            fakeplayer.shiftRight()
            fakeplayer.currentPiece.positiony.should.equal(testedy)
        }
        testedy++
        fakeplayer.shiftRight()
        fakeplayer.currentPiece.positiony.should.equal(testedy - 1)
    });

    it('player shiftLeft', () => {
        let fakeplayer = new Player("toto", "123")
        let testedy = 3
        let fakepiece = new Piece(0,0,1,testedy,88)

        fakeplayer.init(fakepiece,fakepiece)


        fakeplayer.currentPiece.positiony.should.equal(testedy)

        for (testedy; testedy > 0; testedy) {
            testedy--
            fakeplayer.shiftLeft()
            fakeplayer.currentPiece.positiony.should.equal(testedy)
        }
        testedy--
        fakeplayer.shiftLeft()
        fakeplayer.currentPiece.positiony.should.equal(testedy + 1)
    });

    it('player shiftDown', () => {
        let fakeplayer = new Player("toto", "123")
        let testedx = 0
        let fakepiece = new Piece(0,0,testedx,3,88)

        fakeplayer.init(fakepiece,fakepiece)

        fakeplayer.currentPiece.positionx.should.equal(testedx)
        for (testedx; testedx < 18; testedx) {
            testedx++
            fakeplayer.shiftDown()
            fakeplayer.currentPiece.positionx.should.equal(testedx)
        }
        testedx++
        fakeplayer.shiftDown()
        fakeplayer.currentPiece.positionx.should.equal(testedx - 1)
    });

    it('player shiftFall', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(0,0,0,3,88)

        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.shiftFall()
        fakeplayer.currentPiece.positionx.should.equal(18)
    });


    it('player rotatePiece 1', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(3,0,0,3,88)

        fakeplayer.init(fakepiece,fakepiece)

        for (let i = 1; i < 10; i++) {
            fakeplayer.rotatePiece()
            fakeplayer.currentPiece.rotation.should.equal(i%4)
        }
    });

    it('player rotatePiece 2', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(0,0,null,3,88)

        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.currentPiece.positionx.should.equal(-1)
        fakeplayer.rotatePiece()
        fakeplayer.currentPiece.positionx.should.equal(0)

        fakepiece = new Piece(0,2,null,3,88)
        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.currentPiece.positionx.should.equal(-2)
        fakeplayer.rotatePiece()
        fakeplayer.currentPiece.positionx.should.equal(0)
    });

    it('player rotatePiece 3', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(0,3,null,-1,88)

        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.currentPiece.positiony.should.equal(-1)
        fakeplayer.rotatePiece()
        fakeplayer.currentPiece.positiony.should.equal(0)

        fakepiece = new Piece(0,1,null,-2,88)
        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.currentPiece.positiony.should.equal(-2)
        fakeplayer.rotatePiece()
        fakeplayer.currentPiece.positiony.should.equal(0)
    });

    it('player rotatePiece 4', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(0,1,null,8,88)

        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.currentPiece.positiony.should.equal(8)
        fakeplayer.rotatePiece()
        fakeplayer.currentPiece.positiony.should.equal(6)

        fakepiece = new Piece(0,3,null,9,88)
        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.currentPiece.positiony.should.equal(9)
        fakeplayer.rotatePiece()
        fakeplayer.currentPiece.positiony.should.equal(6)
    });
  
    it('player removeline', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(3,0,0,3,88)

        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.board = _.map(new Array(20), () => _.map(new Array(10), () => {return 1} ))
        fakeplayer.removeline().should.equal(19)
        fakeplayer.board[0][0].should.equal(-1)
        fakeplayer.board[19][9].should.equal(-1)
    });

    it('player addbadline', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(3,0,4,3,88)

        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.waitLines = 2
        fakeplayer.addbadline()
        fakeplayer.waitLines.should.equal(0)
        fakeplayer.addbadline()
        fakeplayer.waitLines.should.equal(0)
        fakeplayer.board = _.map(new Array(20), () => _.map(new Array(10), () => {return 1} ))
        fakeplayer.waitLines = 2
        fakeplayer.addbadline().should.equal(true)
    });

    it('player newPiece', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(3,0,4,3,88)

        fakeplayer.init(fakepiece,fakepiece)
        fakeplayer.waitLines = 2
        fakeplayer.newPiece(fakepiece,fakepiece)
        fakeplayer.waitLines.should.equal(0)
        fakeplayer.screen = _.map(new Array(20), () => _.map(new Array(10), () => {return -2} ))
        fakeplayer.waitLines = 2
        JSON.stringify(fakeplayer.newPiece(fakepiece,fakepiece)).should.equal(JSON.stringify([false,0]))
        fakeplayer.screen = _.map(new Array(20), () => _.map(new Array(10), () => {return 1} ))
        fakeplayer.waitLines = 2
        JSON.stringify(fakeplayer.newPiece(fakepiece,fakepiece)).should.equal(JSON.stringify([true,19]))
    });

    it('player data', () => {
        let fakeplayer = new Player("toto", "123")
        let fakepiece = new Piece(3,0,0,3,88)

        let tmp = fakeplayer.data()
        tmp.socketid.should.equal("123")
        expect(tmp.score).to.not.exist

        fakeplayer.init(fakepiece,fakepiece)
        tmp = fakeplayer.data()
        tmp.socketid.should.equal("123")
        tmp.score.should.equal(0)

        fakeplayer.newPiece(fakepiece,fakepiece)
        tmp = fakeplayer.data()
        tmp.socketid.should.equal("123")
        tmp.score.should.equal(4)
    });
  });
  