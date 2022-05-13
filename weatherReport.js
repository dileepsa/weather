/* eslint-disable no-eval */
/* eslint-disable no-magic-numbers */

const { convertToObj } = require('./parseCsv.js');
const fs = require('fs');
const { createElement, img } = require('../createElement.js');

const format = (obj) => {
  const city = obj.city;
  obj.city = city[0].toUpperCase() + city.substring(1);
  return obj;
};

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf-8');
};

const writeFile = (fileName, content) => {
  return fs.writeFileSync(fileName, content, 'utf-8');
};

const getLocationInfo = (fileName, location) => {
  const weatherData = readFile(fileName);
  const header = weatherData.split('\n')[0].split('|');
  const regEx = eval('/.*' + location + '.*/g');

  let locationInfo = weatherData.match(regEx);
  locationInfo = locationInfo.join('').split('|');
  locationInfo = convertToObj(header, locationInfo);
  locationInfo = format(locationInfo);

  return locationInfo;
};

const cityHtml = (location) => {
  return createElement({
    element: 'h3',
    content: location.city,
    classes: ['city'],
  });
};

const temperatureHtml = (location) => {
  return createElement({
    element: 'div',
    content: location.temperature + ' C',
    classes: ['temperature']
  });
};

const generateHtml = (location) => {
  const weather = location.temperature < 20 ? 'rainy' : 'sunny';
  const image = img(weather, 'This is weather image');
  const city = cityHtml(location);
  const temperature = temperatureHtml(location);
  const weatherHtml = createElement({
    element: 'div',
    content: city + temperature,
    classes: ['weather-info']
  });

  return image + weatherHtml;
};

const main = (dataFile, template) => {
  const location = process.argv[2];
  const cityObj = getLocationInfo(dataFile, location);
  let html = readFile(template);
  const weatherHtml = generateHtml(cityObj);

  html = html.replace(/__CONTENT__/, weatherHtml);
  writeFile('index.html', html);
};

main('./data/weather.csv', './data/template.html');
