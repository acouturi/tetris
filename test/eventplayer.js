import chai, { expect } from "chai"
import {playerEvent} from '../src/server/playerEvent'
import Player from '../src/server/classes/player'
import Piece from '../src/server/classes/piece'
import Game from '../src/server/classes/game'
import * as cmd from '../src/helpers/index'
import _ from 'lodash'

chai.should()

describe('all event for player', () => {
    it('cmd.RIGHT', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(5), () => new Piece(3,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positiony.should.equal(3)
        playerEvent({command:cmd.RIGHT}, fakegame, '123')
        fakeplayer.currentPiece.positiony.should.equal(4)
        fakeplayer.state = cmd.PLAYER_NEW
        playerEvent({command:cmd.RIGHT}, fakegame, '123')
        fakeplayer.currentPiece.positiony.should.equal(4)
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positiony.should.equal(3)
        fakegame.gameOver()
        playerEvent({command:cmd.RIGHT}, fakegame, '123')
        fakeplayer.currentPiece.positiony.should.equal(3)
    });

    it('cmd.LEFT', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(5), () => new Piece(3,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positiony.should.equal(3)
        playerEvent({command:cmd.LEFT}, fakegame, '123')
        fakeplayer.currentPiece.positiony.should.equal(2)
        fakeplayer.state = cmd.PLAYER_NEW
        playerEvent({command:cmd.LEFT}, fakegame, '123')
        fakeplayer.currentPiece.positiony.should.equal(2)
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positiony.should.equal(3)
        fakegame.gameOver()
        playerEvent({command:cmd.LEFT}, fakegame, '123')
        fakeplayer.currentPiece.positiony.should.equal(3)
    });

    it('cmd.ROTATE', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(5), () => new Piece(0,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.rotation.should.equal(0)
        playerEvent({command:cmd.ROTATE}, fakegame, '123')
        fakeplayer.currentPiece.rotation.should.equal(1)
        fakeplayer.state = cmd.PLAYER_NEW
        playerEvent({command:cmd.ROTATE}, fakegame, '123')
        fakeplayer.currentPiece.rotation.should.equal(1)
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.rotation.should.equal(0)
        fakegame.gameOver()
        playerEvent({command:cmd.ROTATE}, fakegame, '123')
        fakeplayer.currentPiece.rotation.should.equal(0)
    });

    it('cmd.ROTATE in other piece', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(5), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.rotation.should.equal(1)
        playerEvent({command:cmd.RIGHT}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.rotation.should.equal(1)
        fakeplayer.currentPiece.positionx = 16
        playerEvent({command:cmd.ROTATE}, fakegame, '123')
        fakeplayer.currentPiece.rotation.should.equal(1)
    });

    it('cmd.ROTATE in ground', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(5), () => new Piece(0,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.rotation.should.equal(0)
        fakeplayer.currentPiece.positionx = 18
        playerEvent({command:cmd.ROTATE}, fakegame, '123')

        fakeplayer.currentPiece.rotation.should.equal(0)
        fakeplayer.screen[19][5].should.equal(88)
        fakeplayer.screen[16][5].should.equal(88)
    });

    it('cmd.FALL', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(5), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.screen[19][5].should.equal(-1)
        fakeplayer.screen[16][5].should.equal(-1)
        fakeplayer.screen[15][5].should.equal(-1)
        fakeplayer.screen[12][5].should.equal(-1)
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.screen[19][5].should.equal(88)
        fakeplayer.screen[16][5].should.equal(88)
        fakeplayer.screen[15][5].should.equal(-1)
        fakeplayer.screen[12][5].should.equal(-1)
        fakeplayer.state = cmd.PLAYER_NEW
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.screen[19][5].should.equal(88)
        fakeplayer.screen[16][5].should.equal(88)
        fakeplayer.screen[15][5].should.equal(-1)
        fakeplayer.screen[12][5].should.equal(-1)
        fakeplayer.state = cmd.PLAYER_ALIVE
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.screen[19][5].should.equal(88)
        fakeplayer.screen[16][5].should.equal(88)
        fakeplayer.screen[15][5].should.equal(88)
        fakeplayer.screen[12][5].should.equal(88)

        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.screen[19][5].should.equal(-1)
        fakeplayer.screen[16][5].should.equal(-1)
        fakeplayer.screen[15][5].should.equal(-1)
        fakeplayer.screen[12][5].should.equal(-1)
        fakegame.gameOver()
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.screen[19][5].should.equal(-1)
        fakeplayer.screen[16][5].should.equal(-1)
        fakeplayer.screen[15][5].should.equal(-1)
        fakeplayer.screen[12][5].should.equal(-1)
    });

    it('cmd.FALL remove line', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("tata", "321")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(15), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer.currentPiece.positiony = -2
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = -1
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 0
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 1
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 2
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 3
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 4
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 5
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 6
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 7
        fakeplayer.currentPiece.positionx = 0
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.waitLines.should.equal(0)
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.waitLines.should.equal(3)
    });

    it('cmd.FALL kill player', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("tata", "321")
        let fakeplayer3 = new Player("tutu", "111")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.addplayer('111', fakeplayer3)
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(15), () => new Piece(0,1,0,3,88))
        fakeplayer.state.should.equal(cmd.PLAYER_NEW)
        fakeplayer2.state.should.equal(cmd.PLAYER_NEW)
        fakeplayer3.state.should.equal(cmd.PLAYER_NEW)
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer3.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.state.should.equal(cmd.PLAYER_ALIVE)
        fakeplayer2.state.should.equal(cmd.PLAYER_ALIVE)
        fakeplayer3.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.state.should.equal(cmd.PLAYER_DEAD)
        fakeplayer2.state.should.equal(cmd.PLAYER_ALIVE)
        fakeplayer3.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        fakeplayer2.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.FALL}, fakegame, '321')
        fakeplayer.state.should.equal(cmd.PLAYER_DEAD)
        fakeplayer2.state.should.equal(cmd.PLAYER_DEAD)
        fakeplayer3.state.should.equal(cmd.PLAYER_ALIVE)
        fakegame.state.should.equal(cmd.GAME_OVER)
    });

    it('cmd.DOWN', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(5), () => new Piece(3,0,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positionx.should.equal(0)
        playerEvent({command:cmd.DOWN}, fakegame, '123')
        fakeplayer.currentPiece.positionx.should.equal(1)
        fakeplayer.state = cmd.PLAYER_NEW
        playerEvent({command:cmd.DOWN}, fakegame, '123')
        fakeplayer.currentPiece.positionx.should.equal(1)
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakegame.gameOver()
        playerEvent({command:cmd.DOWN}, fakegame, '123')
        fakeplayer.currentPiece.positionx.should.equal(0)
    });

    it('cmd.DOWN remove line', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("tata", "321")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(15), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer.currentPiece.positiony = -2
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = -1
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 0
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 1
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 2
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 3
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 4
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 5
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 6
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.currentPiece.positiony = 7
        fakeplayer.currentPiece.positionx = 15
        fakeplayer.currentPiece.positionx.should.equal(15)
        playerEvent({command:cmd.DOWN}, fakegame, '123')
        fakeplayer.currentPiece.positionx.should.equal(16)
        fakeplayer2.waitLines.should.equal(0)
        playerEvent({command:cmd.DOWN}, fakegame, '123')
        fakeplayer.currentPiece.positionx.should.equal(0)
        fakeplayer2.waitLines.should.equal(3)
    });

    it('cmd.DOWN kill player', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("tata", "321")
        let fakeplayer3 = new Player("tutu", "111")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.addplayer('111', fakeplayer3)
        fakegame.init()
        fakegame.state = cmd.IN_GAME
        fakegame.pieces = _.map(new Array(15), () => new Piece(0,1,0,3,88))
        fakeplayer.state.should.equal(cmd.PLAYER_NEW)
        fakeplayer2.state.should.equal(cmd.PLAYER_NEW)
        fakeplayer3.state.should.equal(cmd.PLAYER_NEW)
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer3.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer.state.should.equal(cmd.PLAYER_ALIVE)
        fakeplayer2.state.should.equal(cmd.PLAYER_ALIVE)
        fakeplayer3.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.DOWN}, fakegame, '123')
        fakeplayer.state.should.equal(cmd.PLAYER_DEAD)
        fakeplayer2.state.should.equal(cmd.PLAYER_ALIVE)
        fakeplayer3.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        playerEvent({command:cmd.FALL}, fakegame, '321')
        fakeplayer2.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.DOWN}, fakegame, '321')
        fakeplayer.state.should.equal(cmd.PLAYER_DEAD)
        fakeplayer2.state.should.equal(cmd.PLAYER_DEAD)
        fakeplayer3.state.should.equal(cmd.PLAYER_ALIVE)
        fakegame.state.should.equal(cmd.GAME_OVER)
    });

    it('cmd.PAUSE', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("tata", "321")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.addplayer('321', fakeplayer2)
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        playerEvent({command:cmd.PAUSE}, fakegame, '123')
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        playerEvent({command:cmd.PAUSE}, fakegame, '321')
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)

        fakegame.init()
        fakegame.pieces = _.map(new Array(15), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.state.should.equal(cmd.INIT_GAME)
        playerEvent({command:cmd.PAUSE}, fakegame, '123')
        fakegame.state.should.equal(cmd.INIT_GAME)
        playerEvent({command:cmd.PAUSE}, fakegame, '321')
        fakegame.state.should.equal(cmd.INIT_GAME)

        fakegame.state = cmd.IN_GAME
        fakegame.state.should.equal(cmd.IN_GAME)
        playerEvent({command:cmd.PAUSE}, fakegame, '123')
        fakegame.state.should.equal(cmd.IN_PAUSE)
        playerEvent({command:cmd.PAUSE}, fakegame, '321')
        fakegame.state.should.equal(cmd.IN_PAUSE)
        playerEvent({command:cmd.PAUSE}, fakegame, '123')
        fakegame.state.should.equal(cmd.IN_GAME)
        playerEvent({command:cmd.PAUSE}, fakegame, '321')
        fakegame.state.should.equal(cmd.IN_GAME)

        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        fakeplayer.state.should.equal(cmd.PLAYER_ALIVE)
        playerEvent({command:cmd.DOWN}, fakegame, '123')
        fakeplayer.state.should.equal(cmd.PLAYER_DEAD)
        fakegame.state.should.equal(cmd.GAME_OVER)
        playerEvent({command:cmd.PAUSE}, fakegame, '123')
        fakegame.state.should.equal(cmd.GAME_OVER)
        playerEvent({command:cmd.PAUSE}, fakegame, '321')
        fakegame.state.should.equal(cmd.GAME_OVER)
    });

    it('cmd.START', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("tata", "321")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.addplayer('321', fakeplayer2)
        fakegame.testing = true
        fakegame.internalClockEvent = null

        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        playerEvent({command:cmd.START}, fakegame, '321')
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        playerEvent({command:cmd.START}, fakegame, '123')
        clearInterval(fakegame.internalClockEvent)
        fakegame.state.should.equal(cmd.INIT_GAME)
        fakegame.state = cmd.IN_PAUSE
        fakegame.state.should.equal(cmd.IN_PAUSE)

        fakegame.state.should.equal(cmd.IN_PAUSE)
        playerEvent({command:cmd.START}, fakegame, '321')
        fakegame.state.should.equal(cmd.IN_PAUSE)
        playerEvent({command:cmd.START}, fakegame, '123')
        fakegame.state.should.equal(cmd.IN_PAUSE)

        fakegame.init()
        fakegame.pieces = _.map(new Array(15), () => new Piece(0,1,0,3,88))
        fakeplayer.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakeplayer2.init(fakegame.pieces[0],fakegame.pieces[1]);
        fakegame.state.should.equal(cmd.INIT_GAME)
        fakegame.state = cmd.IN_GAME
        fakegame.state.should.equal(cmd.IN_GAME)
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')
        playerEvent({command:cmd.FALL}, fakegame, '123')

        fakegame.state.should.equal(cmd.GAME_OVER)
        playerEvent({command:cmd.START}, fakegame, '321')
        fakegame.state.should.equal(cmd.GAME_OVER)
        playerEvent({command:cmd.START}, fakegame, '123')
        fakegame.state.should.equal(cmd.INIT_GAME)
        clearInterval(fakegame.internalClockEvent)
    });

    it('cmd invalide', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        //cmd.IN_GAME
        let tmp = JSON.stringify(fakegame)
        playerEvent({command:"invalide"}, fakegame, '123')
        tmp.should.equal(JSON.stringify(fakegame))
    });
})
/*
fakeplayer.refreshScreen()


console.log(JSON.stringify(fakeplayer.screen).replace(/\],\[/g, "]\n["))
console.log('\n')
console.log(JSON.stringify(fakeplayer.screen).replace(/\],\[/g, "]\n["))
//*/