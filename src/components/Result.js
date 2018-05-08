import React, { Component } from 'react';
import SmoothCollapse from 'react-smooth-collapse';

const borderStyle = { border: '2px solid #444', padding: 10 };
const levelHeaderStyle = { cursor: 'pointer', margin: 0 };
const levelExpandedHeaderStyle = { cursor: 'pointer', margin: '0 0 10px 0' };
const clusterHeaderStyle = { margin: 0 };


class Result extends Component {
  constructor(props) {
    super(props);

    this.state = {
      expanded: false
    };
  }

  toggle = () =>
    this.setState(({ expanded }) => ({ expanded: !expanded }));

  render() {
    const {
      toggle,
      props: {
        result,
        keyPrefix,
        level,
      },
      state: {
        expanded
      }
    } = this;

    return (
      <div key={result} style={borderStyle}>
        <h3
          style={expanded ? levelExpandedHeaderStyle : levelHeaderStyle}
          onClick={toggle}
        >
          Level #{level}
        </h3>
        <SmoothCollapse expanded={expanded}>
          {
            result.clusters.map((cluster, i) => (
              <div key={`${keyPrefix}-results-cluster-${cluster}`}>
                <h5 style={clusterHeaderStyle}>Cluster #{i + 1}</h5>
                <p style={{ fontSize: 10 }}>
                  {
                    cluster.map(el => `(${el.join(',')})`).join(', ')
                  }
                </p>
              </div>
            ))
          }
        </SmoothCollapse>
      </div>
    )
  }
}

export default Result;
