import React, { Component } from 'react';
import ReactDataGrid from 'react-data-grid';

const generateZeroArray = dimension =>
  [...(new Array(dimension))].map(() => 0);


class Sandbox extends Component {
  constructor(props) {
    super(props);

    const { data } = props;

    this.state = {
      columns: this.generateColumns(2) /* data.length ?
        data[0].map((el, i) => ({
          key: i,
          name: i,
          editable: true
        })) : [] */,
      rows: [[0, 0]],
      dimension: 2,
      countOfRows: 1
    };

  }

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


  onDimensionChange = ({ target: { value } }) => {
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

  onCountOfRowsChange = ({ target: { value } }) => {
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
      state: {
        rows,
        columns,
        dimension,
        countOfRows
      }
    } = this;

    return (
      <div>
        <input
          type="number"
          value={dimension}
          min={1}
          max={1000}
          onChange={onDimensionChange}
        />
        <input
          type="number"
          value={countOfRows}
          min={1}
          max={1000000}
          onChange={onCountOfRowsChange}
        />
        <ReactDataGrid
          columns={columns}
          rowGetter={rowGetter}
          rowsCount={rows.length}
          minHeight={500}
          onGridRowsUpdated={updateRows}
          enableCellSelect
        />
        <button onClick={setData} >Set Data</button>
      </div>
    );
  }
}

export default Sandbox;