import chai from "chai"
import * as help from '../src/server/helpers/index'

chai.should()

describe('gene random', () => {
    it('token', () => {
        let token = help.generatetoken()
        let tmp = typeof token
        tmp.should.equal('string')
    });
    it('rand int', () => {
        let value = help.getRandomInt(1)
        let tmp = typeof value
        tmp.should.equal('number')
        value.should.equal(0)
    });
})