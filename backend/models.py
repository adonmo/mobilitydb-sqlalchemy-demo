from flask_sqlalchemy import SQLAlchemy
from mobilitydb_sqlalchemy import TGeomPoint

db = SQLAlchemy()


class Trips(db.Model):
    __tablename__ = "trips"
    trip_id = db.Column(db.Integer, primary_key=True)
    trip = db.Column(TGeomPoint)
