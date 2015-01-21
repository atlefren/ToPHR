var TOPH = this.TOPH || {};
TOPH.setupDownloadGUI = function (map, projects) {
    'use strict';

     function computeTiles(data, callback) {
         var tiles = TOPH.generateTiles(data.bounds, data.minZoom, data.maxZoom);
         callback(tiles);
     }

     var DataForm = React.createClass({

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
                 <form className="form-horizontal" onSubmit={this.handleSubmit}>
                   <div className="form-group">
                     <label className="col-sm-4 control-label">MinZoom</label>
                     <div className="col-sm-4">
                       <input type="int" className="form-control" defaultValue="0" ref="minZoom" />
                     </div>
                   </div>
                   <div className="form-group">
                     <label className="col-sm-4 control-label">MaxZoom</label>
                     <div className="col-sm-4">
                       <input type="int" className="form-control" defaultValue="16" ref="maxZoom" />
                     </div>
                   </div>
                   <div className="form-group">
                     <div className="col-sm-10">
                       <button type="submit" className="btn btn-default">
                         Calculate tiles for current bounds
                       </button>
                     </div>
                   </div>
                 </form>
             );
         }
     });

    var Notifier = React.createClass({
        render: function () {
            if (this.props.data.message === '') {
                return (<div></div>);
            }
            var alertClass = 'alert alert-' + this.props.data.alertClass;
            return (
                <div className={alertClass}>{this.props.data.message}</div>
            );
        }
    });

    var ProjectChooser = React.createClass({

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
                    <option value={project}>{project}</option>
                );
            }, this);
            return (
                <div>
                <h2>Project:</h2>
                <select onChange={this.onChange} value={this.state.selectedProject}>
                    {projectNodes}
                </select>
                </div>
            );
        }
    });

     var TileDownloader = React.createClass({

        componentDidMount: function() {
            this.props.map.on('zoomend', this.zoomChange, this);
            this.zoomChange();
        },

         getInitialState: function() {
             return {
                 messageData: {message: ''},
                 showGenerate: false,
                 project: null,
                 canGenerate: false
             }
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

             if (!this.state.canGenerate) {
                var messageData = {
                    message: "Zoom further in to generate",
                    alertClass: "warning"
                };
                return (<div className="row"><Notifier data={messageData} /></div>);
             }

             if (!this.state.project || this.state.project === '--') {
                return (
                    <div className="row">
                        <div className="col-xs-2">
                            <ProjectChooser
                                projects={this.props.projects}
                                projectChange={this.projectChange}
                            />
                        </div>
                    </div>
                );
             }

             return (
                 <div className="row">
                   <div className="col-xs-2">
                    <ProjectChooser
                        projects={this.props.projects}
                        projectChange={this.projectChange}
                    />
                   </div>
                   <div className="col-xs-2">
                     <DataForm beforeCompute={this.beforeCompute}/>
                   </div>
                   <div className="col-xs-8">
                     <Notifier data={this.state.messageData} />
                     <button
                       className={generateClass}
                       onClick={this.generateTiles}
                       >Ok, Generate them!</button>
                   </div>
                 </div>
             );
         }
     });

     React.render(
         <TileDownloader map={map} projects={projects}/>,
         document.getElementById('under')
     );
 };
