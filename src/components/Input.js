import React, { Component, Fragment } from 'react';
import ReactDataGrid from 'react-data-grid';
import NumericInput from 'react-numeric-input';
import CsvParse from '@vtex/react-csv-parse';
import agglo from 'agglo';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';


import kmeans from '../utilities/kmeans';

import { generateData } from '../utilities/common';

import { mainColors } from '../helpers/colors';



const generateZeroArray = dimension =>
  [...(new Array(dimension))].map(() => 0);

// todo think about csv structure and add csv loader

class Input extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      columns: this.generateColumns(2),
      dimension: 2,
      countOfRows: data.length || 5,
      countOfClusters: 2,
      kmeansResults: [],
      hierarchicalResults: [],
      data
    };

  }

  loadData = (files) => {
    console.log(files)
  };

  _generateData = () => {
    this.setState(
      ({ dimension, countOfRows }) =>
        ({ data: generateData(dimension, countOfRows) })
    );
  };

  rowGetter = (i) => {
    return this.state.data[i];
  };

  updateRows = ({ fromRow, toRow, updated }) => {
    let data = [...this.state.data];
    for (let i = fromRow; i <= toRow; i++) {
      Object.keys(updated).forEach(key => {
        const value = +updated[key];
        data[i][key] = isNaN(value) ? 0 : value;
      });
    }

    this.setState({ data });
  };

  onDimensionChange = (value) => {
    const {
      state: {
        dimension,
        data: oldData
      }
    } = this;

    const data = +value > dimension ?
      oldData.map(row => [...row, ...generateZeroArray(+value - dimension)]) :
      oldData.map(row => row.slice(0, +value));

    this.setState({
      dimension: +value,
      columns: this.generateColumns(+value),
      data
    });
  };

  generateColumns = (dimension = this.state.dimension) =>
    [...new Array(dimension)].map((el, i) => ({
      key: i,
      name: i,
      editable: true
    }));

  onCountOfRowsChange = value => {
    const {
      countOfRows,
      dimension,
      data: oldData
    } = this.state;

    if (+value === countOfRows) return;

    let data = [...oldData];

    if (value > countOfRows) {
      for (let i = 0; i < value - countOfRows; i++) {
        data.push(generateZeroArray(dimension));
      }
    } else {
      data = data.slice(0, value);
    }

    this.setState({ countOfRows: +value, data });

  };

  setData = () => {
    const {
      props: {
        setData,
      },
      state: {
        data,
        countOfClusters
      }
    } = this;


    setData(data);

    this.setState({
      kmeansResults: kmeans(data, { k: countOfClusters }),
      hierarchicalResults: agglo(data)
    });
  };

  onCountOfClustersChange = (value) => {
    this.setState({ countOfClusters: value })
  };

  render() {
    const {
      rowGetter,
      updateRows,
      onDimensionChange,
      onCountOfRowsChange,
      onCountOfClustersChange,
      setData,
      loadData,
      _generateData,
      state: {
        data,
        columns,
        dimension,
        countOfRows,
        countOfClusters,
        hierarchicalResults,
        kmeansResults
      }
    } = this;

    return (
      <div>
        <div className="number-inputs">
          <label className="numeric-input">
            dimension
            <NumericInput
              label="dimension"
              value={dimension}
              min={1}
              max={1000}
              onChange={onDimensionChange}
            />
          </label>
          <label className="numeric-input">
            count of objects
            <NumericInput
              label="count of objects"
              value={countOfRows}
              min={2}
              max={1000000}
              onChange={onCountOfRowsChange}
            />
          </label>
          <label className="numeric-input">
            count of clusters
            <NumericInput
              label="count of clusters"
              value={countOfClusters}
              min={2}
              max={data.length || 2}
              onChange={onCountOfClustersChange}
            />
          </label>
          <button
            className="btn btn-info2"
            style={{ marginLeft: 10 }}
            onClick={_generateData}
          >
            Generate Data
          </button>
          <button
            className="btn btn-success"
            style={{ marginLeft: 10 }}
            onClick={setData}
          >
            Set Data
          </button>
        </div>

        <ReactDataGrid
          columns={columns}
          rowGetter={rowGetter}
          rowsCount={data.length}
          minHeight={300}
          onGridRowsUpdated={updateRows}
          enableCellSelect
        />


        <Tabs>
          <TabList>
            <Tab>Kmeans</Tab>
            <Tab>Hierarchical</Tab>
          </TabList>
          <TabPanel>
            <div style={{ marginTop: 10 }}>
              {
                kmeansResults.clusters && kmeansResults.clusters.map((cluster, i) => (
                  <div>
                    <h6>Cluster #{i + 1}</h6>
                    <p style={{ fontSize: 10 }}>
                      {
                        cluster.map(el => `(${el.join(',')})`).join(', ')
                      }
                    </p>
                  </div>
                ))
              }
            </div>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default Input;