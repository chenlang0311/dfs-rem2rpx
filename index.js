#!/usr/bin/env node

var Rem2rpx = require("./lib/dfs-rem2rpx")
var program = require('commander');
var pkg = require('./package.json');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs-extra');
var shell = require("shelljs")
const log = message => console.log(chalk.green(`${message}`))
const successLog = message => console.log(chalk.blue(`${message}`))
const errorLog = error => console.log(chalk.red(`${error}`))


// string to variables of proper type（thanks to zepto）
function deserializeValue(value) {
    var num;
    try {
        return value ?
            value == "true" || value == true ||
            (value == "false" || value == false ? false :
                value == "null" ? null :
                !/^0/.test(value) && !isNaN(num = Number(value)) ? num :
                /^[\[\{]/.test(value) ? JSON.parse(value) :
                value) :
            value;
    } catch (e) {
        return value;
    }
}

function saveFile(filePath, content) {
    fs.createFileSync(filePath);
    fs.writeFileSync(filePath, content, {
        encoding: 'utf8'
    });
    log('[Success]: ' + filePath);
}

function deleteFile(filePth) {
    fs.unlinkSync(filePth, (err) => {
        if (err) {
            errorLog('deleteFile-Erroe', err);
        }
    });
}

program.version(pkg.version)
    .option('-u, --rpxUnit [value]', 'set `rpx` unit value (default: 100)', 100)
    .option('-x, --threeVersion [value]', 'whether to generate @1x, @2x and @3x version stylesheet (default: false)', false) //for the feature
    .option('-r, --rpxVersion [value]', 'whether to generate rpx version stylesheet (default: true)', true)
    .option('-b, --baseDpr [value]', 'set base device pixel ratio (default: 2)', 2) //for the feature
    .option('-p, --rpxPrecision [value]', 'set rpxvalue precision (default: 6)', 6)
    .option('-o, --output [path]', 'the output file dirname')
    .parse(process.argv);

if (!program.args.length) {
    console.log(chalk.yellow.bold('[Info]: ') + 'No files to process!');
    return false;
}

var config = {
    rpxUnit: deserializeValue(program.rpxUnit),
    threeVersion: deserializeValue(program.threeVersion),
    rpxVersion: deserializeValue(program.rpxVersion),
    baseDpr: deserializeValue(program.baseDpr),
    rpxPrecision: deserializeValue(program.rpxPrecision)
};
var rem2rpxIns = new Rem2rpx(config);


function handleFile(filePath, exc, needDeleted) {
    var cssText = fs.readFileSync(filePath, {
        encoding: 'utf8'
    });
    var outputPath = program.output || path.dirname(filePath);
    var fileName = path.basename(filePath);
    if (config.rpxVersion) {
        var newCssText = rem2rpxIns.generateRpx(cssText, exc);
        var newFileName = fileName.replace(/(.debug)?.css/, '.rpx.css');
        var newFilepath = path.join(outputPath, newFileName);
        saveFile(newFilepath, newCssText);
        if (needDeleted) deleteFile(filePath);
    }
}
async function installCommand(commander, fileType) {
    log(`The ${commander} must install ${fileType}, do you want to install ${fileType}(Y/N)Y`);
    process.stdin.on('data', async chunk => {
        const inputName = String(chunk).trim().toString().toLocaleLowerCase();
        if (inputName.indexOf("y") == 0 || inputName == "") {
            log(`Installing ${fileType=='less'?fileType:commander} please waiting...`)
            shell.exec(`npm install -g ${fileType=='less'?fileType:commander}`, (err) => {
                if (err) errorLog(`Install ${fileType} fail,you can run [npm install -g ${fileType}]`)
                successLog(`[Install ${fileType} Success]: Plaese try again!`);
                process.stdin.emit('end')
            })
        } else {
            errorLog(`The ${commander} must install ${fileType},you can run [npm install -g ${fileType}]`)
            process.stdin.emit('end')
        }
    })
    process.stdin.on('end', () => {
        log('exit')
        process.exit()
    })
}
program.args.forEach(function (filePath) {
    let exc = path.extname(filePath);
    if (exc === '.css') {
        handleFile(filePath, exc)
    } else if (exc === '.less') {
        let newLessfilePath = filePath.replace(".less", ".css")
        if (!shell.which('lessc')) {
            installCommand("lessc", "less")
        } else {
            shell.exec("lessc " + filePath + " > " + newLessfilePath, (err, stdout, stderr) => {
                if (err) {
                    errorLog('[Run lessc fial]:' + err);
                    return;
                }
                handleFile(newLessfilePath, exc, true)
            })
        }

    } else if (exc === '.scss') {
        let newScssfilePath = filePath.replace(".scss", ".css")
        if (!shell.which('node-sass')) {
            installCommand("node-sass", "scss")
        } else {
            shell.exec("node-sass " + filePath + " " + newScssfilePath, (err, stdout, stderr) => {
                if (err) {
                    errorLog('[Run node-sass fial]:' + err);
                    return;
                }
                handleFile(newScssfilePath, exc, true)
            })
        }

    } else {
        errorLog('[NOT SUPPORT]: '+' This version is not support---' + exc + '---file,please change the version!');
        return;
    }
});