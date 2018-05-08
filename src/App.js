import React, { Component } from 'react';
import Kmeans from './components/Kmeans';
import Hierarchical from './components/Hierarchical';
import DataUI from './components/DataUI';
import { generateData } from './utilities/common';

import './App.css';
import 'react-tabs/style/react-tabs.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

class App extends Component {
  state = {
    data: generateData(),
    options: {
      countOfClusters: 3
    }
  };

  setData = (data, options) => this.setState({ data, options });

  render() {
    const {
      setData,
      state: {
        data,
        options
      }
    } = this;

    return (
      <div className="App">
        <Tabs disabledTabClassName="disabled-tab">
          <TabList>
            <Tab>Data</Tab>
            <Tab>Visualization</Tab>
          </TabList>
          <TabPanel forceRender>
            <DataUI data={data} setData={setData} />
          </TabPanel>
          <TabPanel>
            <Tabs>
              <TabList>
                  <Tab disabled={!data.length}>Kmeans</Tab>
                  <Tab disabled={!data.length}>Hierarchical</Tab>
              </TabList>

              <TabPanel>
                <Kmeans data={data} options={options} />
              </TabPanel>
              <TabPanel>
                <Hierarchical data={data} />
              </TabPanel>
            </Tabs>
          </TabPanel>

        </Tabs>
      </div>
    );
  }
}

export default App;
