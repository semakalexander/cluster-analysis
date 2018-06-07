import React from 'react';

import Result from './Result';

const containerStyle = { overflowY: 'scroll', height: 512 };

const Results = ({ results }) => {
  const isHierarchical = results.source;

  let keyPrefix = isHierarchical ? 'hierarchical' : 'kmeans';

  if (!Array.isArray(results)) {
    results = [results];
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
