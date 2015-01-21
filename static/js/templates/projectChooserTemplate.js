var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.projectChooserTemplate =  function (data) {
    return (
        React.createElement("div", null, 
        React.createElement("h2", null, "Project:"), 
        React.createElement("select", {onChange: this.onChange, value: this.state.selectedProject}, 
            data.projectNodes
        )
        )
    );
};

TOPH.templates.projectNodeTemplate = function (data) {
    return (
         React.createElement("option", {value: data.project}, data.project)
    );
};