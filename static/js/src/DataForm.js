/*global React: false */
var DataForm = React.createClass({

    template: TOPH.templates.dataFormTemplate,

    handleSubmit: function (e) {
        e.preventDefault();
        var minZoom = parseInt(this.refs.minZoom.getDOMNode().value, 10);
        var maxZoom = parseInt(this.refs.maxZoom.getDOMNode().value, 10);
        this.props.beforeCompute({
            minZoom: minZoom,
            maxZoom: maxZoom
        });
        return;
    },

    render: function () {
        return this.template();
    }
 });
