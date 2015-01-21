var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.projectChooserTemplate =  function (data) {
    return (
        <div>
        <h2>Project:</h2>
        <select onChange={this.onChange} value={this.state.selectedProject}>
            {data.projectNodes}
        </select>
        </div>
    );
};

TOPH.templates.projectNodeTemplate = function (data) {
    return (
         <option value={data.project}>{data.project}</option>
    );
};