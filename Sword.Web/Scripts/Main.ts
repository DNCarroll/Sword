///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
///<reference path="../Scripts/View.ts"/>
window.PageLoaded(function () {
    "main".E().innerHTML = "";
    Ajax.Resolver("Sword");
    Ajax.UseAsDateUTC = false;    
    Main.InitialLoad();    
});

module Main {
    export function InitialLoad() {  
        //may need to handle resolver here      
        window.addEventListener("popstate", Main.BackClicked);
        LoadProjectsAndConnections();
    }
    export function LoadProjectsAndConnections() {
        "/api/Projects".Select({}, function (result) {            
            Data.Projects = result;
            if (Data.Connections && Data.Connections.length > 0)
            {
                finishedLoad();
            }
        }, function (result) {
            alert("Failed to do anything");
        });
        "/api/Connections".Select({}, function (result) {            
            Data.Connections = result;
            if (Data.Projects && Data.Projects.length > 0)
            {
                finishedLoad();
            }
        }, function (result) { });
    }
    export function finishedLoad() {
        var path = <Array<string>>window.SplitPathName();
        if (path[0] && path[0].toLowerCase() == "sword")
        {
            path.splice(0, 1);
        }
        var type = View.Type.Main;
        var parameters = new Array();
        var project: string = null;
        if (path.length > 1)
        {
            project = path[0];
            type = "Project/" + path[1];
            path.splice(0, 2);
            parameters = path;
        }
        else if (path.length > 0)
        {
            type = !Is.NullOrEmpty(path[0].trim()) ? path[0] : type;
        }
        View.Navigate(type, project, parameters);
    }
    export function BackClicked(e) {
        if (Data.Views.length > 0)
        {
            Data.Views.splice(Data.Views.length - 1, 1);
        }
        if (Data.Views.length > 0)
        {
            var viewInfo = Data.Views[Data.Views.length - 1];
            viewInfo.Load(true);
        }
    }
    export function Load() {
    }
}