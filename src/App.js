import React, { Component } from 'react';
import './App.css';
import Main from './components/Main';
import Sandbox from './components/Sandbox';
import { randomInt } from './utilities/common';

const testData = () => {
  const data = [];

  const dim = randomInt(0, 10);
  const length = randomInt(0, 100);

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
        <Main data={data} />
      </div>
    );
  }
}

export default App;
