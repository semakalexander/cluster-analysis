import { sum } from './common';

const euclidean = (v1, v2) =>
    Math.sqrt(v1.reduce((total, el, i) => total + Math.pow(v1[i] - v2[i], 2), 0));

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
