import distances from './distances';
import { isString, shuffle } from './common';

const randomCentroids = (vectors, k) => shuffle(vectors).slice(0, k);

const classify = (vector, centroids, distance) => {
    let min = distance(vector, centroids[0]);
    let index = 0;

    for(let i = 0; i < centroids.length; i++) {
        const dist = distance(vector, centroids[i]);
        if (dist < min) {
            min = dist;
            index = i;
        }
    }

    return index;
};

const kmeans = (vectors, options = {}) => {
    let {
        k = Math.max(2, Math.ceil(Math.sqrt(vectors.length / 2))),
        distance = 'euclidean'
    } = options;

    if (isString(distance)) {
        distance = distances[distance];
    }

    const centroids = randomCentroids(vectors, k);

};