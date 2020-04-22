const fs = require('fs-extra')
const path = require('path')
const sinon = require('sinon')
const keytar = require('keytar')
const _ = require('lodash')
const chai = require('chai')
const expect = chai.expect
const chaiAsPromised = require('chai-as-promised')
const dirtyChai = require('dirty-chai')

const CredentialManager = require('../../lib/credential-manager')

chai.use(chaiAsPromised)
chai.use(dirtyChai)

describe('the credential manager', () => {
	var secrets = {}
	var credentials = null;
	
	before(() => {
		sinon.stub(keytar, 'setPassword').callsFake((service, key, secret) => {
			_.set(secrets, `${service}.${key}`, secret)
			return Promise.resolve()
		})

		sinon.stub(keytar, 'getPassword').callsFake((service, key) => {
			let value = _.get(secrets, `${service}.${key}`)
			return value ? Promise.resolve(value) : Promise.reject(new Error(`Missing consumer secret`))
		})

		sinon.stub(keytar, 'deletePassword').callsFake((service, key) => {
			_.unset(secrets, `${service}.${key}`)
			return Promise.resolve()
		})

		credentials = new CredentialManager('twine-test')
	})

	it('should return credentials set in the environment', async () => {
		process.env['TWINE-TEST_CONSUMER_KEY'] = 'one'
		process.env['TWINE-TEST_CONSUMER_SECRET'] = 'two'
		let [ key, secret ] = await credentials.getKeyAndSecret('consumer')
		expect(key).to.equal('one')
		expect(secret).to.equal('two')
	})

	it('should prefer credentials set in the environment', async () => {
		await credentials.storeKeyAndSecret('consumer', 'foo', 'bar')
		let [ key, secret ] = await credentials.getKeyAndSecret('consumer')
		expect(key).to.equal('one')
		expect(secret).to.equal('two')
		delete process.env['TWINE-TEST_CONSUMER_KEY']
		delete process.env['TWINE-TEST_CONSUMER_SECRET']
	})

	it('should return credentials when they are found', async () => {
		await credentials.storeKeyAndSecret('consumer', 'foo', 'bar')
		let [ key, secret ] = await credentials.getKeyAndSecret('consumer')
		expect(key).to.equal('foo')
		expect(secret).to.equal('bar')
	})

	it('should reject when no key are found', async () => {
		await credentials.clearKeyAndSecret('consumer')
		expect(credentials.getKeyAndSecret('consumer')).to.be.rejectedWith('Missing consumer key')
	})

	it('should reject when no secret is found', async () => {
		credentials.conf.set('keys.consumer', 'foo')
		await expect(credentials.getKeyAndSecret('consumer')).to.be.rejectedWith('Missing consumer secret')
		credentials.conf.delete('keys.consumer')
	})

	it('should remove all credentials', async () => {
		await credentials.storeKeyAndSecret('consumer', 'one', 'two')
		await credentials.storeKeyAndSecret('account', 'three', 'four')
		await credentials.clearAll()
		await expect(credentials.getKeyAndSecret('consumer')).to.be.rejected()
		await expect(credentials.getKeyAndSecret('account')).to.be.rejected()
	})

	after(async () => {
		await credentials.clearAll()
		keytar.setPassword.restore()
		keytar.getPassword.restore()
		keytar.deletePassword.restore()
		await fs.unlink(path.join(process.env.HOME, '.config', 'configstore', 'twine-test.json'))
	})
})