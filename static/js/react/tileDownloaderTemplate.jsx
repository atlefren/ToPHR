var TOPH = this.TOPH || {};
TOPH.templates = TOPH.templates || {};

TOPH.templates.zoomInTemplate =  function (data) {
    return (
        <div className="row"><TOPH.Notifier data={data} /></div>
    );
};

TOPH.templates.noProjectTemplate = function () {
    return (
           <div className="row">
               <div className="col-xs-2">
                   <TOPH.ProjectChooser
                       projects={this.props.projects}
                       projectChange={this.projectChange}
                   />
               </div>
           </div>
    );
};

TOPH.templates.tileDownloaderTemplate = function (data) {
    return (
        <div className="row">
          <div className="col-xs-2">
           <TOPH.ProjectChooser
               projects={this.props.projects}
               projectChange={this.projectChange}
           />
          </div>
          <div className="col-xs-2">
            <TOPH.DataForm beforeCompute={this.beforeCompute}/>
          </div>
          <div className="col-xs-8">
            <TOPH.Notifier data={this.state.messageData} />
            <TOPH.Downloader filename={this.state.filename}/>
            <button
              className={data.generateClass}
              onClick={this.generateTiles}
              >Ok, Generate them!</button>
          </div>
        </div>
    );
};