var ProjectChooser = React.createClass({

    template: TOPH.templates.projectChooserTemplate,

    projectNodeTemplate: TOPH.templates.projectNodeTemplate,

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
            return this.projectNodeTemplate({project: project});
        }, this);
        return this.template({projectNodes: projectNodes});
    }
});
