var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.notifierTemplate =  function (data) {
    console.log(this);
    return (
           React.createElement("div", {className: data.alertClass}, 
                this.props.data.message
           )
    );
};
