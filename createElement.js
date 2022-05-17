const exp = require("constants");

const createLink = ({ relation, href }) => {
  return '<link rel=' + relation + ' ' + 'href="' + href + '">';
};

const createAttribute = (attributeName, values = []) => {
  return [attributeName, '="', values.join(' '), '"'].join('');
};

const createClass = (classes) => {
  return createAttribute('class', classes);
};

const img = (src, classes) => {
  const classAttr = createClass(classes);
  return ['<img', classAttr, 'src=images/' + src + '.jpg>'].join(' ');
};

const open = (tag, classes) => {
  const classAttr = !classes ? '' : createClass(classes);
  return ['<', tag, , ' ', classAttr, '>'].join('');
};

const close = (tag) => ['</', tag, '>'].join('');

const createElement = ({ element, content, classes }) => {
  const startTag = open(element, classes);
  const endTag = close(element);
  return startTag + content + endTag;
};

const createTag = (element, content, classes) => {
  return createElement({
    element, content, classes
  });
};

const main = () => {
  const html = {
    element: 'html',
    content: 'dileep',
    // classes: ['hi', 'hello']
  }
  console.log(createElement(html));
}

// main();
exports.createElement = createElement;
exports.createLink = createLink;
exports.img = img;
exports.createTag = createTag;
