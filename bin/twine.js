const program = require('commander')
const pkg = require('../package.json')

program
    .version(pkg.version)
    .command('configure', 'Configure Twitter-related credentials')
    .parse(process.argv)