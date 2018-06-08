import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import NumericInput from 'react-numeric-input';
import { Tab, Tabs, TabList, TabPanel } from 'react-tabs';

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

import DownloadIcon from '../icons/download-button.svg';
import UploadIcon from '../icons/upload-button.svg'

NumericInput.style.input.width = 100;
NumericInput.style.input.textAlign = 'center';

const Label = ({ children }) => (
  <span style={{ marginBottom: 4 }}>{children}</span>
);

const prepareData = data => {
  let ids = data.map((v, i) => `#${i}`);
  let preparedData = data;


  if (data.some(el => el.some(v => isNaN(+v)))) {
    ids = data.map(v => v[0]);
    preparedData = data
      .map(value =>
        value.slice(1).map(val => parseValue(val, 1))
      );
  }

  return { preparedData, ids };
};

const parseValue = (val, index) => {
  if (typeof val === 'string') {
    const newVal = val.replace(/"/g, '');
    return index === 0 ? newVal : parseFloat(newVal);
  }

  return val;
};

class DataUI extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    const countOfClusters = 3;

    const { preparedData, ids } = prepareData(data);

    const {
      kmeansResults,
      hierarchicalResults
    } = this.compute(preparedData, { countOfClusters }, ids);

    this.state = {
      columns: this.generateColumns(2),
      dimension: 2,
      countOfRows: data.length || 5,
      minValue: -50,
      maxValue: 50,
      centroids: '',
      countOfClusters,
      kmeansResults,
      hierarchicalResults,
      data
    };
  }

  _generateData = () => {
    this.setState(
      ({ dimension, countOfRows, minValue, maxValue }) =>
        ({ data: generateData(dimension, countOfRows, minValue, maxValue) })
    );
  };

  rowGetter = (i) => {
    return this.state.data[i];
  };

  updateRows = ({ fromRow, toRow, updated }) => {
    let data = [...this.state.data];
    for (let i = fromRow; i <= toRow; i++) {
      Object.keys(updated).forEach(key => {
        if (key === '0') {
          data[i][key] = updated[key];
        }
        else {
          const value = +updated[key];

          data[i][key] = isNaN(value) ? 0 : value;
        }
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

  compute = (preparedData, { countOfClusters, centroids }, ids) => {
    let dict = new Map();

    preparedData.forEach((data, i) => dict.set(data, ids[i]));

    console.log(dict);


    let kmeansResults = kmeans(preparedData, { k: countOfClusters, centroids });
    let hierarchicalResults = agglo(preparedData).reverse()[countOfClusters - 1];

    kmeansResults = {
      clusters: kmeansResults.clusters
        .map(cluster =>
          cluster.map(el => dict.get(el))
        )
    };

    hierarchicalResults = {
      clusters: hierarchicalResults.clusters
        .map(cluster =>
          cluster.map(el => dict.get(el))
        ),
      source: hierarchicalResults.source
    };

    return ({
      kmeansResults,
      hierarchicalResults
    });
  };

  setData = () => {
    const {
      compute,
      props: {
        setData,
      },
      state: {
        data,
        countOfClusters,
        centroids
      }
    } = this;

    const { preparedData, ids } = prepareData(data);

    const parsedCentroids = [
      ...new Set(
        centroids
          .split(/[,;\s]/)
          .filter(el => el.match(/\S/) && !isNaN(+el) && +el >= 0 && +el < preparedData.length)
          .map(el => +el)
      )
    ];

    const options = {
      countOfClusters,
      centroids: parsedCentroids
    };

    setData(preparedData, options);

    this.setState(compute(preparedData, options, ids));
  };

  onCountOfClustersChange = (value) => {
    this.setState({ countOfClusters: value })
  };

  uploadFile = (e) => {
    const reader = new FileReader();
    reader.onload = () => {
      let {
        headers,
        data
      } = parseCSV(reader.result);

      const headersFilterIndexes = data[0]
        .map(parseValue)
        .reduce((indexes, col, i) =>
            ((i === 0) || !isNaN(+col)) ? [...indexes, i] : indexes,
          []
        );

      headers = headers.filter((el, i) => headersFilterIndexes.includes(i));
      data = data.map(row =>
        row
          .map(parseValue)
          .filter((col, i) => (i === 0) || !isNaN(+col))
      );

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

    reader.readAsText(e.target.files[0]);
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

  handleMinValue = (value) =>
    this.setState({ minValue: +value });

  handleMaxValue = (value) =>
    this.setState({ maxValue: +value });

  handleCentroids = ({ target: { value } }) =>
    this.setState({ centroids: value });

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
      handleMinValue,
      handleMaxValue,
      handleCentroids,
      state: {
        data,
        columns,
        dimension,
        countOfRows,
        countOfClusters,
        minValue,
        maxValue,
        hierarchicalResults,
        kmeansResults,
        centroids
      }
    } = this;

    return (
      <Tabs>
        <TabList>
          <Tab>Input</Tab>
          <Tab>Output</Tab>
        </TabList>

        <TabPanel>
          <div className="number-inputs">
            <label className="numeric-input">
              <Label>dimension</Label>
              <NumericInput
                value={dimension}
                min={1}
                max={1000}
                onChange={onDimensionChange}
              />
            </label>
            <label className="numeric-input">
              <Label>objects</Label>
              <NumericInput
                value={countOfRows}
                min={2}
                max={1000000}
                onChange={onCountOfRowsChange}
              />
            </label>
            <label className="numeric-input">
              <Label>clusters</Label>
              <NumericInput
                value={countOfClusters}
                min={2}
                max={data.length || 2}
                onChange={onCountOfClustersChange}
              />
            </label>
            <label className="numeric-input">
              <Label>min</Label>
              <NumericInput
                value={minValue}
                onChange={handleMinValue}
              />
            </label>
            <label className="numeric-input">
              <Label>max</Label>
              <NumericInput
                value={maxValue}
                onChange={handleMaxValue}
                max={1000}
                style={{ width: 20 }}
              />
            </label>
            <label className="numeric-input">
              <Label>centroids</Label>
              <input
                type="text"
                value={centroids}
                onChange={handleCentroids}
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
            <div
              style={{ marginLeft: 10, cursor: 'pointer' }}
            >
              <input
                type="file"
                onChange={uploadFile}
                ref={node => this.input = node}
                accept=".csv"
                hidden
              />
              <img
                alt="upload"
                src={UploadIcon}
                width={35}
                height={35}
                onClick={() => this.input.click()}
              />
            </div>
            <div
              style={{ marginLeft: 10, cursor: 'pointer' }}
              onClick={saveToFile}
            >
              <img
                alt="download"
                src={DownloadIcon}
                width={35}
                height={35}
              />
            </div>
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
                hierarchicalResults.clusters && (
                  <Results results={hierarchicalResults} />
                )
              }
            </TabPanel>
          </Tabs>
        </TabPanel>
      </Tabs>
    );
  }
}

export default DataUI;