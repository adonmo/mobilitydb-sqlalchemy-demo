import "whatwg-fetch";
import trajectory from "trajectory.js";
import React from "react";
import { Modal } from "antd";

export const BASE_URL =
  process.env.REACT_APP_BASE_URL || "http://localhost:7331";

export async function fetchAllTrips() {
  const path = `${BASE_URL}/mobilitydb_sqlalchemy_demo/get_all_trips`;
  let response = await _get(path, "");
  if (!response.errors) {
    response.trips.forEach(
      (l, i) => (response.trips[i].trajectory = trajectory.decode(l.trajectory))
    );
  }
  return response;
}

export async function fetchTripsBySpatialQuery({lat, lng}) {
  const queryParams = _makeQueryParams({lat, lng});
  const path = `${BASE_URL}/mobilitydb_sqlalchemy_demo/get_trips_by_spatial_query?` + queryParams;
  let response = await _get(path, "");
  if (!response.errors) {
    response.trips.forEach(
      (l, i) => (response.trips[i].trajectory = trajectory.decode(l.trajectory))
    );
  }
  return response;
}

async function _get(path, token) {
  var headers = new Headers();
  headers.append("Authorization", "Bearer " + token);

  var init = {
    method: "GET",
    headers: headers,
    mode: "cors",
    cache: "default"
  };

  let callResponse = { ok: false };

  let response = await fetch(path, init);
  if (response.status === 410) {
    Modal.info({
      title: "Backend no longer active.",
      content: (
        <span>
          Please run the app yourself using the instructions and the code{" "}
          <a href="https://github.com/adonmo/mobilitydb-sqlalchemy-demo">
            published on GitHub
          </a>
          .
        </span>
      )
    });
    return {trips: []};
  }
  callResponse = await response
    .json()
    .then(response => {
      return response;
    })
    .catch(console.error);

  return callResponse;
}

function _makeQueryParams(params) {
  var esc = encodeURIComponent;
  return Object.keys(params)
    .map(k => `${esc(k)}=${esc(params[k])}`)
    .join("&");
}
