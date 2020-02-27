This is the backend part of MobilityDB-SQLAlchemy Demo App. Ideally, it is better to run the complete demo together with frontend and the database using docker-compose, as described in the README at the project root level. If you do just want to run the backend, run `pip install -r requirements` (preferably in a new virtual env) followed by `FLASK_APP=main.py flask run` from this directory.

`model.py` contains example of how an SQLAlchemy model can be defined with a column type defined in mobilitydb using [mobilitydb-sqlalchemy](https://github.com/adonmo/mobilitydb-sqlalchemy).

`main.py` has example of how queries can be run over these models, with usage of functions defined in mobilitydb included.

Additionally, `main.py` also has an example for serializing trajectory data using the python library [trajectory](https://github.com/adonmo/trajectory).
