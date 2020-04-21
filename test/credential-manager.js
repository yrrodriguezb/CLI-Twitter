const chai = require('chai')
const expect = chai.expect
const dirtyChai = require('dirty-chai')
const sinon = require('sinon')
const inquirer = require('inquirer')
const CredentialManager = require('../lib/credential-manager')

chai.use(dirtyChai)

describe('a credential manager', () => {
   var credentials = null;
   
   before(() => {
       credentials = new CredentialManager('twine-test')
   })

   context('with no existing credentials', () => {
       it('should prompt the user', async () => {
           sinon.stub(inquirer, 'prompt').resolves({ key: 'foo', secret: 'bar' })
           let [ key, secret ] = await credentials.getKeyAndSecret()

           expect(key).to.equal('foo')
           expect(secret).to.equal('bar')
           expect(inquirer.prompt.calledOnce).to.be.true()
           inquirer.prompt.restore()
       })
   })

   after(async () => {
       await credentials.clearKeyAndSecret()
   })
})