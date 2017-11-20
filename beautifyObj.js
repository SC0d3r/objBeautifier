const clc = require('cli-color');
const pad = require('pad');
const {isNil,isStr} = require('./utils');

const arrayType = arr => 'Array<' + typeof arr[0] + '> ';
const strRepr = x => `${clc.cyanBright('"')}${x}${clc.cyanBright('"')}`;

function returnBeautifiedObj(keyOfObject, obj, keyPadding = 3, { isTopLevel } = {}) {
  const isNumber = x => !isNaN(+x) && typeof (+x) === 'number';
  const keys = Object.keys(obj);
  const values = keys.map(k => obj[k]);
  const addBrace = brace => clc.yellow(brace);
  let resultString = '';
  const isTopLevelYet = (keyPadding === 4 || keyPadding === 2);
  if (keyOfObject){
    resultString = clc.cyan(
      pad(keyPadding / 2 + keyOfObject.toString().length + (isTopLevelYet ? 0 : 1 + Math.abs(3 - keyPadding / 2)), keyOfObject)
    );
  }


  resultString += '\n' + addBrace(isTopLevel ? '{' : pad(1 + keyPadding / 2 + Math.abs(2 - keyPadding / 2), '{'));
  for (let i = 0; i < keys.length; i++) {
    let currentKey = keys[i];
    if (isNumber(currentKey)) currentKey = `[${currentKey}]`;
    let currentValue = values[i];
    if (isNil(currentValue)) currentValue += '';
    if (!Array.isArray(currentValue) && typeof currentValue === 'object') {
      resultString += '\n' + returnBeautifiedObj(currentKey, currentValue, (keyPadding || 1) + 2);
      continue;
    }
    const keyToPrint = decorateKey(isTopLevel, currentKey, keyPadding);
    const valueToPrint = decorateValue(isTopLevel, currentValue);
    resultString += '\n' + keyToPrint + ' : ' + valueToPrint;
  }
  resultString += '\n' + addBrace(isTopLevel ? '}' :  pad(1 + keyPadding / 2 + Math.abs(2 - keyPadding / 2), '}'));

  return resultString;
}

function decorateValue(isTopLevel, currentValue) {
  let valueToPrint = '';
  if (isTopLevel) {
    if (Array.isArray(currentValue) && typeof currentValue[0] === 'object') {
      valueToPrint = returnBeautifiedObj(arrayType(currentValue), currentValue);
    } else {
      valueToPrint = ifStrAddQuotes(currentValue, valueToPrint);
    }
  } else {
    valueToPrint = ifStrAddQuotes(currentValue, valueToPrint);
  }
  return valueToPrint;
}

function ifStrAddQuotes(currentValue, valueToPrint) {
  if (Array.isArray(currentValue)) {
    const arrType = arrayType(currentValue);
    const isArrOfString = arrType.indexOf('string') >= 0;
    if (isArrOfString) {
      currentValue = currentValue.map(v => strRepr(v)).join(',');
    }
    valueToPrint = clc.green(arrType + clc.greenBright(currentValue));
  }
  else {
    currentValue = isStr(currentValue) ? strRepr(currentValue) : currentValue;
    valueToPrint = clc.green(currentValue);
  }
  return valueToPrint;
}

function decorateKey(isTopLevel, currentKey, keyPadding) {
  let keyToPrint = '';
  if (isTopLevel) {
    keyToPrint = clc.bold.white(pad(currentKey.length + keyPadding, currentKey));
  }
  else {
    keyToPrint = clc.magenta(pad(currentKey.length + keyPadding, currentKey));
  }
  return keyToPrint;
}


module.exports = returnBeautifiedObj;