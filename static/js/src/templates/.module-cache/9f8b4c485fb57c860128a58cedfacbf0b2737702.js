var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};

TOPH.templates.zoomInTemplate =  function (data) {
    return (
        React.createElement("div", {className: "row"}, React.createElement(Notifier, {data: data}))
    );
};

TOPH.templates.noProjectTemplate = function () {
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
};

TOPH.templates.tileDownloaderTemplate = function (data) {
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
              className: data.generateClass, 
              onClick: this.generateTiles
              }, "Ok, Generate them!")
          )
        )
    );
};