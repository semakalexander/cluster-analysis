const sum = (...args) => args.reduce((p, n) => p + n);

const isString = val => typeof val === 'string';

const randomInt = (min = 0, max = 1) => Math.floor(Math.random() * (max - min + 1)) + min;

const shuffle = arr => arr.slice(0).sort(() => Math.ceil(Math.random() - 0.5));

const toJson = o => JSON.stringify(o, null, 2);

export {
    sum,
    isString,
    randomInt,
    shuffle,
    toJson
}
