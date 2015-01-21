var ProjectChooser = React.createClass({displayName: "ProjectChooser",

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
