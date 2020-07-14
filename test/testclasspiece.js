import chai from "chai"
import Piece from '../src/server/classes/piece'

chai.should()

// let fakepiece = new Piece(3,0,0,3,88)

describe('creatpiece', () => {
    it('new random piece', () => {
        for (let i = 0; i < 20; i++) {
            let fakepiece = new Piece()
            fakepiece.positiony.should.equal(3)
        }
    });

    it('rotate piece', () => {
        let fakepiece = new Piece(3,0,0,3,88)
        for (let i = 1; i < 20; i++) {
            fakepiece.rotate()
            fakepiece.rotation.should.equal(i%4)
        }
    });

    it('dont ajuste coor x piece', () => {
        let fakepiece = new Piece(3,0,0,3,88)
        fakepiece.positionx.should.equal(0)
        fakepiece = new Piece(3,0,-1,3,88)
        fakepiece.positionx.should.equal(-1)
        fakepiece = new Piece(3,0,1,3,88)
        fakepiece.positionx.should.equal(1)
        fakepiece = new Piece(3,0,-10,3,88)
        fakepiece.positionx.should.equal(-10)
        fakepiece = new Piece(3,0,10,3,88)
        fakepiece.positionx.should.equal(10)
    });

    it('ajuste auto x piece', () => {
        let fakepiece = new Piece(0,0)
        fakepiece.positionx.should.equal(-1)
        fakepiece = new Piece(0,1)
        fakepiece.positionx.should.equal(0)
        fakepiece = new Piece(0,2)
        fakepiece.positionx.should.equal(-2)
        fakepiece = new Piece(0,3)
        fakepiece.positionx.should.equal(0)

        fakepiece = new Piece(1,0)
        fakepiece.positionx.should.equal(0)
        fakepiece = new Piece(1,1)
        fakepiece.positionx.should.equal(0)
        fakepiece = new Piece(1,2)
        fakepiece.positionx.should.equal(-1)
        fakepiece = new Piece(1,3)
        fakepiece.positionx.should.equal(0)
    });
})