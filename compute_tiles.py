from globalmaptiles import GlobalMercator
import json


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


def should_load(zoom, x, y, tile_bounds, tile_size):
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


def get_covering_tiles(bounds, maxZoom=0, minZoom=16):
    mercator = GlobalMercator()
    mx, my = mercator.LatLonToMeters(bounds[1], bounds[0])
    mxmax, mymax = mercator.LatLonToMeters(bounds[3], bounds[2])
    tileSize = 256
    tiles = []
    for zoom in range(maxZoom, minZoom + 1):
        tminx, tminy = mercator.MetersToTile(mx, my, zoom)
        tmaxx, tmaxy = mercator.MetersToTile(mxmax, mymax, zoom)
        for tx in range(tminx - 1, tmaxx + 2):
            for ty in range(tminy - 1, tmaxy + 2):
                x, y = mercator.GoogleTile(tx, ty, zoom)
                tile_bounds = mercator.TileLatLonBounds(tx, ty, zoom)
                inside = intersects(tile_bounds, bounds)
                if inside or should_load(zoom, x, y, tile_bounds, tileSize):
                    tiles.append({'x': x, 'y': y, 'z': zoom})
    return tiles


if __name__ == "__main__":
    bounds = [10.1, 63.3, 10.6, 63.5]
    tiles = get_covering_tiles(bounds)
    print json.dumps(tiles, indent=4)
    print len(tiles)
