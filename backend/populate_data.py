import csv
import datetime
from collections import defaultdict

import pandas as pd
from shapely.geometry import Point

from main import app
from models import db, Trips


trips_data = defaultdict(list)

with open("go_track_trackspoints.csv") as csvfile:
    csvreader = csv.reader(csvfile)
    first_row = True
    for row in csvreader:
        if first_row:
            first_row = False
            continue

        trip_id, lat, lng, time = int(row[3]), float(row[1]), float(row[2]), datetime.datetime.strptime(row[4], '%Y-%m-%d %H:%M:%S')
        trips_data[trip_id].append({"geometry": Point(lat, lng), "t": time})

with app.app_context():
    db.drop_all()
    db.create_all()

    print("Trying to populate {} rows".format(len(trips_data)))

    for trip_id in trips_data:
        try:
            df = pd.DataFrame(trips_data[trip_id]).set_index("t")
            trip = Trips(trip_id=trip_id, trip=df,)
            db.session.add(trip)
            db.session.commit()
        except:
            print("Couldn't save trip #{} of length {}".format(trip_id, len(trips_data[trip_id])))
