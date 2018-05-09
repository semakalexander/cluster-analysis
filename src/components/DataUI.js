import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import NumericInput from 'react-numeric-input';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';
import ReactFileReader from 'react-file-reader';

import agglo from 'agglo';

import Results from './Results';

import kmeans from '../utilities/kmeans';

import {
  generateData,
  generateZeroArray,
  parseCSV,
  unparse,
  download
} from '../utilities/common';


class DataUI extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    const countOfClusters = 3;

    const {
      kmeansResults,
      hierarchicalResults
    } = this.compute(data, { countOfClusters });

    this.state = {
      columns: this.generateColumns(2),
      dimension: 2,
      countOfRows: data.length || 5,
      countOfClusters,
      kmeansResults,
      hierarchicalResults,
      data
    };

  }

  // loadData = (files) => {
  //   console.log(files)
  // };

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

  compute = (data, { countOfClusters }) => ({
    kmeansResults: kmeans(data, { k: countOfClusters }),
    hierarchicalResults: agglo(data).reverse()
  });

  setData = () => {
    const {
      compute,
      props: {
        setData,
      },
      state: {
        data,
        countOfClusters
      }
    } = this;


    setData(data, { countOfClusters });

    this.setState(compute(data, { countOfClusters }));
  };

  onCountOfClustersChange = (value) => {
    this.setState({ countOfClusters: value })
  };

  uploadFile = (files) => {
    const reader = new FileReader();
    reader.onload = () => {
      const {
        headers,
        data
      } = parseCSV(reader.result);
      this.setState({
        columns: headers.map((h, i) => ({
          key: i,
          name: h,
          editable: true
        })),
        countOfRows: data.length,
        dimension: data[0].length,
        data,
      });
    };

    reader.readAsText(files[0]);
  };

  saveToFile = () => {
    const {
      state: {
        columns,
        data
      }
    } = this;

    const output = unparse(columns.map(c => c.name), data);

    download('cluster-data.csv', output)
  };

  render() {
    const {
      rowGetter,
      updateRows,
      onDimensionChange,
      onCountOfRowsChange,
      onCountOfClustersChange,
      setData,
      _generateData,
      uploadFile,
      saveToFile,
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
        <Tabs>
          <TabList>
            <Tab>Input</Tab>
            <Tab>Output</Tab>
          </TabList>

          <TabPanel>
            <div className="number-inputs">
              <label className="numeric-input">
                dimension
                <NumericInput
                  value={dimension}
                  min={1}
                  max={1000}
                  onChange={onDimensionChange}
                />
              </label>
              <label className="numeric-input">
                count of objects
                <NumericInput
                  value={countOfRows}
                  min={2}
                  max={1000000}
                  onChange={onCountOfRowsChange}
                />
              </label>
              <label className="numeric-input">
                count of clusters(kmeans)
                <NumericInput
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
                Compute
              </button>

              <ReactFileReader
                handleFiles={uploadFile}
                fileTypes={'.csv'}
              >
                <button
                  className="btn btn-info"
                  style={{ marginLeft: 50 }}
                >
                  Upload file
                </button>
              </ReactFileReader>
              <button
                className="btn btn-info"
                style={{ marginLeft: 10 }}
                onClick={saveToFile}
              >
                Save to file
              </button>
            </div>

            <ReactDataGrid
              columns={columns}
              rowGetter={rowGetter}
              rowsCount={data.length}
              minHeight={512}
              onGridRowsUpdated={updateRows}
              enableCellSelect
            />
          </TabPanel>

          <TabPanel>
            <Tabs>
              <TabList>
                <Tab>Kmeans</Tab>
                <Tab>Hierarchical</Tab>
              </TabList>
              <TabPanel>
                {
                  kmeansResults.clusters && (
                    <Results results={kmeansResults} />
                  )
                }
              </TabPanel>
              <TabPanel>
                {
                  hierarchicalResults.length && (
                    <Results results={hierarchicalResults} />
                  )
                }
              </TabPanel>
            </Tabs>
          </TabPanel>
        </Tabs>
      </div>
    );
  }
}

export default DataUI;