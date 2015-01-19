var TOPH = this.TOPH || {};
TOPH.setupDownloadGUI = function (map, projects) {
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

    var Notifier = React.createClass({displayName: "Notifier",
        render: function () {
            if (this.props.data.message === '') {
                return (React.createElement("div", null));
            }
            var alertClass = 'alert alert-' + this.props.data.alertClass;
            return (
                React.createElement("div", {className: alertClass}, this.props.data.message)
            );
        }
    });

    var ProjectChooser = React.createClass({displayName: "ProjectChooser",

        getInitialState: function() {
             return {
                 selectedProject: '--'
             }
         },

        onChange: function(e) {
            var project = e.target.value;
            this.setState({selectedProject: project});
            this.props.projectChange(project);
        },

        render: function() {
            var projects = _.clone(this.props.projects);
            projects.unshift('--');
            var projectNodes = projects.map(function (project) {
                return (
                    React.createElement("option", {value: project}, project)
                );
            }, this);
            return (
                React.createElement("div", null, 
                React.createElement("h2", null, "Project:"), 
                React.createElement("select", {onChange: this.onChange, value: this.state.selectedProject}, 
                    projectNodes
                )
                )
            );
        }
    });

     var TileDownloader = React.createClass({displayName: "TileDownloader",

         getInitialState: function() {
             return {
                 messageData: {message: ''},
                 showGenerate: false,
                 project: null
             }
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
             computeTiles(data, this.tilesComputed);
         },

         tilesComputed: function (tiles) {
             var minZoom = this.data.minZoom;
             var maxZoom = this.data.maxZoom;
             var bounds = this.data.bounds;

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

         tilesGenerated: function () {
            this.setState({
                messageData: {
                    message: 'Tiles Generated!',
                    alertClass: 'success'
                }
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

         render: function() {
             var generateClass = 'btn hidden';
             if (this.state.showGenerate) {
                 generateClass = 'btn';
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
         React.createElement(TileDownloader, {map: map, projects: projects}),
         document.getElementById('under')
     );
 };
