import chai, { expect } from "chai"
import Player from '../src/server/classes/player'
import Piece from '../src/server/classes/piece'
import * as help from '../src/server/helpers/index'

chai.should()

describe('creatplayer', () => {
    it('newplayer', () => {
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
        let fackpiece = new Piece()

        fakeplayer.state.should.equal(help.PLAYER_NEW)
        fakeplayer.init(fackpiece,fackpiece)
        fakeplayer.state.should.equal(help.PLAYER_ALIVE)
    });

    it('test fill init', () => {
        let fakeplayer = new Player("toto", "123")
        let fackpiece = new Piece()

        fakeplayer.state.should.equal(help.PLAYER_NEW)
        fakeplayer.init(fackpiece,fackpiece)
        fakeplayer.state.should.equal(help.PLAYER_ALIVE)
        fakeplayer.waitLines = 2
        fakeplayer.addbadline()
        fakeplayer.waitLines.should.equal(0)
    });
  
  });
  