import { sum } from './common';

const euclideanObjects = (o1, o2) =>
    Math.sqrt(o1.values.reduce((total, el, i) => total + Math.pow(o1.values[i] - o2.values[i], 2), 0));

const euclideanArrays = (a1, a2) =>
    Math.sqrt(a1.reduce((total, el, i) => total + Math.pow(a1[i] - a2[i], 2), 0));

const euclidean = (v1, v2) =>
    Array.isArray(v1) ?
      euclideanArrays(v1, v2) :
      euclideanObjects(v1, v2);

const euclideanSquare = (v1, v2) =>
    v1.reduce((total, el, i) => total + Math.pow(v1[i] - v2[i], 2), 0);

const manhattan = (v1, v2) =>
    sum(...v1.map((el, i) => Math.abs(el - v2[i])));

export {
    euclidean,
    manhattan,
    euclideanSquare,
};

export default {
    euclidean,
    manhattan,
    euclideanSquare,
};
