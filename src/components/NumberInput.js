import React from 'react';

const NumberInput = ({ value, min, label = '', onChange }) => (
  <div className="number-input-wrapper">
    <label>
      <span>{label}</span>
      <div className="number-input">
        <div
          className="btn btn-control btn-danger"
          onClick={() => onChange((value < min) ? min : value - 1)}
        >
          -
        </div>
        <input
          type="text"
          value={value}
          onChange={({ target: { value } }) => onChange(+value < min ? min : +value)}
        />
        <div
          className="btn btn-control btn-success"
          onClick={() => onChange(value + 1)}
        >
          +
        </div>
      </div>
    </label>

  </div>
);

export default NumberInput;
