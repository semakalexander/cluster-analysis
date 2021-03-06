import distances from './distances';
import { isString } from './common';
import { toJson, randomCentroids } from './common';

const fillCentroids = (data, centroidsIndexes) =>
  centroidsIndexes.reduce((arr, index) => [...arr, data[index]], []);

const classify = (vector, centroids, distance) => {
  let min = distance(vector, centroids[0]);
  let index = 0;

  for (let i = 0; i < centroids.length; i++) {
    const dist = distance(vector, centroids[i]);
    if (dist < min) {
      min = dist;
      index = i;
    }
  }

  return index;
};

const kmeans = (vectors, options = {}, snapshotCb, snapshotPeriod) => {
  let {
    k = Math.max(2, Math.ceil(Math.sqrt(vectors.length / 2))),
    distance = 'euclidean',
    centroids,
    ids
  } = options;

  if (isString(distance)) {
    distance = distances[distance];
  }

  if (!centroids || !centroids.length) {
    centroids = randomCentroids(vectors, k);
  } else {
    centroids = fillCentroids(vectors, centroids);
  }

  if (!ids)
    console.log('номери початкових центроїдів:', centroids.map(c => vectors.indexOf(c) + 1).join(', '));
  else
    console.log('назви початкових центроїдів:', centroids.map(c => ids[vectors.indexOf(c)]).join(', '));

  console.log('початкові центроїди:', centroids.map(c => `[${c.join(',')}]`).join(', '));

  const assignment = new Array(vectors.length);
  const clusters = new Array(k);

  let iterations = 0;
  let movement = true;

  while (movement) {
    for (let i = 0; i < vectors.length; i++) {
      assignment[i] = classify(vectors[i], centroids, distance);
    }

    movement = false;

    for (let j = 0; j < k; j++) {
      const assigned = [];

      for (let i = 0; i < assignment.length; i++) {
        if (assignment[i] === j) {
          assigned.push(vectors[i])
        }
      }

      if (!assigned.length) {
        continue;
      }

      const centroid = centroids[j];
      const newCentroid = new Array(centroid.length);

      for (let g = 0; g < centroid.length; g++) {
        let sum = 0;

        for (let h = 0; h < assigned.length; h++) {
          sum += assigned[h][g];
        }

        newCentroid[g] = sum / assigned.length;

        if (newCentroid[g] !== centroid[g]) {
          movement = true;
        }
      }

      centroids[j] = newCentroid;
      clusters[j] = assigned;
    }

    if (snapshotCb && (iterations++ % snapshotPeriod === 0)) {
      snapshotCb(clusters);
    }
  }

  console.log('обчислені центроїди:', centroids.map(c => `[${c.join(',')}]`).join(', '));
  return { clusters, centroids, k };
};

const format = clusters => toJson(clusters.map(c => c.map(v => `(${v.join(', ')})`)));

export default kmeans;
export { format };
