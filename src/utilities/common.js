const sum = (...args) => args.reduce((p, n) => p + n);

const isString = val => typeof val === 'string';

const isExist = v => typeof v !== 'undefined';

const randomInt = (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = arr => arr.slice(0).sort(() => Math.ceil(Math.random() - 0.5));

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

const generateData = (dim = 2, length = 50) => {
  const data = [];

  for (let i = 0; i < length; i++) {
    data.push([]);
    for (let j = 0; j < dim; j++) {
      data[i].push(randomInt(-100, 100));
    }
  }

  return data;
};

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
  generateData
}
