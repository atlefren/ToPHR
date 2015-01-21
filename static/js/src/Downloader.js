var downloaderTemplate = function (hiddenClass, link) {
    return (React.createElement("a", {className: hiddenClass, href: link}, "Last ned"));
};


var Downloader = React.createClass({displayName: "Downloader",
    render: function () {
        var hiddenClass = this.props.filename ?  '' : 'hidden';
        var link = '/download/' + this.props.filename;
        return downloaderTemplate.bind(this)(hiddenClass, link);
    }
})
