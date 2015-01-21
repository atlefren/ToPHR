/*global React: false */

var TOPH = this.TOPH || {};
(function (ns) {
    'use strict';
    ns.Downloader = React.createClass({

        template: ns.templates.downloaderTemplate,

        render: function () {
            var hiddenClass = this.props.filename ?  '' : 'hidden';
            var link = '/download/' + this.props.filename;
            return this.template({hiddenClass: hiddenClass, link: link});
        }
    });

}(TOPH));

