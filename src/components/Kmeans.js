import React, { Component } from 'react';
import { arrayOf, shape, number} from 'prop-types';

import {
  XYPlot,
  XAxis,
  YAxis,
  VerticalGridLines,
  HorizontalGridLines,
  MarkSeries
} from 'react-vis';

import kmeans, { format } from '../utilities/kmeans';
import { randomInt, flat, newId } from '../utilities/common';

import { mainColors, allColors } from '../helpers/colors';

class Kmeans extends Component {
  constructor(props) {
    super(props);

    this.state = {
      data: []
    };

    this.update = this.update.bind(this);
  }

  componentDidMount() { this.update(); }

  update() {
    const randomPoints = Array.from(Array(randomInt(3, 200)).keys()).map(v => [randomInt(-200, 200), randomInt(-100, 100)]);

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

  render() {
    const {
      update,
      state: {
        data
      }
    } = this;

    return (
      <div className="plot-wrapper">
        <XYPlot className="plot"
         width={1024}
         height={612}
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
          className="btn btn-success"
          onClick={update}
        >
        Update data
       </button>
     </div>
    );
  }
}

export default Kmeans;
