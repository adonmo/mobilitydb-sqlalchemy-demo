import { message } from "antd";
import { useEffect, useState } from "react";
import { fetchAllTrips, fetchTripsBySpatialQuery } from "../api";

export const useTrips = () => {
  const defaultState = { trips: [], loading: false };
  const [{ trips, loading }, setTrips] = useState(defaultState);

  useEffect(() => {
    setTrips({ ...defaultState, loading: true });
    fetchAllTrips()
      .then(response => {
        if (!response.errors) {
          setTrips({ trips: response.trips, loading: false });
        } else {
          setTrips(defaultState);
          message.error(response.errors);
        }
      })
      .catch(err => {
        setTrips(defaultState);
        console.error(err);
        message.error("Failed to fetch trips data!");
      });
  }, []);

  return { trips, loading };
};

export const useTripsBySpatialQuery = selectedLocation => {
  const defaultState = { trips: [], loading: false };
  const [{ trips, loading }, setTrips] = useState(defaultState);

  useEffect(() => {
    if (!selectedLocation[0]) return;
    setTrips({ ...defaultState, loading: true });
    fetchTripsBySpatialQuery({
      lat: selectedLocation[0],
      lng: selectedLocation[1]
    })
      .then(response => {
        if (!response.errors) {
          setTrips({ trips: response.trips, loading: false });
        } else {
          setTrips(defaultState);
          message.error(response.errors);
        }
      })
      .catch(err => {
        setTrips(defaultState);
        console.error(err);
        message.error("Failed to fetch trips data!");
      });
  }, [selectedLocation]);

  return { trips, loading };
};
