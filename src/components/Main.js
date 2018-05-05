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

import kmeans from '../utilities/kmeans';

import { randomInt, flat, shuffle } from '../utilities/common';

import { mainColors, allColors } from '../helpers/colors';

import NumberInput from './NumberInput';

const gridsStyle = {
  opacity: 0.3
};

const axiesStyle = {
  opacity: 0.7,
  fill: '#eee'
};


class Main extends Component {
  constructor(props) {
    super(props);

    const {
      data = [],
      centroids,
      clustersCount = 3
    } = props;

    this.state = {
      data,
      centroidsData: [],
      clustersCount,
      width: 1024,
      height: 542,
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
      },
      state: {
        clustersCount
      }
    } = this;

    data = updatedData || data;

    console.log(...data)

    const { clusters, centroids } = kmeans(data, { k: clustersCount });

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

    console.log('before', this.state)
    this.setState(() => ({
      data: newData,
      centroidsData,
      isHShowing: false
    }), () =>     console.log('after',this.state));
  };


  // todo separate hierarchical logic
  // todo added features to kmeans (centroids etc)
  hUpdate = () => {
    const {
      data: oldPoints,
    } = this.state;

    const points = oldPoints.map(({ x, y }) => [x, y]);

    const h = agglo(points);
    const colors = points.length > mainColors.length ? allColors : shuffle(mainColors);

    const hData = h.map(o => flat(o.clusters.map((c, i) => c.map(p => ({
      color: colors[i],
      x: p[0],
      y: p[1]
    })))));

    this.setState({
      hOriginalData: h.map(({ clusters }) => clusters),
      isHShowing: true,
      hIndex: 0,
      hData
    }, this.hNextStep)
  };

  hNextStep = () => {
    const {
      hIndex,
      hData,
    } = this.state;

    const isHShowing = hIndex + 1 < hData.length;

    this.setState({
      data: hData[hIndex],
      centroidsData: [],
      hIndex: isHShowing ? hIndex + 1 : 0,
      isHShowing
    });
  };

  handleClustersCount = v =>
    this.setState(
      () => ({ clustersCount: v < 1 ? 1 : v }),
      () => this.cUpdate()
    );

  render() {
    const {
      hNextStep,
      cUpdate,
      hUpdate,
      handleClustersCount,
      state: {
        data,
        centroidsData,
        height,
        clustersCount,
        isHShowing,
        hOriginalData,
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

          <MarkSeries colorType="literal" data={data} size={isHShowing ? 7 : 3} />

          <MarkSeries
            colorType="literal"
            data={centroidsData}
            animation="gentle"
            size={6}
          />
        </FlexibleXYPlot>
        <div className="btn-group">
          <button className="btn btn-info2" onClick={hUpdate}>
            Hierarchical
          </button>
          {
            isHShowing ? (
              <button className="btn btn-info2" onClick={hNextStep}>
                Next Step
              </button>
            ) : null
          }
        </div>
        {
          isHShowing ? (
            <p className="info-text">
              Count of clusters: {hOriginalData[hIndex].length + 1}
            </p>
          ) : null
        }
        {
          !isHShowing ? (
            <div className="number-inputs">
              <NumberInput
                value={clustersCount}
                label="count of clusters"
                min={1}
                onChange={handleClustersCount}
              />
            </div>
          ) : null
        }
        <span className="points-counter">
          {data.length} points
        </span>
      </div>
    );
  }
}

export default Main;
