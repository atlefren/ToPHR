var Downloader = React.createClass({

    template: TOPH.templates.downloaderTemplate,

    render: function () {
        var hiddenClass = this.props.filename ?  '' : 'hidden';
        var link = '/download/' + this.props.filename;
        return this.template({hiddenClass: hiddenClass, link: link});
    }
});
