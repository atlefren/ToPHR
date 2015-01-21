var ProjectChooser = React.createClass({

    getInitialState: function () {
        return {
            selectedProject: '--'
        };
     },

    onChange: function (e) {
        var project = e.target.value;
        this.setState({selectedProject: project});
        this.props.projectChange(project);
    },

    render: function () {
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
