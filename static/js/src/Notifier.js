var TOPH = this.TOPH || {};
(function (ns) {
    'use strict';

    ns.Notifier = React.createClass({

        template: ns.templates.notifierTemplate,

        render: function () {
            if (this.props.data.message === '') {
                return React.createElement('div', null);
            }
            var alertClass = 'alert alert-' + this.props.data.alertClass;
            return this.template({alertClass: alertClass});
        }
    });  
}(TOPH));
