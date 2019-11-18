#!/usr/bin/env node

var Rem2rpx = require("./lib/dfs-rem2rpx")
var program = require('commander');
var pkg = require('./package.json');
var chalk = require('chalk');
var path = require('path');
var fs = require('fs-extra');
var less = require("less")
var shell = require("shelljs")


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
function deleteFile(filePth){
    fs.unlinkSync(filePth,(err) => {
        if (err) {
          console.log('deleteFile-Erroe',err);
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
program.args.forEach(function (filePath) {
    let exc = path.extname(filePath);
    if (exc === '.css') {
        var cssText = fs.readFileSync(filePath, {
            encoding: 'utf8'
        });
        var outputPath = program.output || path.dirname(filePath);
        var fileName = path.basename(filePath);
        if (config.rpxVersion) {
            var newCssText = rem2rpxIns.generateRpx(cssText,exc);
            var newFileName = fileName.replace(/(.debug)?.css/, '.rpx.css');
            var newFilepath = path.join(outputPath, newFileName);
            saveFile(newFilepath, newCssText);
        }
    }else if(exc === '.less'){
        let newLessfilePath = filePath.replace(".less",".css")
        shell.exec("lessc "+ filePath+ " > "+ newLessfilePath,(err,stdout,stderr)=>{
            if(err){
                console.log(chalk.red.bold('[BUild Less File Error]: Plaese try again!') + err);
                return ;
            }
            var cssText = fs.readFileSync(newLessfilePath, {
                encoding: 'utf8'
            });
            var outputPath = program.output || path.dirname(newLessfilePath);
            var fileName = path.basename(newLessfilePath);
            // generate rem version stylesheet
            if (config.rpxVersion) {
                var newCssText = rem2rpxIns.generateRpx(cssText,exc);
                var newFileName = fileName.replace(/(.debug)?.css/, '.rpx.css');
                var newFilepath = path.join(outputPath, newFileName);
                saveFile(newFilepath, newCssText);
                deleteFile(newLessfilePath)
            }
        })
    }else if(exc === '.scss'){
        let newLessfilePath = filePath.replace(".scss",".css")
        shell.exec("node-sass "+ filePath + " " +newLessfilePath,(err,stdout,stderr)=>{
            if(err){
                console.log(chalk.red.bold('[BUild Less File Error]: Plaese try again!') + err);
                return ;
            }
            var cssText = fs.readFileSync(newLessfilePath, {
                encoding: 'utf8'
            });
            var outputPath = program.output || path.dirname(newLessfilePath);
            var fileName = path.basename(newLessfilePath);
            // generate rem version stylesheet
            if (config.rpxVersion) {
                var newCssText = rem2rpxIns.generateRpx(cssText,exc);
                var newFileName = fileName.replace(/(.debug)?.css/, '.rpx.css');
                var newFilepath = path.join(outputPath, newFileName);
                saveFile(newFilepath, newCssText);
                deleteFile(newLessfilePath)
            }
        })
    }else{
        console.log(chalk.red.bold('[NOT SUPPORT]: ') + ' This version is not support---'+ exc+ '---file,please change the version!');
        return ;
    }
});