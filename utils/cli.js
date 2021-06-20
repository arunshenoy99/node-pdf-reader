const yargs = require('yargs')

yargs.command({
    command: 'parse',
    describe: 'Arguments for pdf parser',
    builder: {
        output: {
            describe: 'JSON file that stores the extracted lines.',
            demandOption: true,
            type: 'string'
        },
        save: {
            describe: 'Saves the converted pdf to json files.',
            type: 'boolean'
        },
        regex: {
            describe: 'Extracts pdf files with that match the regular expression.',
            type: 'string'
        },
        input: {
            describe: 'The directory containing the pdf files.',
            demandOption: true,
            type: 'string'
        }
    }
})

module.exports = yargs.argv