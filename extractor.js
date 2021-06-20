const fs = require('fs')
const PDFParser = require('pdf2json')
const readline = require('readline')
const chalk = require('chalk')

const cli = require('./utils/cli')

const saveData = (file, data) => {
    fs.writeFile(file, data, () => {
        console.log(chalk.green('Saved File:') + file)
    })
}

const parsePDF = (file) => {
    return new Promise((resolve, reject) => {
        const pdfParser = new PDFParser()
        pdfParser.on("pdfParser_dataError", errData => reject(errData.parserError))
        pdfParser.on("pdfParser_dataReady", pdfData => resolve(pdfData))
        pdfParser.loadPDF(file)
    })
}

const pdfToJSON = async (fileOutput=true, pdfDir='.', jsonDir='./json/', regex=undefined) => {
    try {
        var files = fs.readdirSync(pdfDir)
    } catch (e) {
        console.log(chalk.red(`The directory ${pdfDir} could not be read.`))
    }

    if (regex) {
        files = files.filter((file) => file.match(regex))
    }

    if(fileOutput && !fs.existsSync(jsonDir)) {
        fs.mkdirSync(jsonDir)
    }

    let jsonData = {}

    for (var i = 0; i < files.length; i++) {
        const fileData = await parsePDF(`${pdfDir}${files[i]}`)
        jsonData[files[i]] = fileData
        if (fileOutput) {
            saveData(`${jsonDir}${files[i]}.json`, JSON.stringify(fileData));
        }
        console.log(chalk.green('Generated JSON:') + `${files[i]}.json`)
    }
    return jsonData
}

const askQuestion = (question) => {
    const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout
    });
    return new Promise((resolve) => {
        rl.question(question, (lines) => {
            rl.close()
            resolve(lines)
        })
    })
}

const linesToRead = async (saveLines=true, jsonDir='./json', jsonData=false) => {
    if (!jsonDir && !jsonData) {
        return false
    }
    let lines = {}
    if (fs.existsSync('lines.json')) {
        lines = JSON.parse(fs.readFileSync('lines.json'))
        return lines
    }
    let files = []
    if (jsonDir) {
        try {
            files = fs.readdirSync(jsonDir)
        } catch (e) {
            console.log(chalk.red(`The directory ${jsonDir} could not be read.`))
        }
    } else {
        files = Object.keys(jsonData)
    }
    for (var i = 0; i < files.length; i++) {
        const page = await askQuestion(`Page number for ${files[i]}:`)
        const endLine = await askQuestion(`Ending line for ${files[i]}:`)
        lines[files[i]] = {page: parseInt(page) - 1, endLine}
    }
    if (saveLines) {
        saveData('lines.json', JSON.stringify(lines))
    }
    return lines
}

const extractLines =  async (pdfDir, extractFile, regex, saveJSON=false) => {
    const jsonDir = saveJSON ? './json/' : false
    const jsonData = await pdfToJSON(saveJSON, pdfDir, jsonDir, new RegExp(regex))
    const lines = await linesToRead(true, false, jsonData)
    const files = Object.keys(jsonData)
    let finale = {}
    for (var i = 0; i < files.length; i++) {
        const data = jsonData[files[i]]
        const texts = data.formImage.Pages[lines[files[i]].page].Texts
        const endLine = lines[files[i]].endLine
        let currentY = 0, line = 0
        finale[files[i]] = {}
        texts.some((text) => {
            if (text.y > currentY && ((text.y - currentY < 10))) {
                currentY = text.y
                line += 1
                if (line > endLine) {
                    return true
                } else {
                    finale[files[i]][line] = ''
                }
            }
            text.R.forEach((r) => {
                finale[files[i]][line] += `${r.T} `.replace(/%[0-9]./g, ' ')
            })
        })
        console.log(chalk.green('Extracted data:') + ' ' + files[i])
    }
    fs.writeFileSync(extractFile, JSON.stringify(finale))
    console.log(chalk.green(`Extracted data saved to ${extractFile}`))
}

if (process.argv[2] == 'parse') {
    extractLines(cli.input, cli.output, cli.regex, cli.save)
}

module.exports = {pdfToJSON, linesToRead, extractLines}