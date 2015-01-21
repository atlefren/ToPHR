var downloaderTemplate = function (hiddenClass, link) {
    return (<a className={hiddenClass} href={link}>Last ned</a>);
};


var Downloader = React.createClass({
    render: function () {
        var hiddenClass = this.props.filename ?  '' : 'hidden';
        var link = '/download/' + this.props.filename;
        return downloaderTemplate.bind(this)(hiddenClass, link);
    }
})
