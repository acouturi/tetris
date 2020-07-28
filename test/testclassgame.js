import chai, { expect } from "chai"
import Player from '../src/server/classes/player'
import Piece from '../src/server/classes/piece'
import Game from '../src/server/classes/game'
import * as cmd from '../src/helpers/index'
import _ from 'lodash'

chai.should()

describe('creatgame', () => {
    it('new game', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
    });

    it('init game', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        fakegame.init()
        fakegame.state.should.equal(cmd.INIT_GAME)
        fakegame.gameOver()
        fakegame.state.should.equal(cmd.GAME_OVER)
        fakegame.restart()
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
    });

    it('getpiece game', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.init()
        fakegame.pieces.length.should.equal(10)
        fakegame.getPieces(5)
        fakegame.pieces.length.should.equal(15)
        fakegame.getPieces(4)
        fakegame.pieces.length.should.equal(15)
        fakegame.timespeed = 1000
        fakegame.timespeed.should.equal(1000)
        let index = 0
        for (let i = 1000; i > 100; i-= 10) {
            fakegame.getPieces(5 + index++)
            fakegame.timespeed.should.equal(i)
        }
        for (let i = 1000; i > 100; i-= 100) {
            fakegame.getPieces(5 + index++)
            fakegame.timespeed.should.equal(100)
        }
        index.should.equal(99)
    });

    it('over game', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        fakegame.init()
        fakegame.state.should.equal(cmd.INIT_GAME)
        fakegame.players['123'].state.should.equal(cmd.PLAYER_NEW)
        fakegame.killplayer('123').should.true
        fakegame.players['123'].state.should.equal(cmd.PLAYER_DEAD)
    });

    it('restart game', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true

        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        fakegame.players['123'].state.should.equal(cmd.PLAYER_NEW)
        fakegame.init()
        fakegame.state.should.equal(cmd.INIT_GAME)
        fakegame.killplayer('123').should.true
        fakegame.players['123'].state.should.equal(cmd.PLAYER_DEAD)
        fakegame.addbot()
        fakegame.restart()
        fakegame.state.should.equal(cmd.WAIT_PLAYERS)
        fakegame.players['123'].state.should.equal(cmd.PLAYER_NEW)
    });

    it('add and remove player', () => {
        let fakeplayer = new Player("toto", "123")
        let fakeplayer2 = new Player("tata", "321")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.addplayer("321",fakeplayer2)
        let tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["123","321"]))
        fakegame.removeplayer('123').should.equal(0)
        tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["321"]))

        fakegame.addplayer("123",fakeplayer)
        fakegame.init()
        fakegame.removeplayer('123').should.equal(0)
        fakegame.state.should.equal(cmd.GAME_OVER)
        fakegame.init()
        fakegame.removeplayer('321').should.equal(1)
    });

    it('add and remove bot', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')

        fakegame.addbot(0)
        let tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["123"]))

        fakegame.addbot(4)
        tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["123"]))

        fakegame.addbot(1)
        tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["123","bot"]))

        fakegame.removeplayer('bot').should.equal(0)
        tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["123"]))

        fakegame.addbot(2)
        tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["123","bot"]))

        fakegame.removeplayer('bot').should.equal(0)
        tmp = Object.keys(fakegame.players)
        JSON.stringify(tmp).should.equal(JSON.stringify(["123"]))

        fakegame.removeplayer('123').should.equal(1)
    });

    it('game data', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true

        let tmp = fakegame.data()
        tmp.state.should.equal(cmd.WAIT_PLAYERS)
        expect(tmp.testing).to.not.exist
        expect(tmp.playerAlive).to.not.exist

        tmp = fakegame.data()
        tmp.state.should.equal(cmd.WAIT_PLAYERS)
        expect(tmp.testing).to.not.exist
        expect(tmp.playerAlive).to.not.exist

        fakegame.init()
        tmp = fakegame.data()
        tmp.state.should.equal(cmd.INIT_GAME)
        expect(tmp.testing).to.not.exist
        fakegame.emit(cmd.START_PAUSE)
        expect(tmp.playerAlive).equal(2)
    });

    it('game info', () => {
        let fakeplayer = new Player("toto", "123")
        let fakegame = new Game("123", fakeplayer,null,'room')
        fakegame.testing = true

        let tmp = fakegame.info().game
        tmp.state.should.equal(cmd.WAIT_PLAYERS)
        expect(tmp.testing).to.not.exist
        expect(tmp.playerAlive).to.not.exist

        tmp = fakegame.info().game
        tmp.state.should.equal(cmd.WAIT_PLAYERS)
        expect(tmp.testing).to.not.exist
        expect(tmp.playerAlive).to.not.exist

        fakegame.init()
        tmp = fakegame.info().game
        tmp.state.should.equal(cmd.INIT_GAME)
        expect(tmp.testing).to.not.exist
        expect(tmp.playerAlive).equal(2)
    });
})