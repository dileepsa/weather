const { convertToObj } = require('./parseCsv.js');
const fs = require('fs');
const { createDiv, createTBody, createTHead, createTag } = require('./htmlUtil.js');
const { createElement, img } = require('./createElement.js');

const capitalize = (word) => {
  return word[0].toUpperCase() + word.substring(1);
};

const format = (obj) => {
  obj.city = capitalize(obj.city);
  obj.weather = capitalize(obj.weather);
  return obj;
};

const readFile = (fileName) => {
  try {
    return fs.readFileSync(fileName, 'utf-8');
  } catch (error) {
    console.log(error.message);
  }
};

const writeFile = (fileName, content) => {
  try {
    return fs.writeFileSync(fileName, content, 'utf-8')
  } catch (error) {
    console.log(error.message);
  }
};

const createTable = (location) => {
  const headers = ['Min', 'Max'];
  const values = [location.min, location.max];

  const thead = createTHead(headers);
  const tbody = createTBody(values);

  return createTag('table', thead + tbody, ['min-max']);
};

const weatherHtml = (location) => createDiv(location.weather, ['weather']);

const temperatureHtml = (location) => {
  return createDiv(location.temperature + ' °C', ['temperature']);
};

const cityHtml = (location) => createDiv(location.city, ['city']);

const generateHtml = (location) => {
  const image = img(location.weather, ['weather-image']);
  const city = cityHtml(location);
  const temperature = temperatureHtml(location);
  const weather = weatherHtml(location);
  const minMax = createTable(location);

  const content = city + temperature + weather + minMax;
  const weatherInfo = createDiv(content, ['weather-info']);

  return image + weatherInfo;
};

const weather = (location) => location.temperature < 20 ? 'cloudy' : 'sunny';

const randomNumber = (start, end) => {
  const diff = end - start;
  return Math.floor(Math.random() * diff) + start;
};

const calTemperature = (location) => {
  return randomNumber(location.min, location.max);
};

const extractHeaders = (data) => data.split('\n')[0].split('|');

const extractLocation = (weatherData, place) => {
  const regEx = eval('/.*' + place + '.*/g');
  let location = weatherData.match(regEx);

  if (location === null) {
    console.log('Place not found !!!');
    process.exit(1);
  };

  location = location.join('').split('|');
  return location;
};

const getLocationInfo = (weatherData, place) => {
  const headers = extractHeaders(weatherData);

  const locationRecord = extractLocation(weatherData, place);
  const location = convertToObj(headers, locationRecord);
  location.temperature = calTemperature(location);
  location.weather = weather(location);

  return format(location);
};

const main = (dataFile, template) => {
  const place = process.argv[2];
  const weatherData = readFile(dataFile);
  const location = getLocationInfo(weatherData, place);
  const weatherHtml = generateHtml(location);

  let html = readFile(template);
  html = html.replace(/__CONTENT__/, weatherHtml);
  writeFile('index.html', html);
};

main('./data/weather.csv', './data/template.html');
