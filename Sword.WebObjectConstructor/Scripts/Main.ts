window.PageLoaded(function () {
    var main = "main".E();
    ViewManager.Initialize([
        new ViewManager.Liason(ViewType.Projects, main, Main.Url, Main.UrlTitle, Main.PageTitle, View.Projects.Load, ViewPaths.Projects)
    ], Main.PostLoaded);
    Main.Initialize();
});
enum ViewType {
    Projects
}; 
module ViewPaths {
    export var Projects = "/Views/Projects.html";
}
module Api {
    export var Projects = "/Api/Projects";
}
module Data {
    export var Projects = new Array();
}
module Main {
    export function Initialize() {
        //Api.LDCS.Select({}, function (result) {
        //    if (result && result.length) {
        //        Data.LDCs = result;
                subLoad();
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

        //var splits = window.SplitPathName();
        //if (splits.length > 0) {
        //    var skey = splits[0];
        //    var key = What.Is.EnumValue(ViewType, skey);
        //    window.Show(key);
        //}
        //else {
            window.Show(ViewType.Projects);
        //}
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
        return What.Is.EnumName(ViewType, view.Key);
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