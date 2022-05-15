const { createElement } = require('../createElement.js');

const createDiv = (content, classes) => {
  return createElement({
    element: 'div',
    content: content,
    classes: classes
  })
};

const createTableData = (data) => {
  return createElement({
    element: 'td',
    content: data
  })
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

const createTableRow = (values) => {
  const valuesHtml = values.map(createTableData).join('');

  return createElement({
    element: 'tr',
    content: valuesHtml,
  })
};

const createTBody = (values) => {
  const row = createTableRow(values);
  const tbody = createElement({
    element: 'tbody',
    content: row
  });

  return tbody;
};

const createTag = (tag, content, classes) => {
  return createElement({
    element: tag,
    content: content,
    classes: classes
  });
};

exports.createDiv = createDiv;
exports.createTBody = createTBody;
exports.createTHead = createTHead;
exports.createTag = createTag;