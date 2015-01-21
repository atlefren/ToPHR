var Downloader = React.createClass({
    render: function () {

        var hiddenClass = this.props.filename ?  '' : 'hidden';

        var link = '/download/' + this.props.filename;
        return (
            <a className={hiddenClass} href={link}>Last ned</a>
        );
    }
})
