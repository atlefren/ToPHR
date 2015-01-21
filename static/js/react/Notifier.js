var Notifier = React.createClass({
    render: function () {
        if (this.props.data.message === '') {
            return (<div></div>);
        }
        var alertClass = 'alert alert-' + this.props.data.alertClass;
        return (
            <div className={alertClass}>{this.props.data.message}</div>
        );
    }
});
