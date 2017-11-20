const clc = require('cli-color');
const roughSizeOfObject = require('./roughObjSize');

function objectInfo(obj) {
  const keys = Object.keys(obj);
  return (clc.red(' >> ') +
    'This object has ' + clc.cyan(keys.length + ' keys') +
    ' and size of ' + clc.cyan(roughSizeOfObject(obj) + ' bytes.') +
    clc.red(' << '));
}

const isNil = x => x == undefined;
const isStr = x => typeof x === 'string' && x !== 'null' && x !== 'undefined' && x !== 'NaN';

module.exports = {
  objectInfo,isStr,isNil
}