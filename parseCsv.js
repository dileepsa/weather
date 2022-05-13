const fs = require('fs');

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf8');
};

const toNumber = (value) => {
  return +value;
};

const format = function (obj) {
  const city = obj.city
  obj.city = city[0].toUpperCase() + city.substring(1);
  obj.date = obj.date.split('-').map(toNumber);
  return obj;
};

const convertToJSON = (keys, values, formatter) => {
  let obj = {};
  keys.forEach((key, index) => { obj[key] = +values[index] || values[index] });
  obj = formatter ? formatter(obj) : obj;

  return obj;
};

const parseCsv = (csvFile, seperator) => {
  const dataStr = readFile(csvFile).split('\n');
  const header = dataStr[0].split(seperator);
  const data = dataStr.slice(1);

  return data.map((row) => {
    return convertToJSON(header, row.split(seperator), format);
  })
};

const main = () => {
  console.log(parseCsv('./weather.csv', '|'));
};

// main();

exports.parseCsv = parseCsv;
