import React from "react";
import PropTypes from "prop-types";
import { useState, useRef, useCallback, useEffect } from "react";

import "../css/multiRangeSlider.css";

const MultiRangeSlider = (props) => {
  var min = props.min;
  var max = props.max;

  // Creating the state variables
  const [minVal, setMinVal] = useState(min);
  const [maxVal, setMaxVal] = useState(max);

  // Creating the refs
  const minValRef = useRef(min);
  const maxValRef = useRef(max);

  // Create a ref to our slider
  const range = useRef(null);

  // Convert to percentage
  const getPercent = useCallback(
    (value) => Math.round(((value - min) / (max - min)) * 100),
    [min, max]
  );

  // Set width of the range to change from the left side
  useEffect(() => {
    const minPercent = getPercent(minVal);
    const maxPercent = getPercent(maxValRef.current);

    if (range.current) {
      range.current.style.left = `${minPercent}%`;
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [minVal, getPercent]);

  // Set width of the range to change from the right side
  useEffect(() => {
    const minPercent = getPercent(minValRef.current);
    const maxPercent = getPercent(maxVal);

    if (range.current) {
      range.current.style.width = `${maxPercent - minPercent}%`;
    }
  }, [maxVal, getPercent]);

  return (
    <React.Fragment>
      <input
        type="range"
        min={min}
        max={max}
        value={minVal}
        onChange={(event) => {
          props.onChange();

          // maxVal - 1, maintains a difference of one between minVal and maxVal.
          // This is done to make sure that minVal does not exceed maxVal.
          const value = Math.min(Number(event.target.value), maxVal - 1);
          setMinVal(value);
          minValRef.current = value;
          props.onChange(value, maxVal);
        }}
        className="thumb thumb--left"
        style={{ zIndex: minVal > max - 100 && "5" }}
      />
      <input
        type="range"
        min={min}
        max={max}
        value={maxVal}
        onChange={(event) => {
          // minVal + 1, maintains a difference of one between minVal and maxVal.
          // This is done to make sure that maxVal isn't smaller than minVal.
          const value = Math.max(Number(event.target.value), minVal + 1);
          setMaxVal(value);
          maxValRef.current = value;

          props.onChange(minVal, value);
        }}
        className="thumb thumb--right"
      />

      {/* Creating our own slider here */}
      <div className="slider">
        <div className="slider__track" />
        <div ref={range} className="slider__range" />

        <div className="slider__left-value">{minVal}%</div>
        <div className="slider__right-value">{maxVal}%</div>
      </div>
    </React.Fragment>
  );
};

// Set each prop as type number
MultiRangeSlider.propTypes = {
  min: PropTypes.number.isRequired,
  max: PropTypes.number.isRequired,
};

export default MultiRangeSlider;
