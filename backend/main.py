import os
import traceback

from flask import Flask, jsonify, request
from flask_cors import CORS
from sqlalchemy import func
from shapely.geometry.point import Point

from models import db, Trips
from utils import serialize_trajectory

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = os.environ.get('DATABASE_URL')
db.init_app(app)
CORS(app)

DATA_UNINITIALIZED_ERROR = "Data hasn't been initialized yet. Please run 'docker-compose run backend python populate_data.py'"


def _trips_by_filter_criteria(filters):
    try:
        trips = db.session.query(
            Trips.trip_id,
            # This is our actual trip data (spatiotemporal data)
            Trips.trip,
            # Example usage of mobilitydb function - length gets us the distance travelled within this trip
            func.length(Trips.trip),
            # Another example - average of point wise speeds during this trip, shows how you can composite functions together
            func.twAvg(func.speed(Trips.trip))
        ).filter(
            *filters,
        ).all()
    except:
        traceback.print_exc()
        return jsonify({"errors": [DATA_UNINITIALIZED_ERROR]}), 400

    return jsonify({
        "trips": [
            {
                "id": trip_id,
                "trajectory": serialize_trajectory(trip),
                "distance": distance,
                "speed": speed,
            }
            for trip_id, trip, distance, speed in trips
        ]
    })


@app.route('/mobilitydb_sqlalchemy_demo/get_all_trips')
def all_trips():
    # Get trips without adding any filters (we get all trips)
    return _trips_by_filter_criteria([])


@app.route('/mobilitydb_sqlalchemy_demo/get_trips_by_spatial_query')
def trips_by_spatial_query():
    lat = float(request.args.get("lat"))
    lng = float(request.args.get("lng"))

    return _trips_by_filter_criteria([
        func.intersects(Point(lat, lng).buffer(0.01).wkb, Trips.trip),
    ])


@app.route('/mobilitydb_sqlalchemy_demo/ping')
def ping():
    """This is just here so that we can deploy this on a provider who needs a health check endpoint"""
    return "OK"
