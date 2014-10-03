///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
var View;
(function (View) {
    (function (Type) {
        Type.Projects = "Projects";
        Type.Main = "Main";
        Type.Connections = "Connections";
        (function (Project) {
            Project.Code = "Project/Code";
            Project.Connections = "Project/Connections";
            Project.Enums = "Project/Enums";
            Project.Fields = "Project/Fields";
            Project.Items = "Project/Items";
        })(Type.Project || (Type.Project = {}));
        var Project = Type.Project;
    })(View.Type || (View.Type = {}));
    var Type = View.Type;
    function GetHtml(viewInfo) {
        var found = sessionStorage.getItem(viewInfo.Type);
        if (!found || window["IsDebug"]) {
            "/api/View".Select({ Type: viewInfo.Type }, function (result) {
                if (result) {
                    sessionStorage.setItem(viewInfo.Type, result);
                    viewInfo.HtmlLoaded(result);
                }
            }, function (result) {
                //?
            });
        } else {
            viewInfo.HtmlLoaded(found);
        }
    }
    View.GetHtml = GetHtml;
    function Navigate(type, project, parameters, projectID) {
        Data.ProjectID = projectID;

        var viewInfo = new View.Info(type, project, parameters);
        viewInfo.Load(false);
    }
    View.Navigate = Navigate;
    var Info = (function () {
        function Info(type, project, parameters) {
            this.Type = type;
            this.Parameters = parameters;
            this.Project = project;
            this.IsReload = false;
        }
        Info.prototype.Api = function () {
            var url = "/api/" + this.Type;
            return url;
        };
        Info.prototype.Load = function (isReload) {
            this.IsReload = isReload;

            //need to account for parameters in the url
            var url = "/";
            if (window.location.pathname.indexOf("Sword") > -1) {
                url += "Sword/";
            }
            if (this.Type != View.Type.Project.Fields) {
                url += this.Type == View.Type.Main ? "" : this.Type;
                if (this.Project != null) {
                    url = url.replace("Project", this.Project);
                }
                if (this.Parameters && this.Parameters.length > 0) {
                    url += "/" + this.Parameters.join("/");
                }
            } else {
                url += this.Project + "/" + this.Parameters[0] + "/Fields";
            }
            window.PushState(null, this.Type.replace("/", " - "), url);
            View.GetHtml(this);
        };

        Info.prototype.HtmlLoaded = function (html) {
            "main".E().innerHTML = html;
            if (!this.IsReload) {
                Data.Views.push(this);
            }
            var temp = this.Type.split("/");
            if (temp.length == 1) {
                if (window[temp[0]] && window[temp[0]]["Load"] != null) {
                    window[temp[0]]["Load"]();
                }
            } else if (temp.length == 2) {
                if (window[temp[0]] && window[temp[0]][temp[1]] && window[temp[0]][temp[1]]["Load"] != null) {
                    window[temp[0]][temp[1]]["Load"]();
                }
            }
        };
        return Info;
    })();
    View.Info = Info;
})(View || (View = {}));
//# sourceMappingURL=View.js.map
