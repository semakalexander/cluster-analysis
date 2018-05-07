import React, { Component } from 'react';
import agglo from 'agglo';

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from 'react-vis';


import {
  flat,
  shuffle,
  serialize,
  deserialize,
  isSerialized
} from '../utilities/common';

import { mainColors, allColors } from '../helpers/colors';

const gridsStyle = {
  opacity: 0.3
};

const axiesStyle = {
  opacity: 0.7,
  fill: '#eee'
};

const getColors = length =>
  length > mainColors.length ?
    allColors :
    shuffle(mainColors);

class Hierarchical extends Component {
  constructor(props) {
    super(props);

    const {
      data = [],
    } = props;

    this.state = {
      data: serialize(data),
      width: 1024,
      height: 542,
      levels: [[]],
      hIndex: 0,
      isExistNextStep: false
    };
  }

  componentWillReceiveProps({ data }) {
    this.hUpdate(data);
  }

  hUpdate = (updatedData) => {
    const {
      data: oldPoints,
    } = this.state;

    const points = updatedData || (isSerialized(oldPoints) ? deserialize(oldPoints) : oldPoints);

    const h = agglo(points);

    const colors = getColors(points.length);

    const hData = h.map(o => flat(o.clusters.map((c, i) => c.map(p => ({
      color: colors[i],
      x: p[0],
      y: p[1]
    })))));

    this.setState({
      levels: h.map(({ clusters }) => clusters),
      hIndex: 0,
      hData
    }, this.hNextStep)
  };

  hNextStep = () => {
    const {
      hIndex,
      hData,
    } = this.state;

    const isExistNextStep = hIndex + 1 < hData.length;

    this.setState({
      data: hData[hIndex],
      hIndex: isExistNextStep ? hIndex + 1 : 0,
      isExistNextStep
    });
  };

  render() {
    const {
      hNextStep,
      state: {
        data,
        height,
        isExistNextStep,
        levels,
        hIndex
      }
    } = this;

    return (
      <div className="plot-wrapper">
        <FlexibleXYPlot className="plot" height={height}>
          <XAxis style={axiesStyle} />
          <XAxis orientation="top" style={axiesStyle} />

          <YAxis style={axiesStyle} />
          <YAxis orientation="right" style={axiesStyle} />

          <VerticalGridLines style={gridsStyle} />
          <HorizontalGridLines style={gridsStyle} />

          <MarkSeries colorType="literal" data={data} size={5} />
        </FlexibleXYPlot>
        <div className="btn-group">
          {
            isExistNextStep ? (
              <button className="btn btn-info2" onClick={hNextStep}>
                Next Step
              </button>
            ) : (
              <button className="btn btn-info2" onClick={() => this.hUpdate()}>
                Start
              </button>
            )
          }
        </div>
        <span className="points-counter">
          {data.length} points
          <br />
          Count of clusters: { isExistNextStep ? levels[hIndex].length + 1 : 1 }
        </span>
      </div>
    );
  }
}

export default Hierarchical;
