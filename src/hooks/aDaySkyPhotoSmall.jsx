import React, { Fragment, useState, useEffect } from "react";
import "../css/aDaySkyPhotoSmall.css";

function ADaySkyPhotoSmall(props) {
  const [img_src, setImg_src] = useState(null);

  useEffect(() => {
    // This function is executed every time the component is rendered.
    // So it's the same as calling both:
    // componentDidMount -> the first time the component is mounted.
    // componentDidUpdate -> when receives new props or the state changes.

    // Let's check what's the c_index so we can decide which photo to show.
    // c_index goes from 0 to 100.
    // Ex:
    // if it's between [0 - 9] let's get the image 1.jpg
    // if it's between [10-20]  let's get the image 2.jpg
    // ...
    // if it's between [90-100]  let's get the image 10.jpg
    let photo_number = Math.floor(props.cloudData.c_index / 10) + 1;
    if (photo_number > 10) {
      photo_number = 10;
    }

    const photo_name =
      process.env.PUBLIC_URL +
      "photos/photos_photoshop/" +
      photo_number +
      ".jpg";

    setImg_src(photo_name);
  }, []); // this array that is passed as the second parameter of the useEffect function indicates which variables are the triggers to call useEffect. If these variables change, the useEffect will be called. If we don't have this array, the function will be called on any props/state change.

  return (
    <div>
      {img_src != null ? (
        <img
          className="skyPhoto"
          // src={process.env.PUBLIC_URL + "photos/20210601.jpg"}
          src={img_src}
          alt="."
        ></img>
      ) : (
        <p>Loading</p>
      )}
    </div>
  );
}

export default ADaySkyPhotoSmall;
