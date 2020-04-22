const fs = require('fs')
const path = require('path')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')

const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the credential manager', () => {
	var credentials = null;
	
	before(() => {
		credentials = new CredentialManager('twine-test')
	})

	it('should return credentials set in the environment', async () => {
		await credentials.storeKeyAndSecret('apiKey', 'foo', 'bar')
		let [ key, secret ] = await credentials.getKeyAndSecret('apiKey')
		expect(key).to.equal('foo')
		expect(secret).to.equal('bar')
	})

	it('should reject when no key are found', async () => {
    await credentials.clearKeyAndSecret('apiKey')
    expect(credentials.getKeyAndSecret('apiKey')).to.be.rejected()
  })

	after((done) => {
		fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'), done)
	})
})