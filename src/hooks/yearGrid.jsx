import React, { useState } from "react";
import ADaySkyPhoto from "./aDaySkyPhoto";
import "../css/yearGrid.css";

function YearGrid(props) {
  return (
    <div className="yearGrid">
      {Array.from(Array(365).keys()).map((i) => (
        <ADaySkyPhoto key={i} />
      ))}
    </div>
  );
}

export default YearGrid;
