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
        expect(tmp.playerAlive).equal(2)
    });
})