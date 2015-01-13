        L.BoundedTileLayer = L.TileLayer.extend({

            _tileShouldBeLoaded: function (tilePoint) {
                if ((tilePoint.x + ':' + tilePoint.y) in this._tiles) {
                    return false; // already loaded
                }

                var options = this.options;

                if (!options.continuousWorld) {
                    var limit = this._getWrapTileNum();

                    // don't load if exceeds world bounds
                    if ((options.noWrap && (tilePoint.x < 0 || tilePoint.x >= limit.x)) ||
                        tilePoint.y < 0 || tilePoint.y >= limit.y) { return false; }
                }

                if (options.bounds) {
                    var tileSize = options.tileSize,
                        nwPoint = tilePoint.multiplyBy(tileSize),
                        sePoint = nwPoint.add([tileSize, tileSize]),
                        nw = this._map.unproject(nwPoint),
                        se = this._map.unproject(sePoint);

                    var tileCenter = L.latLngBounds([nw, se]).getCenter();

                    // TODO temporary hack, will be removed after refactoring projections
                    // https://github.com/Leaflet/Leaflet/issues/1618
                    if (!options.continuousWorld && !options.noWrap) {
                        nw = nw.wrap();
                        se = se.wrap();
                    }

                    //the tile intersects the bounds: load it
                    if (options.bounds.intersects([nw, se])) {
                        return true;
                    }

                    //the distance from the tilecenter lng to closest bounds edge
                    var lngDist = Math.min(
                        Math.abs(tileCenter.lng - options.bounds.getEast()),
                        Math.abs(tileCenter.lng - options.bounds.getWest())
                    );

                    //the distance from the tilecenter lat to closest bounds edge
                    var latDist =  Math.min(
                        Math.abs(tileCenter.lat - options.bounds.getSouth()),
                        Math.abs(tileCenter.lat - options.bounds.getNorth())
                    );

                    //these are probably equal
                    var tileWidth = Math.abs(nw.lng - se.lng);
                    var tileHeight = Math.abs(nw.lat - se.lat);

                    //special case for zoom = 0
                    if (lngDist === 0 && latDist === 0) {
                        return true;
                    }

                    //check if tile should be loaded
                    return lngDist < tileWidth && latDist < tileHeight;
                }

                return true;
            }
        });

        L.boundedTileLayer = function (url, options) {
            return new L.BoundedTileLayer(url, options);
        };
