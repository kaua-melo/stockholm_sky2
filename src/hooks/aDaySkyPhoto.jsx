import React, { Fragment, useState } from "react";
import "../css/aDaySkyPhoto.css";

function ADaySkyPhoto(props) {
  return (
    <Fragment>
      <div
        className="skyPhotoDiv"
        style={{
          backgroundImage: "url(/photos/20210601.jpg)",
          backgroundPosition: "center",
          backgroundSize: "cover",
          backgroundRepeat: "no-repeat",
        }}
      >
        {/* <img
          className="skyPhoto"
          src={process.env.PUBLIC_URL + "photos/20210601.jpg"}
          alt="."
        ></img> */}
      </div>
    </Fragment>
  );
}

export default ADaySkyPhoto;
