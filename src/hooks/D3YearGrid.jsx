import React, { useEffect, useRef, useState } from "react";
import * as d3 from "d3";

import { getYear } from "../services/cloud_data_functions";

import "../css/D3YearGrid.css";

import MultiRangeSlider from "./MultiRangeSlider";

function D3YearGrid(props) {
  const d3Grid = useRef();
  // const [data, setData] = useState([]);

  // 1 = day_number
  // 2 = radiation/c_index
  // 3 = months
  // 4 = play song
  const [sortMethod, setSortMethod] = useState(1);
  const [svg, setSvg] = useState(null);
  const [recs, setRecs] = useState({});
  const [nRecsPerRow, setNRecsPerRow] = useState(null);
  const [gridGap, setGridGap] = useState({});
  const [monthsLength, setMonthsLength] = useState({});
  // const [indexThreshold, setIndexThreshold] = useState(100);
  const [filterMin, setFilterMin] = useState(0);
  const [filterMax, setFilterMax] = useState(100);

  useEffect(() => {
    // The data should be all ready when we load this component :)
    // console.log("Inside D3YearGrid!");
    // console.log(props.data);
    // console.log("year: " + props.year);

    const margin = { top: 0, right: 0, bottom: 0, left: 0 };
    const width = parseInt(d3.select(".d3Container").style("width"));
    // const height = parseInt(d3.select(".d3Container").style("height"));
    const height = 1 * width;
    const gridGapX = 0;
    const gridGapY = 0;
    setGridGap({ x: gridGapX, y: gridGapY });

    // set up the svg
    const svg_temp = d3
      .select(d3Grid.current)
      .attr("width", width - margin.left - margin.right)
      .attr("height", height - margin.top - margin.bottom)
      .attr("class", "D3Svg")
      // .append("g")
      .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    setSvg(svg_temp);

    var svg_width = width;
    var n_recs_per_row = 20;
    var rec_w = Math.floor((0.7 * svg_width) / n_recs_per_row);
    var rec_h = rec_w;
    setNRecsPerRow(n_recs_per_row);
    setRecs({ width: rec_w, height: rec_h });

    // Add the rectangles
    svg_temp
      .selectAll("rect") // There's no 'rect' to select. But this is how we do to fill the svg with 'rects'.
      .data(props.data) // here we load the data
      .enter()
      .append("rect") // .enter().append() -> for each datapoint in the dataset, add a 'rect'.
      .attr("width", rec_w)
      .attr("height", rec_h)
      .attr("x", function (d, i) {
        return (i % n_recs_per_row) * (rec_w + gridGapX) + 0.15 * svg_width;
      })
      .attr("y", function (d, i) {
        return (
          Math.floor(i / n_recs_per_row) * (rec_h + gridGapY) + 0.15 * svg_width
        );
      })
      .attr("fill", function (d, i) {
        var bright_color = [100, 146, 230];
        var dark_color = [99, 112, 124];

        var factor = Math.floor(d.c_index / 10) * 10;

        // hard coding colors:
        var color = [];
        if (factor < 10) {
          // 1.jpg
          color = [100, 146, 230];
        } else if (factor >= 10 && factor < 20) {
          // 2.jpg
          color = [99, 143, 224];
        } else if (factor >= 20 && factor < 30) {
          // 3.jpg
          color = [96, 142, 214];
        } else if (factor >= 30 && factor < 40) {
          // 4.jpg
          color = [94, 138, 204];
        } else if (factor >= 40 && factor < 50) {
          // 5.jpg
          color = [94, 136, 193];
        } else if (factor >= 50 && factor < 60) {
          // 6.jpg
          color = [93, 131, 182];
        } else if (factor >= 60 && factor < 70) {
          // 7.jpg
          color = [93, 128, 170];
        } else if (factor >= 70 && factor < 80) {
          // 8.jpg
          color = [95, 124, 154];
        } else if (factor >= 80 && factor < 90) {
          // 9.jpg
          color = [97, 118, 138];
        } else if (factor >= 90) {
          // 10.jpg
          color = [99, 112, 124];
        }
        return "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 1)";
      })
      .style("stroke-opacity", 1) // set the stroke opacity
      .style("stroke", "black") // set the line colour
      .style("stroke-width", 0.5) // set the stroke width

      .html(function (d, i) {
        return d.day_number;
      });

    var monthNames = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    // Adding month labels
    svg_temp
      .selectAll("text")
      .data(monthNames)
      .enter()
      .append("text")
      .text(function (d) {
        return d;
      })
      .attr("x", -100)
      .attr("y", function (d, i) {
        return 130 + i * 45;
      });

    // We need to check if the year is a leap year because in that case the month
    // of february has 29 days instead of 28. This will be essential for sorting
    // the months visually.

    if (props.data.length === 366) {
      setMonthsLength({
        1: 31,
        2: 29, // February has 29 days in leap years
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
      });
    } else if (props.data.length === 365) {
      setMonthsLength({
        1: 31,
        2: 28, // February has 28 days in non-leap years
        3: 31,
        4: 30,
        5: 31,
        6: 30,
        7: 31,
        8: 31,
        9: 30,
        10: 31,
        11: 30,
        12: 31,
      });
    }
  }, []);

  function handleSortLight() {
    // console.log("Sort Light");

    if (sortMethod !== 2) {
      // If the setState already dumped the dvg data into our svg variable
      if (svg) {
        let svg_width = svg.style("width").replace("px", "");

        svg
          .selectAll("rect")
          .sort(function (x, y) {
            return d3.ascending(x.c_index, y.c_index);
          })
          .transition()
          .duration(2000)
          .attr("width", recs.width)
          .attr("height", recs.height)
          .attr("x", function (d, i) {
            return (
              (i % nRecsPerRow) * (recs.width + gridGap.x) + 0.15 * svg_width
            );
          })
          .attr("y", function (d, i) {
            // console.log(Math.floor(i / 33));
            return (
              Math.floor(i / nRecsPerRow) * (recs.height + gridGap.y) +
              0.15 * svg_width
            );
          });

        // Hiding month labels
        svg
          .selectAll("text")
          .transition()
          .duration(2000)
          .attr("x", -100)
          .attr("y", function (d, i) {
            return 130 + i * 45;
          });
      }

      setSortMethod(2);
    }
  }

  function handleSortDay() {
    // console.log("Sort Day");

    if (sortMethod !== 1) {
      // If the setState already dumped the dvg data into our svg variable
      if (svg) {
        let svg_width = svg.style("width").replace("px", "");

        svg
          .selectAll("rect")
          .sort(function (x, y) {
            return d3.ascending(x.day_number, y.day_number);
          })
          .transition()
          .duration(2000)
          .attr("width", recs.width)
          .attr("height", recs.height)
          .attr("x", function (d, i) {
            return (
              (i % nRecsPerRow) * (recs.width + gridGap.x) + 0.15 * svg_width
            );
          })
          .attr("y", function (d, i) {
            // console.log(Math.floor(i / 33));
            return (
              Math.floor(i / nRecsPerRow) * (recs.height + gridGap.y) +
              0.15 * svg_width
            );
          });

        // Hiding month labels
        svg
          .selectAll("text")
          .transition()
          .duration(2000)
          .attr("x", -100)
          .attr("y", function (d, i) {
            return 130 + i * 45;
          });

        setSortMethod(1);
      }
    }
  }

  function handleSortMonth() {
    console.log("Sort Month");

    if (sortMethod !== 3) {
      // If the setState already dumped the dvg data into our svg variable
      if (svg) {
        console.log("Group Month!");

        let svg_width = svg.style("width").replace("px", "");

        svg
          .selectAll("rect")
          .sort(function (x, y) {
            return d3.ascending(x.day_number, y.day_number);
          })
          .transition()
          .duration(2000)
          .attr("width", recs.width)
          .attr("height", recs.height)
          .attr("x", function (d, i) {
            // This will be useful for knowing how to distribute the
            //  squares in months. We'll need this logic becausse there are
            //  leap years, where the month of February has 29 days.
            let summedDaysPreviousMonth = 0;
            for (let m = 1; m < d.month; m++) {
              summedDaysPreviousMonth += monthsLength[m];
            }

            // January
            if (d.month === 1) {
              return (i % 6) * recs.width + 0.05 * svg_width;
            }

            // February
            else if (d.month === 2) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                7 * recs.width
              );
            }

            // March
            else if (d.month === 3) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                14 * recs.width
              );
            }

            // April
            else if (d.month === 4) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                21 * recs.width
              );
            }

            // May
            else if (d.month === 5) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width
              );
            }

            // Jun
            else if (d.month === 6) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                7 * recs.width
              );
            }

            // July
            else if (d.month === 7) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                14 * recs.width
              );
            }

            // August
            else if (d.month === 8) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                21 * recs.width
              );
            }

            // September
            else if (d.month === 9) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width
              );
            }

            // October
            else if (d.month === 10) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                7 * recs.width
              );
            }

            // November
            else if (d.month === 11) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                14 * recs.width
              );
            }

            // December
            else if (d.month === 12) {
              return (
                ((i - summedDaysPreviousMonth) % 6) * recs.width +
                0.05 * svg_width +
                21 * recs.width
              );
            } else {
              return 500;
            }
          })
          .attr("y", function (d, i) {
            // This will be useful for knowing how to distribute the
            //  squares in months. We'll need this logic becausse there are
            //  leap years, where the month of February has 29 days.
            let summedDaysPreviousMonth = 0;
            for (let m = 1; m < d.month; m++) {
              summedDaysPreviousMonth += monthsLength[m];
            }

            // January
            if (d.month === 1) {
              return Math.floor(i / 6) * recs.height + 0.05 * svg_width;
            }

            // February
            else if (d.month === 2) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width
              );
            }

            // March
            else if (d.month === 3) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width
              );
            }

            // April
            else if (d.month === 4) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width
              );
            }

            // May
            else if (d.month === 5) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                9 * recs.height
              );
            }

            // June
            else if (d.month === 6) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                9 * recs.height
              );
            }

            // July
            else if (d.month === 7) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                9 * recs.height
              );
            }

            // August
            else if (d.month === 8) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                9 * recs.height
              );
            }

            // September
            else if (d.month === 9) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                18 * recs.height
              );
            }

            // October
            else if (d.month === 10) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                18 * recs.height
              );
            }

            // November
            else if (d.month === 11) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                18 * recs.height
              );
            }

            // Dececmber
            else if (d.month === 12) {
              return (
                Math.floor((i - summedDaysPreviousMonth) / 6) * recs.height +
                0.05 * svg_width +
                18 * recs.height
              );
            }
          });

        // Writing months names
        svg
          .selectAll("text")
          .transition()
          .duration(2000)
          .attr("x", function (d, i) {
            // if (d === "January") {
            if (i === 0) {
              return 0.05 * svg_width;
              // } else if (d === "February") {
            } else if (i === 1) {
              return 0.05 * svg_width + 7 * recs.width;
              // } else if (d === "March") {
            } else if (i === 2) {
              return 0.05 * svg_width + 14 * recs.width;
              // } else if (d === "April") {
            } else if (i === 3) {
              return 0.05 * svg_width + 21 * recs.width;
            }
            // 2nd row
            // else if (d === "May") {
            else if (i === 4) {
              return 0.05 * svg_width;
              // } else if (d === "June") {
            } else if (i === 5) {
              return 0.05 * svg_width + 7 * recs.width;
              // } else if (d === "July") {
            } else if (i === 6) {
              return 0.05 * svg_width + 14 * recs.width;
              // } else if (d === "August") {
            } else if (i === 7) {
              return 0.05 * svg_width + 21 * recs.width;
            }
            // 3rd row
            // else if (d === "September") {
            else if (i === 8) {
              return 0.05 * svg_width;
              // } else if (d === "October") {
            } else if (i === 9) {
              return 0.05 * svg_width + 7 * recs.width;
              // } else if (d === "November") {
            } else if (i === 10) {
              return 0.05 * svg_width + 14 * recs.width;
              // } else if (d === "December") {
            } else if (i === 11) {
              return 0.05 * svg_width + 21 * recs.width;
            }
          })
          .attr("y", function (d, i) {
            // if (d === "January") {
            if (i === 0) {
              return 0.05 * svg_width - 10;
              // } else if (d === "February") {
            } else if (i === 1) {
              return 0.05 * svg_width - 10;
              // } else if (d === "March") {
            } else if (i === 2) {
              return 0.05 * svg_width - 10;
              // } else if (d === "April") {
            } else if (i === 3) {
              return 0.05 * svg_width - 10;
            }

            // 2nd row
            // else if (d === "May") {
            else if (i === 4) {
              return 0.05 * svg_width + 9 * recs.height - 10;
              // } else if (d === "June") {
            } else if (i === 5) {
              return 0.05 * svg_width + 9 * recs.height - 10;
              // } else if (d === "July") {
            } else if (i === 6) {
              return 0.05 * svg_width + 9 * recs.height - 10;
              // } else if (d === "August") {
            } else if (i === 7) {
              return 0.05 * svg_width + 9 * recs.height - 10;
            }
            // 3rd row
            // else if (d === "September") {
            else if (i === 8) {
              return 0.05 * svg_width + 18 * recs.height - 10;
              // } else if (d === "October") {
            } else if (i === 9) {
              return 0.05 * svg_width + 18 * recs.height - 10;
              // } else if (d === "November") {
            } else if (i === 10) {
              return 0.05 * svg_width + 18 * recs.height - 10;
              // } else if (d === "December") {
            } else if (i === 11) {
              return 0.05 * svg_width + 18 * recs.height - 10;
            }
          });
      }

      setSortMethod(3);
    }
  }

  // function handleSlideChange(event) {
  function handleSlideChange(min, max) {
    // console.log("Slide changed: " + event.target.value);

    if (svg) {
      // setIndexThreshold(event.target.value);

      // Setting the filter variables
      setFilterMin(min);
      setFilterMax(max);

      // This is the sample color to be displayed. So the user knows what she/he is filtering. What does 10% of cloud mean?? There's a need for a photo there.
      // // Hard coding colors:
      // const radiation_filter_factor = event.target.value;

      // var color = [];
      // if (radiation_filter_factor < 10) {
      //   // 1.jpg
      //   color = [100, 146, 230];
      // } else if (
      //   radiation_filter_factor >= 10 &&
      //   radiation_filter_factor < 20
      // ) {
      //   // 2.jpg
      //   color = [99, 143, 224];
      // } else if (
      //   radiation_filter_factor >= 20 &&
      //   radiation_filter_factor < 30
      // ) {
      //   // 3.jpg
      //   color = [96, 142, 214];
      // } else if (
      //   radiation_filter_factor >= 30 &&
      //   radiation_filter_factor < 40
      // ) {
      //   // 4.jpg
      //   color = [94, 138, 204];
      // } else if (
      //   radiation_filter_factor >= 40 &&
      //   radiation_filter_factor < 50
      // ) {
      //   // 5.jpg
      //   color = [94, 136, 193];
      // } else if (
      //   radiation_filter_factor >= 50 &&
      //   radiation_filter_factor < 60
      // ) {
      //   // 6.jpg
      //   color = [93, 131, 182];
      // } else if (
      //   radiation_filter_factor >= 60 &&
      //   radiation_filter_factor < 70
      // ) {
      //   // 7.jpg
      //   color = [93, 128, 170];
      // } else if (
      //   radiation_filter_factor >= 70 &&
      //   radiation_filter_factor < 80
      // ) {
      //   // 8.jpg
      //   color = [95, 124, 154];
      // } else if (
      //   radiation_filter_factor >= 80 &&
      //   radiation_filter_factor < 90
      // ) {
      //   // 9.jpg
      //   color = [97, 118, 138];
      // } else if (radiation_filter_factor >= 90) {
      //   // 10.jpg
      //   color = [99, 112, 124];
      // }
      // // Updating the color of the sample
      // document.getElementById("color_sample").style.backgroundColor =
      //   "rgb(" + color[0] + "," + color[1] + "," + color[2] + ")";

      // Changing the colors of the squares
      svg
        .selectAll("rect")
        .transition()
        .duration(800)
        .attr("fill", function (d, i) {
          var cell_radiation_factor = Math.floor(d.c_index / 10) * 10;

          var color = [];

          // If the radiation value of the cell is smaller than the
          //  radiation velue of the threshold (in the slide), we going
          //  to fill it with black
          // if (cell_radiation_factor > radiation_filter_factor) {
          if (cell_radiation_factor < min || cell_radiation_factor > max) {
            // color = [0, 0, 0];
            color = [255, 255, 255];
          }
          // Otherwise we fill it with the proper color
          else {
            if (cell_radiation_factor < 10) {
              // 1.jpg
              color = [100, 146, 230];
            } else if (
              cell_radiation_factor >= 10 &&
              cell_radiation_factor < 20
            ) {
              // 2.jpg
              color = [99, 143, 224];
            } else if (
              cell_radiation_factor >= 20 &&
              cell_radiation_factor < 30
            ) {
              // 3.jpg
              color = [96, 142, 214];
            } else if (
              cell_radiation_factor >= 30 &&
              cell_radiation_factor < 40
            ) {
              // 4.jpg
              color = [94, 138, 204];
            } else if (
              cell_radiation_factor >= 40 &&
              cell_radiation_factor < 50
            ) {
              // 5.jpg
              color = [94, 136, 193];
            } else if (
              cell_radiation_factor >= 50 &&
              cell_radiation_factor < 60
            ) {
              // 6.jpg
              color = [93, 131, 182];
            } else if (
              cell_radiation_factor >= 60 &&
              cell_radiation_factor < 70
            ) {
              // 7.jpg
              color = [93, 128, 170];
            } else if (
              cell_radiation_factor >= 70 &&
              cell_radiation_factor < 80
            ) {
              // 8.jpg
              color = [95, 124, 154];
            } else if (
              cell_radiation_factor >= 80 &&
              cell_radiation_factor < 90
            ) {
              // 9.jpg
              color = [97, 118, 138];
            } else if (cell_radiation_factor >= 90) {
              // 10.jpg
              color = [99, 112, 124];
            }
          }

          return "rgba(" + color[0] + "," + color[1] + "," + color[2] + ", 1)";
        });
    }
  }

  function handlePlaySong() {
    setSortMethod(4);
  }

  return (
    <React.Fragment>
      <div className="grid_controlers">
        <div className="buttons">
          <button
            className={
              sortMethod === 2
                ? "sortingButton selectedButton"
                : "sortingButton"
            }
            onClick={handleSortLight}
          >
            Sort Light
          </button>
          <button
            className={
              sortMethod === 1
                ? "sortingButton selectedButton"
                : "sortingButton"
            }
            onClick={handleSortDay}
          >
            Sort Date
          </button>
          <button
            className={
              sortMethod === 3
                ? "sortingButton selectedButton"
                : "sortingButton"
            }
            onClick={handleSortMonth}
          >
            Group Months
          </button>
          <button
            className={
              sortMethod === 4
                ? "sortingButton selectedButton musicSymbol"
                : "sortingButton musicSymbol"
            }
            onClick={handlePlaySong}
          >
            &#9835;
          </button>
        </div>

        <div className="slidecontainer">
          <MultiRangeSlider min={0} max={100} onChange={handleSlideChange} />
        </div>
        {/* <div className="slidecontainer">
          <input
            type="range"
            min="0"
            max="100"
            defaultValue="100"
            className="slider"
            id="colorSlider"
            onInput={handleSlideChange}
          />
          <p id="slide_value_p"> {indexThreshold}</p>
          <div id="color_sample"></div>
        </div> */}
      </div>

      <div className="d3Container">
        <svg ref={d3Grid}></svg>
      </div>
    </React.Fragment>
  );
}

export default D3YearGrid;
