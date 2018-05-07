import React, { Component } from 'react';
import Kmeans from './components/Kmeans';
import Hierarchical from './components/Hierarchical';
import Input from './components/Input';
import { generateData } from './utilities/common';

import './App.css';
import 'react-tabs/style/react-tabs.css';

import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';




class App extends Component {
  state = {
    data: generateData(),
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
        <Tabs disabledTabClassName="disabled-tab">
          <TabList>
            <Tab>Data</Tab>
            <Tab disabled={!data.length}>Kmeans</Tab>
            <Tab disabled={!data.length}>Hierarchical</Tab>
          </TabList>
          <TabPanel forceRender>
            <Input data={data} setData={setData} />
          </TabPanel>
          <TabPanel>
            <Kmeans data={data} />
          </TabPanel>
          <TabPanel>
            <Hierarchical data={data} />
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default App;
