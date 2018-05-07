import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';
import NumericInput from 'react-numeric-input';
import CsvParse from '@vtex/react-csv-parse'
import { generateData } from '../utilities/common';

const generateZeroArray = dimension =>
  [...(new Array(dimension))].map(() => 0);

// todo think about csv structure and add csv loader

class Input extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      columns: this.generateColumns(2),
      rows: data,
      dimension: 2,
      countOfRows: data.length || 5
    };

  }

  loadData = (files) => {
    console.log(files)
  };

  _generateData= () => {
    this.setState(
      ({ dimension, countOfRows }) =>
        ({ rows: generateData(dimension, countOfRows) })
    );
  };

  rowGetter = (i) => {
    return this.state.rows[i];
  };

  updateRows = ({ fromRow, toRow, updated }) => {
    let rows = [...this.state.rows];
    for (let i = fromRow; i <= toRow; i++) {
      Object.keys(updated).forEach(key => {
        const value = +updated[key];
        rows[i][key] = isNaN(value) ? 0 : value;
      });
    }

    this.setState({ rows });
  };


  onDimensionChange = (value) => {
    const {
      state: {
        dimension,
        rows: oldRows
      }
    } = this;

    const rows = +value > dimension ?
      oldRows.map(row => [...row, ...generateZeroArray(+value - dimension)]) :
      oldRows.map(row => row.slice(0, +value));

    this.setState({
      dimension: +value,
      columns: this.generateColumns(+value),
      rows
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
      rows: oldRows
    } = this.state;

    if (+value === countOfRows) return;

    let rows = [...oldRows];

    if (value > countOfRows) {
      for (let i = 0; i < value - countOfRows; i++) {
        rows.push(generateZeroArray(dimension));
      }
    } else {
      rows = rows.slice(0, value);
    }

    this.setState({ countOfRows: +value, rows });

  };

  setData = () => {
    const {
      props: {
        setData,
      },
      state: {
        rows
      }
    } = this;

    setData(rows);
  };

  render() {
    const {
      rowGetter,
      updateRows,
      onDimensionChange,
      onCountOfRowsChange,
      setData,
      loadData,
      _generateData,
      state: {
        rows,
        columns,
        dimension,
        countOfRows
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
            count of rows
            <NumericInput
              label="count of rows"
              value={countOfRows}
              min={2}
              max={1000000}
              onChange={onCountOfRowsChange}
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
          rowsCount={rows.length}
          minHeight={300}
          onGridRowsUpdated={updateRows}
          enableCellSelect
        />


        <div style={{ marginTop: 10 }}>
          <p>Output will be here</p>
          {/* <ReactDataGrid
            columns={columns}
            rowGetter={rowGetter}
            rowsCount={rows.length}
            minHeight={250}
            onGridRowsUpdated={updateRows}
            enableCellSelect
          /> */}
        </div>

      </div>
    );
  }
}

export default Input;