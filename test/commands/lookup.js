const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const { ObjectReadableMock, ObjectWritableMock } = require('stream-mock')
const lookup = require('../../commands/lookup')
const CredentialManager = require('../../lib/credential-manager')
const Twitter = require('../../lib/twitter')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the lookup module', () => {
	var sandbox
	
  beforeEach(() => {
    sandbox = sinon.createSandbox()
	})
	
  context('users', () => {
    beforeEach(() => {
      sandbox.stub(CredentialManager.prototype, 'getKeyAndSecret')
        .resolves(['key', 'secret'])
      sandbox.stub(Twitter.prototype, 'get')
        .callsFake((url) => {
          let response = url.slice(url.indexOf('=') + 1)
            .split(',').map((n) => ({screen_name: n}))
          return Promise.resolve(response)
        })
		})
		
    it('should lookup users piped to stdin', (done) => {
      let stdin = new ObjectReadableMock(['foo\n', 'bar\n'], { objectMode: true })
      let stdout = new ObjectWritableMock()

      lookup.users('twine-test', null, {stdin, stdout})

      stdout.on('finish', () => {
        expect(stdout.data)
          .to.deep.equal(['[\n{"screen_name":"foo"}', '\n,\n{"screen_name":"bar"}', '\n]\n' ])
        done()
      })
		})
		
    it('should lookup more than 100 users piped to stdin', (done) => {
      let users = [...Array(101).keys()].map((n) => `foo${n}`)
      let stdin = new ObjectReadableMock(users.map((u) => `${u}\n`), {objectMode: true})
      let stdout = new ObjectWritableMock()
      lookup.users('twine-test', null, {stdin, stdout})
      stdout.on('finish', () => {
       
        /* expect(stdout.data)
          .to.deep.equal(users.map((u) => ({screen_name: u})))
          */
        done() 
      })
		})
	})
	
  afterEach(() => {
    sandbox.restore()
  })
})