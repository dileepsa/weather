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

const createTableData = (data) => {
  return createElement({
    element: 'td',
    content: data
  })
};

const createTableRow = (location) => {
  const values = [location.min, location.max];
  const valuesHtml = values.map(createTableData).join('');

  return createElement({
    element: 'tr',
    content: valuesHtml,
  })
};

const createTBody = (location) => {
  const row = createTableRow(location);
  const body = createElement({
    element: 'tbody',
    content: row
  });

  return body;
};

const createTableHeader = (header) => {
  return createElement({
    element: 'th',
    content: header
  })
};

const createTHead = (headers) => {
  const headersHtml = headers.map(createTableHeader).join('');

  const thead = createElement({
    element: 'thead',
    content: headersHtml,
  });

  return thead;
};

const createTable = (location) => {
  const headers = ['Min', 'Max'];
  const thead = createTHead(headers);
  const tbody = createTBody(location);

  const table = createElement({
    element: 'table',
    content: thead + tbody,
    classes: ['min-max']
  });

  return table;
};

const createDiv = (content, classes) => {
  return createElement({
    element: 'div',
    content: content,
    classes: classes
  })
};

const weatherHtml = (location) => {
  return createDiv(location.weather, ['weather']);
};

const temperatureHtml = (location) => {
  return createDiv(location.temperature + ' °C', ['temperature']);
};

const cityHtml = (location) => {
  return createDiv(location.city, ['city']);
};

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
  location = location.join('').split('|');

  return location;
};

const getLocationInfo = (weatherData, place) => {
  const headers = extractHeaders(weatherData);

  let location = extractLocation(weatherData, place);
  location = convertToObj(headers, location);
  location.temperature = calTemperature(location);
  location.weather = weather(location);
  location = format(location);

  return location;
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
