//Checklist for adding new View
//1. construct liason
//2. set liason in the ViewManager.Initialize
//3. pathing in the Main.Initialize for handling url coming in as routed
//4. set Main.Url
//5. create the web api
//6. create the html View
//7. run it test crud
window.PageLoaded(function () {
    var main = "main".E();
    ViewManager.Initialize([
        new ProjectLiason(),
        new ConnectionLiason(),
        new ItemLiason(),
        new ConnectionStringLiason(),
        new EnumsLiason()
    ], Main.PostLoaded);
    Main.Initialize();
});
enum ViewType {
    Projects,
    Connections,
    Items,
    ConnectionStrings,
    Enums
}; 
class ViewLiasonBase implements ViewManager.ILiason {
    Key: any;
    Url: (View) => string;
    UrlTitle: (View) => string;
    PageTitle: (View) => string;
    Loaded: (View) => void;
    ViewUrl: string;
    IsApi: boolean;
    Container: HTMLElement;
    constructor() {
        this.Container = "main".E();        
        this.Url = Main.Url;
        this.UrlTitle = Main.UrlTitle;
        this.PageTitle = Main.PageTitle;
        this.Loaded = null;
        this.Key = null;
        this.ViewUrl = null;
    }
}
class ProjectLiason extends ViewLiasonBase {
    constructor() {
        super();
        this.Key = ViewType.Projects;
        this.ViewUrl = ViewPaths.Projects;
    }
}
class ConnectionLiason extends ViewLiasonBase {
    constructor() {
        super();
        this.Key = ViewType.Connections;
        this.ViewUrl = ViewPaths.Connections;
    }
}
class ItemLiason extends ViewLiasonBase {
    constructor() {
        super();
        this.Key = ViewType.Items;
        this.ViewUrl = ViewPaths.Items;
    }
}
class ConnectionStringLiason extends ViewLiasonBase {
    constructor() {
        super();
        this.Key = ViewType.ConnectionStrings;
        this.ViewUrl = ViewPaths.ConnectionStrings;
    }
}
class EnumsLiason extends ViewLiasonBase {
    constructor() {
        super();
        this.Key = ViewType.Enums;
        this.ViewUrl = ViewPaths.Enums;
    }
}
module ViewPaths {
    export var Projects = "/Views/Projects.html";
    export var Connections = "/Views/Connections.html";
    export var ConnectionStrings = "/Views/ConnectionStrings.html";
    export var Items = "/Views/Items.html";
    export var Enums = "/Views/Enums.html";
}
module Data {
    export var SelectedProject;
}
module Main {
    export function Initialize() {
        var splits = window.SplitPathName();
        if (splits.length > 0) {
            var skey = splits[0];
            var key = <ViewType>What.Is.EnumValue(ViewType, skey);
            switch (key) {
                case ViewType.ConnectionStrings:
                case ViewType.Enums:
                case ViewType.Items:
                    if (splits.length == 2) {
                        Data.SelectedProject = { ProjectID: splits[1] };
                    }
                    break;
                default:
                    break;
            }
            window.Show(key);
        }
        else {
            window.Show(ViewType.Projects);
        }
    }
    export function subLoad() {

        
    }
    export function PageTitle(view: ViewManager.View): string {
        return "Sword Object Constructor";
    }
    export function UrlTitle(view: ViewManager.View): string {
        return "Sword Object Constructor - " + What.Is.EnumName(ViewType, view.Key);
    }
    //mod the Url to handle parameters?
    export function Url(view: ViewManager.View): string {
        var splits = window.SplitPathName();
        switch (view.Key) {
            case ViewType.ConnectionStrings:
            case ViewType.Enums:
            case ViewType.Items:
                return What.Is.EnumName(ViewType, view.Key) + "/" + Data.SelectedProject.ProjectID;
            default:
                return What.Is.EnumName(ViewType, view.Key);
        }        
    }
    export function PostLoaded(view: ViewManager.View) {
        //var mi = ("mi" + What.Is.EnumName(ViewType, view.Key)).E();
        //if (mi) {
        //    "miMissingPlans".E().className = null;
        //    "miViewPlan".E().className = null;
        //    "miCreateMarketerPlan".E().className = null;
        //    "miCreatePlan".E().className = null;
        //    "miStaging".E().className = null;
        //    "miFinalize".E().className = null;
        //    "miMarketerPlansView".E().className = null;
        //    "miMarketers".E().className = null;
        //    mi.className = "isActive";
        //}
        //"header".E().innerHTML = Main.PageTitle(view);
    }
}