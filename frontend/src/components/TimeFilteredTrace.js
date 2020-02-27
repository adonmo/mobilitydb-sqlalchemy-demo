import moment from "moment";
import randomColor from "randomcolor";
import React from "react";
import { Polyline } from "react-leaflet";

const TimeFilteredTrace = ({
  trip,
  idx,
  minSelectedT,
  maxSelectedT,
  selected
}) => {
  return (
    <Polyline
      color={selected ? "red" : randomColor({ luminosity: "dark", seed: idx })}
      weight={selected ? 5 : 3}
      positions={trip.trajectory.filter(traj => {
        const t = moment(traj[2] * 1000);
        return minSelectedT <= t && t <= maxSelectedT;
      })}
      key={idx}
    />
  );
};

export default TimeFilteredTrace;
