import React from 'react';

import Result from './Result';

const containerStyle = { overflowY: 'scroll', height: 512 };

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
            key={isHierarchical ? result.source.index : 'kmeans-result'}
            result={result}
            keyPrefix={keyPrefix}
            level={level}
            isHierarchical={isHierarchical}
          />
        ))
      }
    </div>
  );
};

export default Results;
