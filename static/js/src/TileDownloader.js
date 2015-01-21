var TOPH = this.TOPH || {};
(function (ns) {
    'use strict';
    
    ns.TileDownloader = React.createClass({

        zoomInTemplate: ns.templates.zoomInTemplate,

        noProjectTemplate: ns.templates.noProjectTemplate,

        template: ns.templates.tileDownloaderTemplate,

        componentDidMount: function () {
            this.props.map.on('zoomend', this.zoomChange, this);
            this.zoomChange();
        },

        getInitialState: function () {
            return {
                messageData: {message: ''},
                showGenerate: false,
                project: null,
                canGenerate: false,
                filename: null
            };
        },

        zoomChange: function () {
            this.setState({canGenerate: this.props.map.getZoom() > 11});
        },

        beforeCompute: function (data) {
            var bounds = this.props.map.getBounds().toBBoxString();
            data.bounds = bounds;
            this.setState({
                messageData: {
                    message: 'Computing number of tiles',
                    alertClass: 'info'
                }
            });
            this.data = data;
            this.data.project = this.state.project;
            var tiles = ns.generateTiles(data.bounds, data.minZoom, data.maxZoom);
            this.tilesComputed(tiles);
        },

        tilesComputed: function (tiles) {
            var minZoom = this.data.minZoom;
            var maxZoom = this.data.maxZoom;

            this.setState({
                messageData: {
                    message: "Creating tiles for current bounds from zoom " +  minZoom + " to " + maxZoom + " generates " + tiles.length + " tiles",
                    alertClass: 'info'
                },
                showGenerate: true
            });
        },

        generateTiles: function () {
            if (!this.state.showGenerate) {
                return;
            }
            this.setState({
                messageData: {
                    message: 'Waiting for TileMill to generate tiles',
                    alertClass: 'info'
                },
                showGenerate: false
            });
            $.ajax({
                type: 'POST',
                url: '/generate',
                data: JSON.stringify(this.data),
                success: this.tilesGenerated,
                error: this.tileGenerateError,
                contentType: 'application/json',
                dataType: 'json'
            });
        },

        tilesGenerated: function (data) {
            this.setState({
                messageData: {
                    message: 'Tiles Generated!',
                    alertClass: 'success'
                },
                filename: data.filename
            });
        },

        tileGenerateError: function () {
            this.setState({
                messageData: {
                    message: 'Error generating tiles!',
                    alertClass: 'danger'
                }
            });
        },

        projectChange: function (project) {
            this.setState({
                project: project,
                showGenerate: false,
                messageData: {
                    message: ''
                }
            });
        },

        render: function () {

            if (!this.state.canGenerate) {
                var messageData = {
                    message: "Zoom further in to generate",
                    alertClass: "warning"
                };
                return this.zoomInTemplate(messageData);
            }

            if (!this.state.project || this.state.project === '--') {
                return this.noProjectTemplate();
            }

            var generateClass = 'btn hidden';
            if (this.state.showGenerate) {
                generateClass = 'btn';
            }
            return this.template({generateClass: generateClass});
        }
     });

}(TOPH));
