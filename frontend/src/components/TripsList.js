import { Card, Empty } from "antd";
import moment from "moment";
import React from "react";

const TripsList = ({ trips, selectedTrip, onSelectedTripChange, loading }) => {
  if (loading) {
    return <Card loading />
  }

  return (
    <div
      style={{
        background: "white",
        height: "100vh",
        overflow: "auto"
      }}
    >
      {trips.length > 0 ? (
        trips.map((trip, idx) => {
          const startTime = moment(
            Math.min(...trip.trajectory.map(e => e[2])) * 1000
          );
          const endTime = moment(
            Math.max(...trip.trajectory.map(e => e[2])) * 1000
          );
          const selected = selectedTrip === idx;
          return (
            <div
              style={{
                padding: 12,
                background: selected && "rgba(255, 210, 210, 0.33)",
                cursor: "pointer"
              }}
              // For desktop screens
              onMouseOver={() => onSelectedTripChange(idx)}
              onMouseLeave={() => onSelectedTripChange(-1)}
              // For mobiles
              onTouchStart={() => onSelectedTripChange(idx)}
            >
              <div>
                <span>
                  <span>Trip #{idx + 1}</span>
                  <span>{" • "}</span>
                  <span>
                    {moment.duration(endTime.diff(startTime)).humanize()}
                  </span>
                  <span>{" • "}</span>
                  <span>
                    {(trip.distance * 100).toFixed(2)} kms
                  </span>
                  <span>{" • "}</span>
                  <span>
                    {(trip.speed ? trip.speed * 1000 : 0).toFixed(2)} m/s
                  </span>
                </span>
              </div>
              <div style={{ color: "#999" }}>
                {startTime.format("LTS ll")} - {endTime.format("LTS ll")}
              </div>
            </div>
          );
        })
      ) : (
        <div className="rhsHelp">
          <Empty />
        </div>
      )}
    </div>
  );
};

export default TripsList;
