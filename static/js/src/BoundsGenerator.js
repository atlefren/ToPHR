/*global L:false*/
var TOPH = this.TOPH || {};
(function (ns) {
    'use strict';

    var tileSize = 256;
    var initialResolution = 2 * Math.PI * 6378137 / tileSize;
    var originShift = 2 * Math.PI * 6378137 / 2.0;


    function latLngToMeters(latLng) {
        var x = latLng.lng * originShift / 180.0;
        var y = Math.log(Math.tan((90 + latLng.lat) * Math.PI / 360.0)) / (Math.PI / 180.0);

        y = y * originShift / 180.0;
        return L.point(x, y);
    }


    function getResolution(zoom) {
        return initialResolution / Math.pow(2, zoom);
    }


    function metersToPixels(m, zoom) {
        var res = getResolution(zoom);
        var px = (m.x + originShift) / res;
        var py = (m.y + originShift) / res;
        return L.point(px, py);
    }


    function pixelsToTile(p) {
        var x = Math.ceil(p.x / tileSize) - 1;
        var y = Math.ceil(p.y / tileSize) - 1;
        return L.point(x, y);
    }


    function metersToTile(point, zoom) {
        var p = metersToPixels(point, zoom);
        return pixelsToTile(p);
    }


    function pixelsToMeters(p, zoom) {
        var res = getResolution(zoom);
        var x = p.x * res - originShift;
        var y = p.y * res - originShift;
        return L.point(x, y);
    }


    function tileBounds(t, zoom) {
        var min = pixelsToMeters(L.point(t.x * tileSize, t.y * tileSize), zoom);
        var max = pixelsToMeters(L.point((t.x + 1) * tileSize, (t.y + 1) * tileSize), zoom);
        return [min.x, min.y, max.x, max.y];
    }


    function metersToLatLon(m) {
        var lon = (m.x / originShift) * 180.0;
        var lat = (m.y / originShift) * 180.0;
        lat = 180 / Math.PI * (2 * Math.atan(Math.exp(lat * Math.PI / 180.0)) - Math.PI / 2.0);
        return L.latLng(lat, lon);
    }


    function getTileLatlonBounds(tpoint, zoom) {
        var bounds = tileBounds(tpoint, zoom);
        var min = metersToLatLon(L.point(bounds[0], bounds[1]));
        var max = metersToLatLon(L.point(bounds[2], bounds[3]));
        return L.latLngBounds(min, max);
    }


    function toGoogleTile(p, zoom) {
        var y = Math.pow(2, zoom) - 1 - p.y;
        return L.point(p.x, y);
    }


    function latLngBoundsFromArr(arr) {
        return L.latLngBounds(L.latLng(arr[1], arr[0]), L.latLng(arr[3], arr[2]));
    }


    function getDistances(bounds, center) {
        var lngDist = Math.min(
            Math.abs(center.lng - bounds.getEast()),
            Math.abs(center.lng - bounds.getWest())
        );
        var latDist = Math.min(
            Math.abs(center.lat - bounds.getSouth()),
            Math.abs(center.lat - bounds.getNorth())
        );

        return [lngDist, latDist];
    }


    function isWithin(tBounds, bounds) {
        var center = tBounds.getCenter();
        var dist = getDistances(bounds, center);
        var lng_dist = dist[0];
        var lat_dist = dist[1];
        var width = Math.abs(tBounds.getEast() - tBounds.getWest());
        var height = Math.abs(tBounds.getSouth() - tBounds.getNorth());
        return lng_dist < width && lat_dist < height;
    }


    function shouldInclude(tpoint, zoom, areaBounds) {
        var tBounds = getTileLatlonBounds(tpoint, zoom);
        var intersects = tBounds.intersects(areaBounds);
        if (intersects) {
            return true;
        }
        return isWithin(tBounds, areaBounds);
    }


    function getCoveringTiles(bounds, minZoom, maxZoom) {
        var mmin = latLngToMeters(L.latLng(bounds[1], bounds[0]));
        var mmax = latLngToMeters(L.latLng(bounds[3], bounds[2]));
        var areaBounds = latLngBoundsFromArr(bounds);

        var zoomRange = _.range(minZoom, maxZoom + 1);
        return _.chain(zoomRange)
            .map(function (zoom) {
                var tmin = metersToTile(mmin, zoom);
                var tmax = metersToTile(mmax, zoom);
                var xRange = _.range(tmin.x - 1, tmax.x + 2);
                var yRange = _.range(tmin.y - 1, tmax.y + 2);
                return _.map(xRange, function (tx) {
                    return _.map(yRange, function (ty) {
                        var tpoint = L.point(tx, ty);
                        if (shouldInclude(tpoint, zoom, areaBounds)) {
                            var gTile = toGoogleTile(tpoint, zoom);
                            return {z: zoom, y: gTile.y, x: gTile.x};
                        }
                        return null;
                    });
                });
            })
            .flatten()
            .compact()
            .value();
    }


    ns.generateTiles = function (boundsString, minZoom, maxZoom) {
        var bounds = _.map(boundsString.split(','), parseFloat);
        return getCoveringTiles(bounds, minZoom, maxZoom);
    };


}(TOPH));
