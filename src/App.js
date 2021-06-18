import React, { useState } from "react";

import "./App.css";
import "./hooks/hidenMenu";
import "./hooks/yearGrid";

import HidenMenu from "./hooks/hidenMenu";
import YearGrid from "./hooks/yearGrid";
import YearPanelSmall from "./hooks/yearPanelSmall";

function App() {
  const [yearsShowing, setYearsShowing] = useState([]);
  const [yearSelected, setYearSelected] = useState(1756);

  // useEffect(() => {
  //   // This function is executed every time the component is rendered.
  //   // So it's the same as calling both:
  //   // componentDidMount -> the first time the component is mounted.
  //   // componentDidUpdate -> when receives new props or the state changes.
  //   const temp = getYear(1756);
  //   console.log(temp);
  // }, []); // this array that is passed as the second parameter of the useEffect function indicates which variables are the triggers to call useEffect. If these variables change, the useEffect will be called. If we don't have this array, the function will be called on any props/state change.

  function handleAddGrid() {
    // Cloning 'yearsShowing' array.
    let yearsShowingCopy = [...yearsShowing];

    // Add the new year
    yearsShowingCopy.push(yearSelected);

    // Updating the state.
    setYearsShowing(yearsShowingCopy);
  }

  function handleYearChange(e) {
    setYearSelected(parseInt(e.target.value));
    // console.log(e.target.value);
  }

  function handleDeleteGrid(yearToBeDeleted) {
    // Cloning the array
    const yearsShowingTemp = [...yearsShowing];

    // Finding the index of the 'yearToBeDeleted' in our list
    const index = yearsShowingTemp.indexOf(yearToBeDeleted);

    // Removing the 'yearToBeDeleted' from the list
    yearsShowingTemp.splice(index, 1);

    setYearsShowing(yearsShowingTemp);
  }

  return (
    <div className="App">
      {/* <div className="hidenMenuDiv">
        <HidenMenu />
      </div> */}

      <div className="tempMenu">
        <button className="addGridButton" onClick={handleAddGrid}>
          Add
        </button>

        <select name="years" onChange={handleYearChange}>
          {/* Here we create an array with 262 values. [0,1,...,261] 
              For each item we add 1756 so we can have an array with [1756,...,2018]
              We loop through it to create the dropdown options */}
          {Array.from(Array(263).keys())
            .map((x) => x + 1756)
            .map((i) => (
              <option value={i} key={i}>
                {i}
              </option>
            ))}
        </select>
      </div>

      {yearsShowing.length === 1000000000 ? (
        <div className="fullScreenGridDiv">
          <YearGrid />
        </div>
      ) : (
        <div className="gridsComparisonContainer">
          {yearsShowing.map((y) => (
            <YearPanelSmall key={y} year={y} onDelete={handleDeleteGrid} />
          ))}
        </div>
      )}

      {/* <div className="testingDiv">
        <YearPanelSmall />
      </div> */}
    </div>
  );
}

export default App;
