import React, { Component } from 'react';
import { arrayOf, shape, number} from 'prop-types';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries,
} from 'react-vis';

import kmeans, { format } from '../utilities/kmeans';
import { randomInt, flat, newId } from '../utilities/common';

import { mainColors, allColors } from '../helpers/colors';

import NumberInput from './NumberInput';

class Kmeans extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: [],
      min: 3,
      max: 200,
      width: 1024,
      height: 512
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() { this.update(); }

  update() {
    const {
      min, max
    } = this.state;

    const randomPoints = Array.from(Array(randomInt(min, max)).keys()).map(v => [randomInt(-1000, 1000), randomInt(-1000, 1000)]);

    const clusters = kmeans(randomPoints);

    const colors = clusters.length > mainColors.length ? allColors : mainColors;

    const serializedData = clusters.map((c, i) =>
        c.map(p => ({
          color: colors[i],
          x: p[0],
          y: p[1]
        })
      ));

    const data = flat(serializedData);

    this.setState({ data });
  }

  handleMin = min =>
  this.setState({ min });
    // this.setState(({ max }) => ({ min: value >= max ? max : value }));

  handleMax = max =>
  this.setState({ max });
    // this.setState(({ min }) => ({ max: value <= min ? min : value }));

  render() {
    const {
      update,
      handleMin,
      handleMax,
      state: {
        data,
        min,
        max,
        width,
        height
      }
    } = this;

    return (
      <div className="plot-wrapper">
        <XYPlot className="plot"
         width={width}
         height={height}
        >
         <XAxis />
         <YAxis />

         <MarkSeries
          colorType="literal"
          data={data}
          animation="gentle"
          size={4}
         />
       </XYPlot>

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
