var TOPH = this.TOPH || {};
TOPH.setupDownloadGUI = function (map, projects) {
    'use strict';

     React.render(
         <TileDownloader map={map} projects={projects}/>,
         document.getElementById('under')
     );
 };
