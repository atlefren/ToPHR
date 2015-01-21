var TOPH = this.TOPH || {};
TOPH.templates = {
    notifierTemplate: function (data) {
        return (
               React.createElement("div", {className: data.alertClass}, 
                    this.props.data.message
               )
        );
    },

    dataFormTemplate: function () {
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
    },

    downloaderTemplate: function (data) {
        return (
            React.createElement("a", {className: data.hiddenClass, href: data.link}, "Last ned")
        );
    },

    zoomInTemplate: function (data) {
        return (
            React.createElement("div", {className: "row"}, React.createElement(Notifier, {data: data}))
        );
    },

    noProjectTemplate: function () {
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
    },

    tileDownloaderTemplate: function (data) {
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
    },

    projectChooserTemplate: function (data) {
        return (
            React.createElement("div", null, 
            React.createElement("h2", null, "Project:"), 
            React.createElement("select", {onChange: this.onChange, value: this.state.selectedProject}, 
                data.projectNodes
            )
            )
        );
    },

    projectNodeTemplate: function (data) {
        return (
             React.createElement("option", {value: data.project}, data.project)
        );
    }
}; 