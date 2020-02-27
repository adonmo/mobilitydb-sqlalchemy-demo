import trajectory


def serialize_trajectory(trip):
    return trajectory.encode([
        (p[1].x, p[1].y, p[0].timestamp())
        for p in trip.reset_index().values.tolist()
    ])
