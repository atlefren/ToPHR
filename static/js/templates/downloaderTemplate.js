var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.downloaderTemplate =  function (data) {
    return (
        React.createElement("a", {className: data.hiddenClass, href: data.link}, "Download")
    );
};