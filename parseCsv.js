/* eslint-disable no-magic-numbers */

const fs = require('fs');

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8');
};

const convertToObj = (keys, values) => {
  const obj = {};
  keys.forEach((key, index) => {
    obj[key] = +values[index] || values[index];
  });

  return obj;
};

const parseCsv = (csvFile, seperator) => {
  const dataStr = readFile(csvFile).split('\n');
  const header = dataStr[0].split(seperator);
  const data = dataStr.slice(1);

  return data.map((row) => {
    return convertToObj(header, row.split(seperator));
  });
};

exports.parseCsv = parseCsv;
exports.convertToObj = convertToObj;
