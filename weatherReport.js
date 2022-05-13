const { convertToObj } = require('./parseCsv.js');
const fs = require('fs');
const { createElement, img } = require('../createElement.js');

const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1);
};

const format = (obj) => {
  obj.city = capitalize(obj.city);
  obj.weather = capitalize(obj.weather);
  return obj;
};

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf-8');
};

const writeFile = (fileName, content) => {
  return fs.writeFileSync(fileName, content, 'utf-8');
};

const weather = (location) => {
  return location.temperature < 20 ? 'cloudy' : 'sunny';
};

const extractHeaders = (data) => {
  return data.split('\n')[0].split('|');
};

const extractLocation = (weatherData, place) => {
  const regEx = eval('/.*' + place + '.*/g');
  let location = weatherData.match(regEx);
  location = location.join('').split('|');

  return location;
};

const getLocationInfo = (fileName, place) => {
  const weatherData = readFile(fileName);
  const headers = extractHeaders(weatherData);
  let location = extractLocation(weatherData, place);
  location = convertToObj(headers, location);

  location.weather = weather(location);
  location = format(location);

  return location;
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

const weatherHtml = (location) => {
  return createElement({
    element: 'div',
    content: location.weather,
    classes: ['weather']
  });
};

const generateHtml = (location) => {
  const image = img(location.weather, ['weather-image']);
  const city = cityHtml(location);
  const temperature = temperatureHtml(location);
  const weather = weatherHtml(location);

  const weatherInfo = createElement({
    element: 'div',
    content: city + temperature + weather,
    classes: ['weather-info']
  });

  return image + weatherInfo;
};

const main = (dataFile, template) => {
  const location = process.argv[2];
  const cityObj = getLocationInfo(dataFile, location);
  const weatherHtml = generateHtml(cityObj);
  let html = readFile(template);

  html = html.replace(/__CONTENT__/, weatherHtml);
  writeFile('index.html', html);
};

main('./data/weather.csv', './data/template.html');
