import React, { useState } from "react";
import "../css/hidenMenu.css";

function HidenMenu(props) {
  function handleAddGrid() {
    console.log("Add grid!");
  }

  return (
    <div className="hidenMenu">
      <button type="button" onClick={handleAddGrid}>
        Add
      </button>
      <p>Other options here...</p>
    </div>
  );
}

export default HidenMenu;
