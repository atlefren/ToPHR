var TOPH = this.TOPH || {};
TOPH.setupDownloadGUI = function (map, projects) {
    'use strict';

     React.render(
         React.createElement(TOPH.TileDownloader, {map: map, projects: projects}),
         document.getElementById('under')
     );
 };
