 var TileDownloader = React.createClass({displayName: "TileDownloader",

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
        var tiles = TOPH.generateTiles(data.bounds, data.minZoom, data.maxZoom);
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
        console.log(data);
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
            return (React.createElement("div", {className: "row"}, React.createElement(Notifier, {data: messageData})));
        }

        if (!this.state.project || this.state.project === '--') {
            return (
               React.createElement("div", {className: "row"},
                   React.createElement("div", {className: "col-xs-2"},
                       React.createElement(ProjectChooser, {
                           projects: this.props.projects,
                           projectChange: this.projectChange}
                       )
                   )
               )
           );
        }


        var generateClass = 'btn hidden';
        if (this.state.showGenerate) {
            generateClass = 'btn';
        }
        return (
            React.createElement("div", {className: "row"},
              React.createElement("div", {className: "col-xs-2"},
               React.createElement(ProjectChooser, {
                   projects: this.props.projects,
                   projectChange: this.projectChange}
               )
              ),
              React.createElement("div", {className: "col-xs-2"},
                React.createElement(DataForm, {beforeCompute: this.beforeCompute})
              ),
              React.createElement("div", {className: "col-xs-8"},
                React.createElement(Notifier, {data: this.state.messageData}),
                React.createElement(Downloader, {filename: this.state.filename}),
                React.createElement("button", {
                  className: generateClass,
                  onClick: this.generateTiles
                  }, "Ok, Generate them!")
              )
            )
        );
    }
 });
