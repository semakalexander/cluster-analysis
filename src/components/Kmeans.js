import React, { Component } from 'react';

import {
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from 'react-vis';

import kmeans from '../utilities/kmeans';

import {
  flat,
  shuffle,
  serialize,
} from '../utilities/common';

import { mainColors, allColors } from '../helpers/colors';

import NumberInput from './NumberInput';

const gridsStyle = {
  opacity: 0.3
};

const axiesStyle = {
  opacity: 0.7,
  fill: '#eee'
};


class Kmeans extends Component {
  constructor(props) {
    super(props);

    const {
      data = [],
      options: {
        countOfClusters,
      },
    } = props;

    this.state = {
      data: serialize(data),
      centroidsData: [],
      countOfClusters,
      width: 1024,
      height: 500,
      hOriginalData: [],
      hData: [],
      hIndex: 0,
      isHShowing: false
    };
  }

  componentDidMount() {
    this.cUpdate();
  }

  componentWillReceiveProps(nextProps) {
    this.cUpdate(nextProps.data);
  }

  cUpdate = (updatedData) => {
    let {
      props: {
        data,
        options:{
          centroids: startCentroids
        }
      },
      state: {
        countOfClusters
      }
    } = this;

    data = updatedData || data;

    const options = {
      k: countOfClusters,
      centroids: startCentroids
    };

    const { clusters, centroids } = kmeans(data, options);

    const colors =
      clusters.length > mainColors.length ?
        allColors :
        shuffle(mainColors);

    const serializedData = clusters.map((c, i) =>
      c.map(p => ({
        color: colors[i],
        x: p[0],
        y: p[1]
      }))
    );

    const newData = flat(serializedData);

    const centroidsData = centroids.map((c, i) => ({
      x: c[0],
      y: c[1],
      color: colors[i]
    }));

    this.setState(() => ({
      data: newData,
      centroidsData,
      isHShowing: false
    }));
  };


  handleCountOfClusters = v =>
    this.setState(
      () => ({ countOfClusters: v < 1 ? 1 : v }),
      () => this.cUpdate()
    );

  render() {
    const {
      handleCountOfClusters,
      state: {
        data,
        centroidsData,
        height,
        countOfClusters,
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

          <MarkSeries colorType="literal" data={data} size={4} />

          <MarkSeries
            colorType="literal"
            data={centroidsData}
            animation="gentle"
            size={9}
          />
        </FlexibleXYPlot>
        <div className="number-inputs">
          <NumberInput
            value={countOfClusters}
            label="count of clusters"
            min={1}
            onChange={handleCountOfClusters}
          />
        </div>
        <span className="points-counter">
          {data.length} points
        </span>
      </div>
    );
  }
}

export default Kmeans;
