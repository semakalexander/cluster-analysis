const sum = (...args) => args.reduce((p, n) => p + n);

const isString = val => typeof val === 'string';

const isExist = v => typeof v !== 'undefined';

const randomInt = (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = arr => arr.slice(0).sort(() => Math.ceil(Math.random() - 0.5));

const toJson = o => JSON.stringify(o, null, 2);

const flat = data => data.reduce((prev, cur) => {
  const needMore = [].concat(cur).some(Array.isArray);
  return prev.concat(needMore ? flat(cur) : cur);
},[])


let id = 0;
const newId = (prefix = '') => `${prefix}-${id++}`;

export {
    sum,
    isString,
    isExist,
    randomInt,
    shuffle,
    toJson,
    flat,
    newId
}
