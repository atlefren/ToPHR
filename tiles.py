import json
import os
import sys
import getopt
from globalmaptiles import GlobalMercator
#from subprocess import call
from subprocess import Popen, PIPE

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


def create_tilemill_file(filename, tiles):
    with open(filename, 'w') as f:
        for tile in tiles:
            f.write('%s\n' % json.dumps(tile))


def read_json_file(filename):
    with open(filename, 'r') as f:
        return json.loads(f.read())


def ensure_dir(directory):
    if not os.path.exists(directory):
        os.makedirs(directory)


def generate(export_dir, bounds, min_zoom, max_zoom, project, name):
    export_dir = export_dir + '/'
    ensure_dir(export_dir)
    export_dir = export_dir + name + '/'
    ensure_dir(export_dir)

    tiles = get_covering_tiles(bounds, min_zoom, max_zoom)

    filelist_name = export_dir + name + '_tiles.json'
    create_tilemill_file(filelist_name, tiles)

    p = Popen([
        'node',
        '/usr/share/tilemill/index.js',
        'export',
        project,
        export_dir + name + '.mbtiles',
        '--scheme=file',
        '--list=' + filelist_name,
        '--verbose=off'
    ], stdin=PIPE, stdout=PIPE, stderr=PIPE)

    for line in iter(p.stdout.readline, ''):
        print line


def generate_mbtiles(config, export_dir):
    bounds = config.get('bounds', None)
    min_zoom = config.get('minZoom', None)
    max_zoom = config.get('maxZoom', None)
    project = config.get('tmProject', None)
    name = config.get('name', project)
    generate(export_dir, bounds, min_zoom, max_zoom, project, name)


def parse_params(argv):
    configfile = 'config.json'
    outputdir = 'export'
    usage = 'tiles.py -c <config.json> -o <output_directory>'
    try:
        opts, args = getopt.getopt(argv, 'hc:o:', ['config=', 'odir='])
    except getopt.GetoptError:
        print usage
        sys.exit(2)
    for opt, arg in opts:
        if opt == '-h':
            print usage
            sys.exit()
        elif opt in ('-c', '--config'):
            configfile = arg
        elif opt in ('-o', '--odir'):
            outputdir = arg
    return configfile, outputdir

if __name__ == '__main__':
    os.environ['NODE_ENV'] = 'production'
    configfile, outputdir = parse_params(sys.argv[1:])
    config = read_json_file(configfile)
    generate_mbtiles(config, outputdir)
