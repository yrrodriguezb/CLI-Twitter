const querystring = require('querystring')
const inquirer = require('inquirer')
const util = require('../lib/util')
const CredentialManager = require('../lib/credential-manager')
const Twitter = require('../lib/twitter')

const configure = {
	async consumer (name) {
		let credentials = new CredentialManager(name)
		let answers = await inquirer.prompt([
			{
				type: 'input',
				name: 'key',
				message: 'Enter your Twitter API key:',
				validate: util.notEmpty
			},
			{
				type: 'input',
				name: 'secret',
				message: 'Enter your Twitter API secret:',
				validate: util.notEmpty
			}
		])
		await credentials.storeKeyAndSecret('consumer', answers.key, answers.secret)
	},

	async account (name) {
		let credentials = new CredentialManager(name)

		var [ apiKey, apiSecret ] = await credentials.getKeyAndSecret('consumer')
	
		let twitter = new Twitter(apiKey, apiSecret)
		
		let response = querystring.parse(await twitter.post('oauth/request_token'))
		twitter.setToken(response['oauth_token'], response['oauth_token_secret'])

		await inquirer.prompt({
			type: 'input',
			message: 'Press enter to open Twitter in your default browser to authorize access',
			name: 'continue'
		})

		util.openBrowser(`${twitter.baseUrl}oauth/authorize?oauth_token=${response['oauth_token']}`)

		let answers = await inquirer.prompt({
			type: 'password',
			message: 'Enter the PIN provided by Twitter',
			name: 'pin',
			validate: util.notEmpty
		})

		let tokenResponse = querystring.parse(
			await twitter.post('oauth/access_token', `oauth_verifier=${answers['pin']}`)
		)

		twitter.setToken(tokenResponse['oauth_token'], tokenResponse['oauth_token_secret'])
	  
		let verifyResponse = await twitter.get('1.1/account/verify_credentials.json')

		await credentials.storeKeyAndSecret(
			'account',
			tokenResponse['oauth_token'],
			tokenResponse['oauth_token_secret']
		)
		
		console.log(`Account "${verifyResponse['screen_name']}" successfully added`)
	}
}

module.exports = configure