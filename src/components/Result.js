import React from 'react';

const borderStyle = { border: '2px solid #444', padding: 10, marginBottom: 6 };
const clusterHeaderStyle = { margin: 0 };

const Result = ({ result, keyPrefix }) => (
  <div style={borderStyle}>
    {
      result.clusters.map((cluster, i) => (
        <div key={`${keyPrefix}-results-cluster-${cluster}`}>
          <h5 style={clusterHeaderStyle}>Cluster #{i + 1}</h5>
          <p style={{ fontSize: 10 }}>
            {
              cluster.map(el => Array.isArray(el) ? `(${el.join(',')})` : el).join(', ')
            }
          </p>
        </div>
      ))
    }
  </div>
);

export default Result;
