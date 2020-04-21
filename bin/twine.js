const CredentialManager = require('../lib/credential-manager')

async function main () {
    const credentials = new CredentialManager('twine')
    let [ key, secret ] = await credentials.getKeyAndSecret()
    console.log(key, secret)    
}


main().catch(console.error)