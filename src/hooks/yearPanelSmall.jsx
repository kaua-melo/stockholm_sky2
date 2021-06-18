import React, { Fragment, useState, useEffect } from "react";
import YearGridSmall from "./yearGridSmall";
import "../css/yearPanelSmall.css";
import D3YearGrid from "./D3YearGrid";
import { getYear } from "../services/cloud_data_functions";

function YearPanelSmall(props) {
  const [data, setData] = useState([]);

  useEffect(() => {
    // // We need to query the data asyncronously because it might take a while to receive the data.
    // let getDataFunction = async () => {
    //   return getYear(props.year);
    // };
    // // When we are done getting the data, the function inside ".then()" is executed.
    // getDataFunction().then((values) => {
    //   // Saving the data.
    //   setData(values);
    // });

    async function getData() {
      const result = await getYear(props.year);
      setData(result.data);
    }

    getData();
  }, []);

  function handleDelete() {
    props.onDelete(props.year);
  }
  return (
    <div className="yearPanelSmallDiv">
      <div className="header">
        <h2 className="year">{props.year}</h2>
        <button className="closeButton" onClick={handleDelete}>
          x
        </button>
        {/* <button> > </button> */}
      </div>

      <div>
        {/* <YearGridSmall year={props.year} /> */}
        {/* It takes a while for the data to be set by using setState.
            Because of that we need to check whether it's bigger than 0 first, then we render it */}
        {data.length > 0 ? (
          <D3YearGrid data={data} year={props.year} />
        ) : (
          <p>Loading...</p>
        )}
      </div>
    </div>
  );
}

export default YearPanelSmall;
