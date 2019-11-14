#!/usr/bin/env node

var Rem2rpx = require("./lib/dfs-rem2rpx")
var program = require('commander');
var pkg = require('./package.json');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs-extra');



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
    console.log(chalk.green.bold('[Success]: ') + filePath);
}


program.version(pkg.version)
    .option('-u, --remUnit [value]', 'set `rem` unit value (default: 75)', 100)
    .option('-x, --threeVersion [value]', 'whether to generate @1x, @2x and @3x version stylesheet (default: false)', false)
    .option('-r, --remVersion [value]', 'whether to generate rem version stylesheet (default: true)', true)
    .option('-b, --baseDpr [value]', 'set base device pixel ratio (default: 2)', 2)
    .option('-p, --remPrecision [value]', 'set rem value precision (default: 6)', 6)
    .option('-o, --output [path]', 'the output file dirname')
    .parse(process.argv);

if (!program.args.length) {
    console.log(chalk.yellow.bold('[Info]: ') + 'No files to process!');
    return false;
}

var config = {
    remUnit: deserializeValue(program.remUnit),
    threeVersion: deserializeValue(program.threeVersion),
    remVersion: deserializeValue(program.remVersion),
    baseDpr: deserializeValue(program.baseDpr),
    remPrecision: deserializeValue(program.remPrecision)
};
var rem2rpxIns = new Rem2rpx(config);

program.args.forEach(function (filePath) {
    let exc = path.extname(filePath);
    if (exc === '.css') {
        var cssText = fs.readFileSync(filePath, {
            encoding: 'utf8'
        });
        var outputPath = program.output || path.dirname(filePath);
        var fileName = path.basename(filePath);
        // generate rem version stylesheet
        if (config.remVersion) {
            var newCssText = rem2rpxIns.generateRpx(cssText,exc);
            // console.log('newCssText-----------',newCssText)
            var newFileName = fileName.replace(/(.debug)?.css/, '.rpx.css');
       
            var newFilepath = path.join(outputPath, newFileName);
            saveFile(newFilepath, newCssText);
        }
    }else{
        console.log(chalk.red.bold('[NOT SUPPORT]: ') + ' This version is not support---'+ exc+ '---file,please change the version!');
        return ;
    }
});