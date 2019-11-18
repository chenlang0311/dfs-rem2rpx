'use strict';

var css = require('css');
var extend = require('extend');

var defaultConfig = {
    baseDpr: 2, // base device pixel ratio (default: 2) 基本设备像素比率
    rpxUnit: 100, // rem unit value (default: 100) rem单位转换为rpx单位的比例
    remPrecision: 6, // rem value precision (default: 6)  rem值得精度
    forcePxComment: 'rem', // force px comment (default: `rem`) 强制成rem单位的注释
    keepComment: 'no' // no transform value comment (default: `no`) 不需要转换值的注释
};

var remRegExp = /\b(\d+(\.\d+)?)rem\b/; //正则匹配到rem


function Rem2rpx(options) {
    this.config = {};
    extend(this.config, defaultConfig, options);
}
Rem2rpx.prototype.generateRpx = function (cssText,exc) {
    var self = this;
    var config = self.config;
    var astObj = css.parse(cssText);
    function processRules(rules) {
        for (let i = 0; i < rules.length; i++) {
            let rule = rules[i];
            if (rule.type === 'media') {
                console.log("media--------",rule)
                processRules(rule.rules);
                continue;
            } else if (rule.type === 'keyframes') {
                processRules(rule.keyframes, true); // recursive invocation while dealing with keyframes
                continue;
            } else if (rule.type !== 'rule' && rule.type !== 'keyframe') {
                continue;
            }

            let declarations = rule.declarations;
            for (let j = 0; j < declarations.length; j++) {
                let declaration = declarations[j];
                if (declaration.type === 'declaration' && remRegExp.test(declaration.value)) {
                    let nextDeclaration = declarations[j + 1];
                    if (nextDeclaration && nextDeclaration.type === 'comment') { 
                    if (nextDeclaration.comment.trim() === config.forcePxComment) { // force px
                        if (declaration.value === '0rem') {
                            declaration.value = '0';
                            declarations.splice(j + 1, 1); // delete corresponding comment
                            continue;
                        }
                        for (var dpr = 1; dpr <= 3; dpr++) {
                            var newDeclaration = {};
                            extend(true, newDeclaration, declaration);
                            newDeclaration.value = self._getCalcValue('rem', newDeclaration.value, dpr);
                            newRules[dpr - 1].declarations.push(newDeclaration);
                        }
                        declarations.splice(j, 2); // delete this rule and corresponding comment 删除相对应的注释
                        j--;
                    } else if (nextDeclaration.comment.trim() === config.keepComment) { // no transform
                        declarations.splice(j + 1, 1); // delete corresponding comment
                    } else {
                        declaration.value = self._getCalcValue('rpx', declaration.value); // common transform
                    }
                } else {
                    declaration.value = self._getCalcValue('rpx', declaration.value); // common transform
                }
            }
        }

            if (!rules[i].declarations.length) {
                rules.splice(i, 1);
                i--;
            }
        }
    }
    processRules(astObj.stylesheet.rules);
    return css.stringify(astObj);
}


Rem2rpx.prototype._getCalcValue = function (type, value, dpr) {
    var config = this.config;
    var pxGlobalRegExp = new RegExp(remRegExp.source, 'g');
    var varlueArr = value.split(" ");
    var tempArr =[];
    for(let s of  varlueArr){
        if (s.indexOf(".") == 0) {
            tempArr.push("0" + s)

        }else{
            tempArr.push(s)
        }
    }
    value = tempArr.join(" ")
    function getValue(val) {
        val = parseFloat(val.toFixed(config.remPrecision)); // control decimal precision of the calculated value
        return val == 0 ? val : val + type;
    }
    return value.replace(pxGlobalRegExp, function ($0, $1) {
        return getValue($1 * config.rpxUnit);
    });
};


module.exports = Rem2rpx;