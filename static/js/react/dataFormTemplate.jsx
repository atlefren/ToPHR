var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};
TOPH.templates.dataFormTemplate = function () {
    return (
        <form className="form-horizontal" onSubmit={this.handleSubmit}>
            <div className="form-group">
                <label className="col-sm-4 control-label">MinZoom</label>
                <div className="col-sm-4">
                    <input type="int" className="form-control" defaultValue="0" ref="minZoom" />
                </div>
            </div>
            <div className="form-group">
                <label className="col-sm-4 control-label">MaxZoom</label>
                <div className="col-sm-4">
                    <input type="int" className="form-control" defaultValue="16" ref="maxZoom" />
                </div>
            </div>
            <div className="form-group">
                <div className="col-sm-10">
                <button type="submit" className="btn btn-default">
                    Calculate tiles for current bounds
                </button>
                </div>
            </div>
        </form>
    );
};