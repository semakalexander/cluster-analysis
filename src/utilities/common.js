const sum = (...args) => args.reduce((p, n) => p + n);

const isString = val => typeof val === 'string';

const isExist = v => typeof v !== 'undefined';

const randomInt = (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = arr => [...arr].sort(() =>.5 -Math.random());

const toJson = o => JSON.stringify(o, null, 2);

const flat = data => data.reduce((prev, cur) => {
  const needMore = [].concat(cur).some(Array.isArray);
  return prev.concat(needMore ? flat(cur) : cur);
}, []);


const serialize = data => data.map(el => ({ x: el[0], y: el[1] }));

const deserialize = data => data.map(({ x, y }) => ([x, y]));

const isSerialized = data => data.every(el => isExist(el.x));

let id = 0;
const newId = (prefix = '') => `${prefix}-${id++}`;

const generateData = (dim = 2, length = 50, min = -100, max = 100) => {
  const data = [];

  for (let i = 0; i < length; i++) {
    data.push([]);
    data[i].push(i);

    for (let j = 0; j < dim; j++) {
      data[i].push(randomInt(min, max));
    }
  }

  return data;
};

const generateZeroArray = dimension =>
  [...(new Array(dimension))].map(() => 0);

const parseCSV = (csv, separator = ',') => {
  try {
    const rows = csv
      .split('\n')
      .map(row =>
        row.split(separator).map(c => isNaN(+c) ? c : +c)
      );

    const headers = rows[0];

    return {
      headers,
      data: rows.slice(1)
    }
  }
  catch(err) {
    console.err('something get wrong in paring csv', err);
    return {
      headers: '',
      data: []
    }
  }
};

const unparse = (headers, data) =>
  `${headers.join(',')}\n${data.map(row => row.join(',')).join('\n')}`;

const download =(filename, csv) => {
  const pom = document.createElement('a');
  pom.setAttribute('href', 'data:text/csv;charset=utf-8,' + encodeURIComponent(csv));
  pom.setAttribute('download', filename);

  if (document.createEvent) {
    const event = document.createEvent('MouseEvents');
    event.initEvent('click', true, true);
    pom.dispatchEvent(event);
  }
  else {
    pom.click();
  }
};

const randomCentroids = (vectors, k) =>
  shuffle(vectors).slice(0, k);

export {
  sum,
  isString,
  isExist,
  randomInt,
  shuffle,
  toJson,
  flat,
  newId,
  serialize,
  deserialize,
  isSerialized,
  generateData,
  generateZeroArray,
  parseCSV,
  unparse,
  download,
  randomCentroids
}
