var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.dataFormTemplate = function () {
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
};