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

const generateRandomPoints = (min, max) =>
  Array.from(new Array(randomInt(min, max)).keys()).map(v => [
    randomInt(-1000, 1000),
    randomInt(-1000, 1000)
  ]);

class Main extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      centroidsData: [],
      clustersCount: 3,
      min: 9,
      max: 9,
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

  cUpdate = (shouldRandom = true) => {
    const {
      min,
      max,
      clustersCount,
      data: oldPoints
    } = this.state;

    const points = shouldRandom ?
      generateRandomPoints(min, max) :
      oldPoints.map(p => [p.x, p.y]);

    const { clusters, centroids } = kmeans(points, { k: clustersCount });

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

    const data = flat(serializedData);

    const centroidsData = centroids.map((c, i) => ({
      x: c[0],
      y: c[1],
      color: colors[i]
    }));

    this.setState({ data, centroidsData, isHShowing: false });
  };

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

  handleMin = v => this.setState({ min: v > 0 ? v : 0 });

  handleMax = v => this.setState({ max: v > 0 ? v : 0 });

  handleClustersCount = v =>
    this.setState(
      () => ({ clustersCount: v > 2 ? v : 2 }),
      () => this.cUpdate(false)
    );

  render() {
    const {
      hNextStep,
      cUpdate,
      hUpdate,
      handleMin,
      handleMax,
      handleClustersCount,
      state: {
        data,
        centroidsData,
        min,
        max,
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
          <button className="btn btn-info" onClick={cUpdate}>
            Update data
          </button>
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
              <NumberInput value={min} label="min" onChange={handleMin} />
              <NumberInput value={max} label="max" onChange={handleMax} />
              <NumberInput
                value={clustersCount}
                label="count of clusters"
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
