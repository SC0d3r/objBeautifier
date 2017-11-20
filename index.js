// const sampleObj = require('./sampleObj.json');
const {objectInfo} = require('./utils');
const returnBeautifiedObj = require('./beautifyObj');

function getBeautified(obj) {
  return objectInfo(obj)
    + 
  returnBeautifiedObj('', obj, 2, { isTopLevel: true });
}

// console.log(getBeautified(sampleObj));
module.exports = getBeautified;