const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .command('configure', 'Configure Twitter-related credentials')
    .command('lookup', 'lookup things on Twitter')
    .parse(process.argv)