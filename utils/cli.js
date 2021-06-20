const yargs = require('yargs')

yargs.command({
    command: 'parse',
    describe: 'Arguments for pdf parser',
    builder: {
        input: {
            describe: 'The directory containing the pdf files.',
            demandOption: true,
            type: 'string'
        },
        output: {
            describe: 'JSON file that stores the extracted data line wise for each pdf file.',
            demandOption: true,
            type: 'string'
        },
        regex: {
            describe: 'Read only the pdf files that match the regular expression.',
            type: 'string'
        },
        save: {
            describe: 'Save intermediate detailed json data in the folder ./json. Only use if you are doing manual parsing later',
            type: 'boolean'
        }
    }
})

module.exports = yargs.argv