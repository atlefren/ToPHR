import json
import os
import sys
import getopt
from globalmaptiles import GlobalMercator
from subprocess import call


def multiplyPoint(x, y, factor):
    return x * factor, y * factor


def center(north, west, south, east):
    lon = (north + south) / 2
    lat = (east + west) / 2
    return lon, lat


def get_distances(bounds, center_lng, center_lat):
    west = bounds[0]
    south = bounds[1]
    east = bounds[2]
    north = bounds[3]

    lng_dist = min(
        abs(center_lng - east),
        abs(center_lng - west)
    )
    lat_dist = min(
        abs(center_lat - south),
        abs(center_lat - north)
    )

    return lng_dist, lat_dist


def should_load(zoom, x, y, tile_bounds, tile_size, bounds):
    nwPoint_x, nwPoint_y = multiplyPoint(x, y, tile_size)
    (se_lat, nw_lon, nw_lat, se_lon) = tile_bounds

    center_lng, center_lat = center(nw_lon, nw_lat, se_lon, se_lat)
    lng_dist, lat_dist = get_distances(bounds, center_lng, center_lat)

    tileWidth = abs(nw_lon - se_lon)
    tileHeight = abs(nw_lat - se_lat)
    return lng_dist < tileWidth and lat_dist < tileHeight


def intersects(b1, b2):
    b3 = (b2[1], b2[0], b2[3], b2[2])

    min_x = b3[1]
    min_y = b3[0]
    max_x = b3[3]
    max_y = b3[2]

    min2_x = b1[1]
    min2_y = b1[0]
    max2_x = b1[3]
    max2_y = b1[2]

    xIntersects = (max2_x >= min_x) and (min2_x <= max_x)
    yIntersects = (max2_y >= min_y) and (min2_y <= max_y)
    return xIntersects and yIntersects


def get_covering_tiles(bounds, min_zoom=0, max_zoom=16):
    mercator = GlobalMercator()
    mx, my = mercator.LatLonToMeters(bounds[1], bounds[0])
    mxmax, mymax = mercator.LatLonToMeters(bounds[3], bounds[2])
    tileSize = 256
    tiles = []
    for zoom in range(min_zoom, max_zoom + 1):
        tminx, tminy = mercator.MetersToTile(mx, my, zoom)
        tmaxx, tmaxy = mercator.MetersToTile(mxmax, mymax, zoom)
        for tx in range(tminx - 1, tmaxx + 2):
            for ty in range(tminy - 1, tmaxy + 2):
                x, y = mercator.GoogleTile(tx, ty, zoom)
                tile_bounds = mercator.TileLatLonBounds(tx, ty, zoom)
                inside = intersects(tile_bounds, bounds)
                if inside or should_load(zoom, x, y, tile_bounds, tileSize, bounds):
                    tiles.append({'x': x, 'y': y, 'z': zoom})
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


def generate_mbtiles(config, export_dir):
    export_dir = export_dir + '/'
    ensure_dir(export_dir)
    bounds = config.get('bounds', None)
    min_zoom = config.get('minZoom', None)
    max_zoom = config.get('maxZoom', None)
    project = config.get('tmProject', None)

    export_dir = export_dir + project + '/'
    ensure_dir(export_dir)

    tiles = get_covering_tiles(bounds, min_zoom, max_zoom)

    filelist_name = export_dir + project + '_tiles.json'
    create_tilemill_file(filelist_name, tiles)

    call([
        'node',
        '/usr/share/tilemill/index.js',
        'export',
        project,
        export_dir + project + '.mbtiles',
        '--scheme=file',
        '--list=' + filelist_name,
        '--verbose=off'
    ])


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
