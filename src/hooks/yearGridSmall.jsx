import React, { useState, useEffect } from "react";
import ADaySkyPhotoSmall from "./aDaySkyPhotoSmall";
import "../css/yearGridSmall.css";

import { getYear } from "../services/cloud_data_functions";

function YearGridSmall(props) {
  const [yearsDataFormatted, setYearsDataFormatted] = useState(null);

  useEffect(() => {
    // This function is executed every time the component is rendered.
    // So it's the same as calling both:
    // componentDidMount -> the first time the component is mounted.
    // componentDidUpdate -> when receives new props or the state changes.

    // Getting the years data.
    const yearsDataRaw = getYear(props.year);

    // This is the array in which we'll temporarily store the
    //  data of the year, formatted in a clean way so we can
    //  pass to the 'aDaySkyPhotoSmall' hook.
    let yearsDataFormatted_temp = [];

    // Looping through each month
    yearsDataRaw.months.map((m) => {
      // Looping the days of the month
      m.days.map((d) => {
        // console.log(d);
        yearsDataFormatted_temp.push({
          month: m.month,
          day: d.day,
          c_index: d.c_index,
        });
      });
    });

    setYearsDataFormatted(yearsDataFormatted_temp);
  }, []); // this array that is passed as the second parameter of the useEffect function indicates which variables are the triggers to call useEffect. If these variables change, the useEffect will be called. If we don't have this array, the function will be called on any props/state change.

  function printYearsDataRaw() {
    console.log(yearsDataFormatted);
  }

  return (
    <div className="yearGridSmall">
      {/* We are temporarily using this button just to show the data loadaded. For debugging. */}
      {/* <button onClick={printYearsDataRaw}></button> */}

      {/* It takes a while for the 'yearsDataFormatted' to be ready (we create it in the 'useEffect')  
          So we must first need to check whether it isn't null yet before we try to display the photos, 
          otherwise the app will break */}
      {yearsDataFormatted != null ? (
        yearsDataFormatted.map((data_day, index) => (
          <ADaySkyPhotoSmall
            key={index}
            year={props.year}
            cloudData={data_day}
          />
        ))
      ) : (
        <h1>loading</h1>
      )}

      {/* {Array.from(Array(365).keys()).map((i) => (
        <ADaySkyPhotoSmall
          key={i}
          year={props.year}
          cloudData={yearsDataFormatted}
        />
      ))} */}
    </div>
  );
}

export default YearGridSmall;
