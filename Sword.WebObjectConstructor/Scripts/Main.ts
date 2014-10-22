window.PageLoaded(function () {
    var main = "main".E();
    ViewManager.Initialize([
        new ProjectLiason(),
        new ConnectionLiason(),
        new ItemLiason()
    ], Main.PostLoaded);
    Main.Initialize();
});
enum ViewType {
    Projects,
    Connections,
    Items
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
module ViewPaths {
    export var Projects = "/Views/Projects.html";
    export var Connections = "/Views/Connections.html";
    export var Items = "/Views/Items.html";
}
module Data {
    export var SelectedProject;
}
//module Api {
//    export var Projects = "/Api/Projects";
//    export var Connections = "/Api/Connections";
//}
module Main {
    export function Initialize() {

        var splits = window.SplitPathName();
        if (splits.length > 0) {
            var skey = splits[0];
            var key = What.Is.EnumValue(ViewType, skey);
            window.Show(key);
        }
        else {
            window.Show(ViewType.Projects);
        }
        //Api.Projects.Select({}, function (result) {
        //    Data.Projects = result;
        //    subLoad();
        //}, function () {
        //    alert("Failed to load common data.");
        //});
        //Api.LDCS.Select({}, function (result) {
        //    if (result && result.length) {
        //        Data.LDCs = result;
                
        //    }
        //}, function () {
        //        alert("Failed to load common data.");
        //    });

        ////get contractLDCs
        //Api.ContractLDCs.Select({}, function (result) {
        //    if (result && result.length) {
        //        Data.ContractLDCs = result;
        //    }
        //},
        //    function () {
        //        alert('Failed to load common data (CL)');
        //    });
        ////get electric contractLDCs
        //Api.ElectricContractLDCs.Select({}, function (result) {
        //    if (result && result.length) {
        //        Data.ElectricContractLDCs = result;
        //    }
        //},
        //    function () {
        //        alert('Failed to load common data (ECL)');
        //    });
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
        if (view.Key == ViewType.Items) {
            return What.Is.EnumName(ViewType, view.Key) + "/" + Data.SelectedProject.ProjectID;
        }
        else {
            return What.Is.EnumName(ViewType, view.Key);
        }
        //+ (view.Parameters && view.Parameters.length > 0 ? "/" + view.Parameters.join("/") : "");
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