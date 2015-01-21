var Downloader = React.createClass({displayName: "Downloader",
    render: function () {

        var hiddenClass = this.props.filename ?  '' : 'hidden';

        var link = '/download/' + this.props.filename;
        return (
            React.createElement("a", {className: hiddenClass, href: link}, "Last ned")
        );
    }
})
