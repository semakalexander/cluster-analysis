import { euclidean } from './distances';
import { newId, isExist } from './common';

class Cluster {
  constructor(values){
    this.values = values;
    this.clusterId = newId('cluster');
  }
}

const convertToObjects = items =>
    items.map(values => (new Cluster(values)));


const hierarchical = (items, metric = euclidean) => {
  const splitOnClusters = (clusters, newClusters = []) => {
    if(!clusters.length) return newClusters;

    let data = [...clusters];

    for (let i = 0; i < data.length; i++) {
      let min = Infinity;
      let minIndexes = [];

      for (let j = 0; j < data.length; j++) {
        if(i === j) continue;
        const distance = metric(data[i], data[j]);
        if (distance < min) {
          min = distance;
          minIndexes = [i, j];
        }
      }

      newClusters.push(minIndexes.map(index => data[index]));
      data = data.filter((el, i) => !~minIndexes.indexOf(i));

      return splitOnClusters(data, newClusters);
    }
  };

  const converted = convertToObjects(items);

  return splitOnClusters(converted);
}


export default hierarchical;
