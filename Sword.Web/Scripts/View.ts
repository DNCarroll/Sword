///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
module View {
    export module Type {
        export var Projects = "Projects";
        export var Main = "Main";
        export var Connections = "Connections";
        export module Project {
            export var Code = "Project/Code";
            export var Connections = "Project/Connections";
            export var Enums = "Project/Enums";
            export var Fields = "Project/Fields";
            export var Items = "Project/Items";
        }
    }
    export function GetHtml(viewInfo: View.Info) {
        var found = sessionStorage.getItem(viewInfo.Type);
        if (!found || window["IsDebug"])
        {
            "/api/View".Select({ Type: viewInfo.Type }, function (result) {
                if (result) {
                    sessionStorage.setItem(viewInfo.Type, result);
                    viewInfo.HtmlLoaded(result);
                }
            }, function (result) {
                //?
            });
        }
        else {
            viewInfo.HtmlLoaded(found);
        }
    }
    export function Navigate(type: string, project?: string, parameters?: Array<any>, projectID?:number) {
        Data.ProjectID = projectID;
        
        var viewInfo = new View.Info(type, project, parameters);
        viewInfo.Load(false);
    }
    export class Info {
        Type: string;
        Parameters: Array<any>;
        Project: string;
        IsReload: boolean;
        Api(): string {
            var url = "/api/" + this.Type;
            return url;
        }
        Load(isReload?) {            
            this.IsReload = isReload;
            //need to account for parameters in the url
            var url = "/";
            if (window.location.pathname.indexOf("Sword") > -1)
            {
                url += "Sword/";
            }
            if (this.Type != View.Type.Project.Fields)
            {
                url += this.Type == View.Type.Main ? "" : this.Type;
                if (this.Project != null)
                {
                    url = url.replace("Project", this.Project);
                }
                if (this.Parameters && this.Parameters.length > 0)
                {
                    url += "/" + this.Parameters.join("/");
                }
            }
            else
            {
                url += this.Project + "/" + this.Parameters[0] + "/Fields";
            }
            window.PushState(null, this.Type.replace("/", " - "), url);   
            View.GetHtml(this);
        }
        constructor(type: string, project:string, parameters?: Array<any>) {
            this.Type = type;
            this.Parameters = parameters;
            this.Project = project;
            this.IsReload = false;
        }
        HtmlLoaded(html) {
            "main".E().innerHTML = html;
            if (!this.IsReload)
            {
                Data.Views.push(this);
            }
            var temp = this.Type.split("/");
            if (temp.length == 1)
            {
                if (window[temp[0]] && window[temp[0]]["Load"] != null)
                {
                    window[temp[0]]["Load"]();
                }
            }
            else if (temp.length == 2)
            {
                if (window[temp[0]] && window[temp[0]][temp[1]] && window[temp[0]][temp[1]]["Load"] != null)
                {
                    window[temp[0]][temp[1]]["Load"]();
                }
            }
        }
    }

}