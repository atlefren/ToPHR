var Notifier = React.createClass({displayName: "Notifier",
    render: function () {
        if (this.props.data.message === '') {
            return (React.createElement("div", null));
        }
        var alertClass = 'alert alert-' + this.props.data.alertClass;
        return (
            React.createElement("div", {className: alertClass}, this.props.data.message)
        );
    }
});
