import { GithubOutlined } from '@ant-design/icons';
import { Alert, Col, Row, Select, Slider } from "antd";
import moment from "moment";
import React, { useEffect, useState } from "react";
import { Circle, Map, TileLayer } from "react-leaflet";
import "./App.css";
import SpatialQueryHelp from "./components/SpatialQueryHelp";
import TimeFilteredTrace from "./components/TimeFilteredTrace";
import TripsList from "./components/TripsList";
import { useTrips, useTripsBySpatialQuery } from "./hooks/trips";
import { makeSmartSetState } from "./hooks/utils";

function App() {
  const ALL_TRIPS = 0,
    SPATIAL_QUERY = 1,
    mapCenter = [-10.94, -37.07],
    mapZoom = 13;
  const { trips, loading: loadingTrips } = useTrips();
  const [selectedMode, setSelectedMode] = useState(ALL_TRIPS);
  const [selectedTrip, setSelectedTrip] = useState();
  const [timeSlider, _setTimeSlider] = useState({
    minT: moment("4/11/2015"),
    maxT: moment("5/11/2015"),
    minSelectedT: moment("4/11/2015"),
    maxSelectedT: moment("5/11/2015")
  });
  const setTimeSlider = makeSmartSetState(_setTimeSlider, timeSlider);
  const [mouseLocation, setMouseLocation] = useState(mapCenter);
  const [selectedLocation, setSelectedLocation] = useState([0, 0]);
  const { trips: sqTrips, loading: sqLoadingTrips } = useTripsBySpatialQuery(
    selectedLocation
  );

  useEffect(() => {
    const allTimestamps = trips
      .map(t => t.trajectory)
      .reduce((agg, curr) => [...agg, ...curr.map(t => t[2])], []);
    const minT = moment(1000 * Math.min(...allTimestamps));
    const maxT = moment(1000 * Math.max(...allTimestamps));
    setTimeSlider({
      minT,
      maxT,
      minSelectedT: minT,
      maxSelectedT: maxT
    });
  }, [trips]);

  const uiTrips = selectedMode === ALL_TRIPS ? trips : sqTrips;

  return (
    <div className="App">
      <Row>
        <Col md={16}>
          <div className="modeAndTime">
            <Select value={selectedMode} onChange={setSelectedMode}>
              <Select.Option value={ALL_TRIPS}>All Trips</Select.Option>
              <Select.Option value={SPATIAL_QUERY}>Spatial Query</Select.Option>
            </Select>
            <Slider
              range
              min={timeSlider.minT}
              max={timeSlider.maxT}
              value={[timeSlider.minSelectedT, timeSlider.maxSelectedT]}
              onChange={([minSelectedT, maxSelectedT]) =>
                setTimeSlider({ minSelectedT, maxSelectedT })
              }
              tipFormatter={e => moment(e).format("LTS ll")}
              style={{userSelect: "none"}}
            />
            <a className="github" target="_blank" href="https://github.com/adonmo/mobilitydb-sqlalchemy-demo">
              <GithubOutlined />
            </a>
          </div>

          <Map
            style={{ height: "90vh" }}
            center={mapCenter}
            zoom={mapZoom}
            onMouseMove={e => setMouseLocation([e.latlng.lat, e.latlng.lng])}
            onClick={e =>
              selectedMode === SPATIAL_QUERY &&
              setSelectedLocation([e.latlng.lat, e.latlng.lng])
            }
          >
            <TileLayer
              attribution='&amp;copy <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            {uiTrips.map((trip, idx) => (
              <TimeFilteredTrace
                trip={trip}
                idx={idx}
                minSelectedT={timeSlider.minSelectedT}
                maxSelectedT={timeSlider.maxSelectedT}
                selected={idx === selectedTrip}
              />
            ))}
            {selectedMode === SPATIAL_QUERY && (
              <Circle center={mouseLocation} radius={1000} fillColor={"blue"} />
            )}
          </Map>
          <Alert
            message="Hint: Tune sliders at the top, and hover over the trip list on
            the right to see something in action"
            type="info"
            style={{margin: 8}}
            showIcon
          />
        </Col>
        <Col md={8}>
          {selectedMode === ALL_TRIPS || sqTrips.length ? (
            <TripsList
              trips={uiTrips}
              selectedTrip={selectedTrip}
              onSelectedTripChange={setSelectedTrip}
              loading={loadingTrips || sqLoadingTrips}
            />
          ) : (
            <div className="rhsHelp">
              <SpatialQueryHelp />
            </div>
          )}
        </Col>
      </Row>
    </div>
  );
}

export default App;
