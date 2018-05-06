import React, { Component } from 'react';
import './App.css';
import Kmeans from './components/Kmeans';
import Hierarchical from './components/Hierarchical';
import Sandbox from './components/Sandbox';
import { randomInt } from './utilities/common';

const testData = () => {
  const data = [];

  const dim = randomInt(0, 10);
  const length = randomInt(0, 10);

  for (let i = 0; i < length; i++) {
    data.push([]);
    for (let j = 0; j < dim; j++) {
      data[i].push(randomInt(-50, 50));
    }
  }

  return data;
};


class App extends Component {
  state = {
    data: [],
  };

  setData = data => this.setState({ data });

  render() {
    const {
      setData,
      state: {
        data
      }
    } = this;

    return (
      <div className="App">
        <Sandbox setData={setData} />
        <div className="plot-container">
          {
            data.length ? (
              <Kmeans data={data} />
            ) : null
          }
          {
            data.length ? (
              <Hierarchical data={data} />
            ) : null
          }
        </div>

      </div>
    );
  }
}

export default App;
