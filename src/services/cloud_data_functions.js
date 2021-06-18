import { cloud_data } from "./cloud_1756_2018.js";

// Returns the data for the specific year.
export function getYear(year) {
  return cloud_data.find((y) => y.year === year);
}
