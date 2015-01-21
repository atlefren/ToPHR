var TOPH = this.TOPH || {};
TOPH.setupDownloadGUI = function (map, projects) {
    'use strict';

     React.render(
         React.createElement(TileDownloader, {map: map, projects: projects}),
         document.getElementById('under')
     );
 };
