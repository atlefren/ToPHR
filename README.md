ToPHR (Tower of Prince Henry, Reversed)
=======================================

Inspired by this FOSS4G-talk: http://vimeo.com/106873780

An attempt to use small tilesets to focus on a limited area. 

For now I have a custom Leaflet-layer that determines what tiles to load, 
and a pyhton-script to compute and generate what tiles to generate in order to focus on a given area. 


Usage
-----

### Generating tiles

* This probably only works on linux, and has been tested using TileMill Version 0.10.2 (v0.10.1-293-g697c86c)
* /usr/share/tilemill/index.js should be available

* Edit the the config.json file provided 
   * bounds: EPSG:4326 coords: [southwest_lng, southwest_lat, northeast_lng, northeast_lat])
   * tmProject: name of the TileMill project you want to generate tiles for

* run python tiles.py
   * use -c to specify different config file


###Using the tiles
* get your tiles readable through some servide
    * ```pip install tilestache```
    * ```tilestache-server.py -c ts.cfg``` should work if you edit ts.cfg
* look at index.html for how to create a map
