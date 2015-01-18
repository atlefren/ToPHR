var TOPH = this.TOPH || {};
TOPH.setupDownloadGUI = function (map) {
    'use strict';

     function computeTiles(data, callback) {
         var tiles = TOPH.generateTiles(data.bounds, data.minZoom, data.maxZoom);
         callback(tiles);
     }

     var DataForm = React.createClass({displayName: "DataForm",

         handleSubmit: function(e) {
             e.preventDefault();
             var minZoom = parseInt(this.refs.minZoom.getDOMNode().value, 10);
             var maxZoom = parseInt(this.refs.maxZoom.getDOMNode().value, 10);
             this.props.beforeCompute({
                 minZoom: minZoom,
                 maxZoom: maxZoom
             });
             return;
         },

         render: function() {
             return (
                 React.createElement("form", {className: "form-horizontal", onSubmit: this.handleSubmit}, 
                   React.createElement("div", {className: "form-group"}, 
                     React.createElement("label", {className: "col-sm-4 control-label"}, "MinZoom"), 
                     React.createElement("div", {className: "col-sm-4"}, 
                       React.createElement("input", {type: "int", className: "form-control", defaultValue: "0", ref: "minZoom"})
                     )
                   ), 
                   React.createElement("div", {className: "form-group"}, 
                     React.createElement("label", {className: "col-sm-4 control-label"}, "MaxZoom"), 
                     React.createElement("div", {className: "col-sm-4"}, 
                       React.createElement("input", {type: "int", className: "form-control", defaultValue: "16", ref: "maxZoom"})
                     )
                   ), 
                   React.createElement("div", {className: "form-group"}, 
                     React.createElement("div", {className: "col-sm-10"}, 
                       React.createElement("button", {type: "submit", className: "btn btn-default"}, 
                         "Calculate tiles for current bounds"
                       )
                     )
                   )
                 )
             );
         }
     });

     var TileDownloader = React.createClass({displayName: "TileDownloader",

         getInitialState: function() {
             return {
                 message: '',
                 showGenerate: false
             }
         },

         beforeCompute: function (data) {
             var bounds = this.props.map.getBounds().toBBoxString();
             data.bounds = bounds;
             this.setState({
                 message: 'Computing number of tiles'
             });
             this.data = data;
             computeTiles(data, this.tilesComputed);
         },

         tilesComputed: function (tiles) {
             var minZoom = this.data.minZoom;
             var maxZoom = this.data.maxZoom;
             var bounds = this.data.bounds;

             this.setState({
                 message: "Creating tiles for current bounds from zoom " +  minZoom + " to " + maxZoom + " generates " + tiles.length + " tiles",
                 showGenerate: true
             });
         },

         generateTiles: function () {
             if (!this.state.showGenerate) {
                 return;
             }
             this.setState({
                 message: 'Waiting for TileMill to generate tiles',
                 showGenerate: false
             });

             $.ajax({
                 type: 'POST',
                 url: '/generate',
                 data: JSON.stringify(this.data),
                 success: this.tilesGenerated,
                 contentType: 'application/json',
                 dataType: 'json'
             });
         },

         tilesGenerated: function () {
             this.setState({
                 message: 'Tiles Generated!'
             });
         },

         render: function() {
             var generateClass = 'btn hidden';
             if (this.state.showGenerate) {
                 generateClass = 'btn';
             }
             return (
                 React.createElement("div", {className: "row"}, 
                   React.createElement("div", {className: "col-xs-4"}, 
                     React.createElement(DataForm, {beforeCompute: this.beforeCompute})
                   ), 
                   React.createElement("div", {className: "col-xs-8"}, 
                     React.createElement("div", null, this.state.message), 
                     React.createElement("button", {
                       className: generateClass, 
                       onClick: this.generateTiles
                       }, "Ok, Generate them!")
                   )
                 )
             );
         }
     });

     React.render(
         React.createElement(TileDownloader, {map: map}),
         document.getElementById('under')
     );
 };
