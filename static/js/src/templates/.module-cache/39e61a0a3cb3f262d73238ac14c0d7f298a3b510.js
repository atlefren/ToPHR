var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.notifierTemplate =  function (data) {
    return (
           React.createElement("div", {className: data.alertClass}, 
                this.props.data.message
           )
    );
};
