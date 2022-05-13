const { parseCsv } = require('./parseCsv.js');
const fs = require('fs');
const { createElement, img } = require('../createElement.js');

const readFile = (fileName) => {
  return fs.readFileSync(fileName, 'utf-8');
};

const writeFile = (fileName, content) => {
  return fs.writeFileSync(fileName, content, 'utf-8');
};

const getLocationInfo = (fileName, location) => {
  const weatherData = readFile(fileName);
  const header = weatherData.split('\n')[0] + '\n';
  const regEx = eval('/.*' + location + '.*/g');
  const locationInfo = weatherData.match(regEx);
  // console.log(locationInfo);
  return [header, locationInfo.join('')];
};

// getLocationInfo('./data/weather.csv', 'bangalore');

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
  })
};

const generateHtml = (location) => {
  const weather = location.temperature < 20 ? 'rainy' : 'sunny';
  const image = img(weather);
  const city = cityHtml(location);
  const temperature = temperatureHtml(location);
  const weatherHtml = createElement({
    element: 'div',
    content: city + temperature,
    classes: ['weather-info']
  })

  return image + weatherHtml;
}

const main = (dataFile, template) => {
  const location = process.argv[2];
  const [header, locationInfo] = getLocationInfo(dataFile, location);
  template = readFile(template);
  fs.writeFileSync('data/selectedCity.csv', header + locationInfo, 'utf-8');
  const cityObj = parseCsv('./data/selectedCity.csv', '|');
  const weatherHtml = generateHtml(cityObj[0]);

  const html = template.replace(/__CONTENT__/, weatherHtml);
  writeFile('index.html', html);
};

main('./data/weather.csv', './data/template.html');
