import React from "react";
import { Alert } from "antd";
import { UnControlled as CodeMirror } from "react-codemirror2";

const sampleCode = `trips = db.session.query(
    Trips.trip_id,
    Trips.trip,
    func.length(Trips.trip),
    func.twAvg(func.speed(Trips.trip))
).filter(
    func.intersects(
      Point(lat, lng).buffer(0.01).wkb,
      Trips.trip
    ),
).all()
`;

const SpatialQueryHelp = () => {
  return (
    <Alert
      message="Spatial Query Mode"
      description={
        <div>
          <p>
            Click on a location on the map to fetch trips going through the
            nearby area
          </p>
          <p>
            A request will then be sent to server to fetch ONLY the trips
            passing through the selected area. This will be acheived by using
            the spatial functions provided by mobilitydb. In the sample code below,
            line 7 is where you can see the <code>intersects</code> function
            is being used to acheive this.
          </p>
          <CodeMirror
            language="python"
            value={sampleCode}
            options={{
              mode: "python",
              lineNumbers: true
            }}
          />
        </div>
      }
    />
  );
};

export default SpatialQueryHelp;
