import chai, { expect } from "chai"
import {playerEvent} from '../src/server/playerEvent'
import {gameEvent,runningfonct,gameClock,initstart,testnewpiece} from '../src/server/gameEvent'
import Player from '../src/server/classes/player'
import Piece from '../src/server/classes/piece'
import Game from '../src/server/classes/game'
import * as cmd from '../src/helpers/index'
import _ from 'lodash'

chai.should()

describe('all event in game', () => {
    it('gameClock', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        
        let tmp = false
        tmp.should.equal(false)
        tmp = gameClock(fakegame)
        tmp.should.not.equal(false)
    });

    it('runningfonct', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        let fakeplayer2 = new Player("tata", "321")
        fakegame.addplayer('321', fakeplayer2)
        fakegame.testing = true
        fakegame.init()
        fakegame.pieces = _.map(new Array(5), () => new Piece(3,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.state = cmd.IN_GAME
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        runningfonct(fakegame)
        fakeplayer.currentPiece.positionx.should.equal(1)
        fakeplayer2.currentPiece.positionx.should.equal(1)
    });

    it('runningfonct', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        let fakeplayer2 = new Player("tata", "321")
        fakegame.addplayer('321', fakeplayer2)
        fakegame.testing = true
        fakegame.init()
        fakegame.pieces = _.map(new Array(5), () => new Piece(3,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.state = cmd.IN_GAME
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        runningfonct(fakegame)
        fakeplayer.currentPiece.positionx.should.equal(1)
        fakeplayer2.currentPiece.positionx.should.equal(1)

        fakeplayer.currentPiece.positionx = 17

        fakeplayer.currentPiece.positionx.should.equal(17)
        runningfonct(fakegame)
        fakeplayer.currentPiece.positionx.should.equal(0)
    });

    it('runningfonct watchdog', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.pieces = _.map(new Array(5), () => new Piece(3,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.watchdog = 5
        fakegame.state = cmd.IN_GAME
        fakeplayer.currentPiece.positionx.should.equal(0)
        for (let i = 0; i < 10; i++) {
            runningfonct(fakegame)
            if (i < 5)
                fakeplayer.currentPiece.positionx.should.equal(i + 1)
            else 
                fakeplayer.currentPiece.positionx.should.equal(5)
        }
        fakegame.watchdog.should.equal(-5)
    });

    it('runningfonct not in game', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.pieces = _.map(new Array(5), () => new Piece(3,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.watchdog = 5
        fakeplayer.currentPiece.positionx.should.equal(0)
        for (let i = 0; i < 10; i++) {
            runningfonct(fakegame)
            fakeplayer.currentPiece.positionx.should.equal(0)
        }
        fakegame.watchdog.should.equal(-5)
    });

    it('runningfonct kill player', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("toto", "321")
        let fakeplayer3 = new Player("toto", "111")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.addplayer('111', fakeplayer3)
        fakegame.init()
        fakegame.pieces = _.map(new Array(10), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer3.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.state = cmd.IN_GAME

        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        fakeplayer3.currentPiece.positionx.should.equal(0)
        runningfonct(fakegame)
        fakeplayer.currentPiece.positionx.should.equal(1)
        fakeplayer2.currentPiece.positionx.should.equal(1)
        fakeplayer3.currentPiece.positionx.should.equal(1)

        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')

        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(1)
        fakeplayer3.currentPiece.positionx.should.equal(1)
        runningfonct(fakegame)
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(2)
        fakeplayer3.currentPiece.positionx.should.equal(2)

        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')

        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        fakeplayer3.currentPiece.positionx.should.equal(2)
        runningfonct(fakegame)

        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        fakeplayer3.currentPiece.positionx.should.equal(2)
    });

    it('runningfonct kill player 2', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("toto", "321")
        let fakeplayer3 = new Player("toto", "111")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.addplayer('111', fakeplayer3)
        fakegame.init()
        fakegame.pieces = _.map(new Array(10), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer3.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.state = cmd.IN_GAME

        fakeplayer3.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        fakeplayer.currentPiece.positionx.should.equal(0)
        runningfonct(fakegame)
        fakeplayer3.currentPiece.positionx.should.equal(1)
        fakeplayer2.currentPiece.positionx.should.equal(1)
        fakeplayer.currentPiece.positionx.should.equal(1)

        playerEvent({command:cmd.FALL}, fakegame, '111')
        playerEvent({command:cmd.FALL}, fakegame, '111')
        playerEvent({command:cmd.FALL}, fakegame, '111')
        playerEvent({command:cmd.FALL}, fakegame, '111')
        playerEvent({command:cmd.FALL}, fakegame, '111')

        fakeplayer3.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(1)
        fakeplayer.currentPiece.positionx.should.equal(1)
        runningfonct(fakegame)
        fakeplayer3.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(2)
        fakeplayer.currentPiece.positionx.should.equal(2)

        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')

        fakeplayer3.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        fakeplayer.currentPiece.positionx.should.equal(2)
        runningfonct(fakegame)

        fakeplayer3.currentPiece.positionx.should.equal(0)
        fakeplayer2.currentPiece.positionx.should.equal(0)
        fakeplayer.currentPiece.positionx.should.equal(2)
    });

    it('initstart', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.timeleft = 5
        fakegame.state = cmd.WAIT_PLAYERS
        
        fakegame.timeleft.should.equal(5)
        for (let i = 0; i < 5; i++) {
            initstart(fakegame,null)
            fakegame.timeleft.should.equal(4-i)
        }

        fakegame.init()
        fakegame.timeleft = 5
        
        fakegame.timeleft.should.equal(5)
        for (let i = 0; i < 5; i++) {
            initstart(fakegame,null)
            fakegame.timeleft.should.equal(4-i)
        }
        fakegame.state.should.equal(cmd.IN_GAME)
        fakegame.state = cmd.WAIT_PLAYERS
    });

    it('cmd.START_TIMER', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("toto", "321")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.init()
        
        fakeplayer.state.should.equal(cmd.PLAYER_NEW)
        fakeplayer2.state.should.equal(cmd.PLAYER_NEW)
        gameEvent(fakegame, cmd.START_TIMER)
        fakegame.state = cmd.WAIT_PLAYERS
        fakeplayer.state.should.equal(cmd.PLAYER_ALIVE)
        fakeplayer2.state.should.equal(cmd.PLAYER_ALIVE)
    });

    it('cmd.START_GAME', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        
        fakegame.state.should.equal(cmd.INIT_GAME)
        gameEvent(fakegame, cmd.START_GAME)
        fakegame.state.should.equal(cmd.IN_GAME)
        fakegame.state = cmd.WAIT_PLAYERS
    });

    it('cmd.END_GAME', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        
        fakegame.state.should.equal(cmd.INIT_GAME)
        gameEvent(fakegame, cmd.START_GAME)
        gameEvent(fakegame, 'toto')
        fakegame.state.should.equal(cmd.IN_GAME)
        gameEvent(fakegame, cmd.END_GAME)
        fakegame.state.should.equal(cmd.GAME_OVER)
    });

    it('cmd.ADD_LINE', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("toto", "321")
        let fakeplayer3 = new Player("toto", "111")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.addplayer('321', fakeplayer2)
        fakegame.addplayer('111', fakeplayer3)
        fakegame.testing = true
        fakegame.init()

        expect(fakeplayer.waitLines).to.not.exist
        expect(fakeplayer2.waitLines).to.not.exist
        expect(fakeplayer3.waitLines).to.not.exist
        gameEvent(fakegame, cmd.ADD_LINE, 5)
        expect(fakeplayer.waitLines).to.not.exist
        expect(fakeplayer2.waitLines).to.not.exist
        expect(fakeplayer3.waitLines).to.not.exist

        fakegame.state.should.equal(cmd.INIT_GAME)
        gameEvent(fakegame, cmd.START_TIMER)
        gameEvent(fakegame, cmd.START_GAME)
        fakegame.state.should.equal(cmd.IN_GAME)

        fakeplayer.waitLines.should.equal(0)
        fakeplayer2.waitLines.should.equal(0)
        fakeplayer3.waitLines.should.equal(0)
        gameEvent(fakegame, cmd.ADD_LINE, 5)
        fakeplayer.waitLines.should.equal(5)
        fakeplayer2.waitLines.should.equal(5)
        fakeplayer3.waitLines.should.equal(5)
        gameEvent(fakegame, cmd.ADD_LINE, 1)
        fakeplayer.waitLines.should.equal(6)
        fakeplayer2.waitLines.should.equal(6)
        fakeplayer3.waitLines.should.equal(6)

        fakegame.killplayer('111')

        fakeplayer.waitLines.should.equal(6)
        fakeplayer2.waitLines.should.equal(6)
        fakeplayer3.waitLines.should.equal(6)
        gameEvent(fakegame, cmd.ADD_LINE, 1)
        fakeplayer.waitLines.should.equal(7)
        fakeplayer2.waitLines.should.equal(7)
        fakeplayer3.waitLines.should.equal(6)


        gameEvent(fakegame, cmd.END_GAME)
        fakegame.state.should.equal(cmd.GAME_OVER)

        fakeplayer.waitLines.should.equal(7)
        fakeplayer2.waitLines.should.equal(7)
        fakeplayer3.waitLines.should.equal(6)
        gameEvent(fakegame, cmd.ADD_LINE, 1)
        fakeplayer.waitLines.should.equal(7)
        fakeplayer2.waitLines.should.equal(7)
        fakeplayer3.waitLines.should.equal(6)
    });

    it('testnewpiece', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        gameEvent(fakegame, cmd.START_TIMER)
        gameEvent(fakegame, cmd.START_GAME)

        fakegame.state.should.equal(cmd.IN_GAME)
        testnewpiece(fakegame,'123')
        fakegame.state.should.equal(cmd.GAME_OVER)
    });
})