import React, { Component } from 'react';
import { arrayOf, shape, number} from 'prop-types';

import {
  XYPlot,
  FlexibleXYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from 'react-vis';

import kmeans, { format } from '../utilities/kmeans';
import { randomInt, flat, newId } from '../utilities/common';

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

    this.state = {
      data: [],
      centroidsData: [],
      min: 3,
      max: 200,
      width: 1024,
      height: 542
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() { this.update(); }

  update() {
    const {
      min, max
    } = this.state;

    const randomPoints = Array.from(Array(randomInt(min, max)).keys()).map(v => [randomInt(-1000, 1000), randomInt(-1000, 1000)]);

    const { clusters, centroids } = kmeans(randomPoints);

    const colors = clusters.length > mainColors.length ? allColors : mainColors;

    const serializedData = clusters.map((c, i) =>
        c.map(p => ({
          color: colors[i],
          x: p[0],
          y: p[1]
        })
      ));

    const data = flat(serializedData);
    const centroidsData = centroids.map((c, i) => ({x: c[0], y: c[1], size:8, color: colors[i]}));

    this.setState({ data, centroidsData });
  }

  handleMin = v => this.setState({ min: v > 0 ? v : 0 });

  handleMax = max => this.setState({ max: max > 0 ? max : 0 });

  render() {
    const {
      update,
      handleMin,
      handleMax,
      state: {
        data,
        centroidsData,
        min,
        max,
        width,
        height
      }
    } = this;

    return (
      <div className="plot-wrapper">
        <FlexibleXYPlot
          className="plot"
          height={height}
        >
         <XAxis style={axiesStyle} />
         <XAxis orientation="top" style={axiesStyle} />

         <YAxis style={axiesStyle} />
         <YAxis orientation="right" style={axiesStyle} />

         <VerticalGridLines style={gridsStyle} />
         <HorizontalGridLines style={gridsStyle} />

         <MarkSeries
          colorType="literal"
          data={data}
          animation="gentle"
          size={4}
         />

         <MarkSeries
          colorType="literal"
          data={centroidsData}
          animation="gentle"
         />
       </FlexibleXYPlot>
       <button
          className="btn btn-info"
          onClick={update}
        >
        Update data
       </button>
       <div className="number-inputs">
        <NumberInput value={min} label="min" onChange={handleMin} />
        <NumberInput value={max} label="max" onChange={handleMax} />
       </div>
     </div>
    );
  }
}

export default Kmeans;
