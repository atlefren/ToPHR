from globalmaptiles import GlobalMercator

mercator = GlobalMercator()


# helper classes
class Point(object):
    def __init__(self, x, y):
        self.x = x
        self.y = y


class LatLon(object):
    def __init__(self, lat, lon):
        self.lat = lat
        self.lon = lon


class Bounds(object):
    def __init__(self, minx, miny, maxx, maxy):
        self.minx = minx
        self.miny = miny
        self.maxx = maxx
        self.maxy = maxy

    def intersects(self, other):
        x_intersects = (self.maxx >= other.minx) and (self.minx <= other.maxx)
        y_intersects = (self.maxy >= other.miny) and (self.miny <= other.maxy)
        return x_intersects and y_intersects

    def center(self):
        lat = (self.maxy + self.miny) / 2
        lon = (self.maxx + self.minx) / 2
        return LatLon(lat, lon)

    def width(self):
        return abs(self.maxx - self.minx)

    def height(self):
        return abs(self.maxy - self.miny)


# globalmaptiles wrappers
def meters_to_tile(point, zoom):
    x, y = mercator.MetersToTile(point.x, point.y, zoom)
    return Point(x, y)


def latlon_to_meters(latlon):
    x, y = mercator.LatLonToMeters(latlon.lat, latlon.lon)
    return Point(x, y)


def to_google_tile(tile_point, zoom):
    x, y = mercator.GoogleTile(tile_point.x, tile_point.y, zoom)
    return Point(x, y)


def get_tile_latlon_bounds(tpoint, zoom):
    (minLat, minLon, maxLat, maxLon) = mercator.TileLatLonBounds(
        tpoint.x,
        tpoint.y,
        zoom
    )
    return Bounds(minLon, minLat, maxLon, maxLat)


# internal calculations
def get_distances(bounds, center):
    lng_dist = min(
        abs(center.lon - bounds.maxx),
        abs(center.lon - bounds.minx)
    )
    lat_dist = min(
        abs(center.lat - bounds.miny),
        abs(center.lat - bounds.maxy)
    )

    return lng_dist, lat_dist


def is_within(tile_bounds, bounds):
    center = tile_bounds.center()
    lng_dist, lat_dist = get_distances(bounds, center)
    return lng_dist < tile_bounds.width() and lat_dist < tile_bounds.height()


def should_include(tpoint, zoom, area_bounds):
    tile_bounds = get_tile_latlon_bounds(tpoint, zoom)
    intersects = tile_bounds.intersects(area_bounds)
    within_distance = is_within(tile_bounds, area_bounds)
    return intersects or within_distance


def get_covering_tiles(bounds, min_zoom=0, max_zoom=16):

    mmin = latlon_to_meters(LatLon(bounds[1], bounds[0]))
    mmax = latlon_to_meters(LatLon(bounds[3], bounds[2]))

    area_bounds = Bounds(bounds[0], bounds[1], bounds[2], bounds[3])
    tiles = []
    for zoom in range(min_zoom, max_zoom + 1):
        tmin = meters_to_tile(mmin, zoom)
        tmax = meters_to_tile(mmax, zoom)
        for tx in range(tmin.x - 1, tmax.x + 2):
            for ty in range(tmin.y - 1, tmax.y + 2):
                tpoint = Point(tx, ty)
                if should_include(tpoint, zoom, area_bounds):
                    gpoint = to_google_tile(tpoint, zoom)
                    tiles.append({'x': gpoint.x, 'y': gpoint.y, 'z': zoom})
    return tiles
