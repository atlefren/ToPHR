var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.downloaderTemplate =  function (data) {
    return (
        <a className={data.hiddenClass} href={data.link}>Download</a>
    );
};