import chai, { expect } from "chai"
import {playerEvent} from '../src/server/playerEvent'
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
})