var Notifier = React.createClass({

    template: TOPH.templates.notifierTemplate,

    render: function () {
        if (this.props.data.message === '') {
            return React.createElement('div', null);
        }
        var alertClass = 'alert alert-' + this.props.data.alertClass;
        return this.template({alertClass: alertClass});
    }
});
