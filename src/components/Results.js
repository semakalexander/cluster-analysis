import React, { Component } from 'react';

import Result from './Result';

const containerStyle = { overflowY: 'scroll', height: 260 };

const Results = ({ results }) => {
  let keyPrefix = 'hierarchical';

  const isHierarchical = Array.isArray(results);

  if (!isHierarchical) {
    results = [results];
    keyPrefix = 'kmeans';
  }

  return (
    <div style={containerStyle}>
      {
        results.map((result, level) => (
          <Result
            key={result}
            result={result}
            keyPrefix={keyPrefix}
            level={level}
          />
        ))
      }
    </div>
  );
};

export default Results;
