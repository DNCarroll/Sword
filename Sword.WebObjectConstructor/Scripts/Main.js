var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
window.PageLoaded(function () {
    var main = "main".E();
    ViewManager.Initialize([
        new ProjectLiason(),
        new ConnectionLiason(),
        new ItemLiason()
    ], Main.PostLoaded);
    Main.Initialize();
});
var ViewType;
(function (ViewType) {
    ViewType[ViewType["Projects"] = 0] = "Projects";
    ViewType[ViewType["Connections"] = 1] = "Connections";
    ViewType[ViewType["Items"] = 2] = "Items";
})(ViewType || (ViewType = {}));
;
var ViewLiasonBase = (function () {
    function ViewLiasonBase() {
        this.Container = "main".E();
        this.Url = Main.Url;
        this.UrlTitle = Main.UrlTitle;
        this.PageTitle = Main.PageTitle;
        this.Loaded = null;
        this.Key = null;
        this.ViewUrl = null;
    }
    return ViewLiasonBase;
})();
var ProjectLiason = (function (_super) {
    __extends(ProjectLiason, _super);
    function ProjectLiason() {
        _super.call(this);
        this.Key = 0 /* Projects */;
        this.ViewUrl = ViewPaths.Projects;
    }
    return ProjectLiason;
})(ViewLiasonBase);
var ConnectionLiason = (function (_super) {
    __extends(ConnectionLiason, _super);
    function ConnectionLiason() {
        _super.call(this);
        this.Key = 1 /* Connections */;
        this.ViewUrl = ViewPaths.Connections;
    }
    return ConnectionLiason;
})(ViewLiasonBase);
var ItemLiason = (function (_super) {
    __extends(ItemLiason, _super);
    function ItemLiason() {
        _super.call(this);
        this.Key = 2 /* Items */;
        this.ViewUrl = ViewPaths.Items;
    }
    return ItemLiason;
})(ViewLiasonBase);
var ViewPaths;
(function (ViewPaths) {
    ViewPaths.Projects = "/Views/Projects.html";
    ViewPaths.Connections = "/Views/Connections.html";
    ViewPaths.Items = "/Views/Items.html";
})(ViewPaths || (ViewPaths = {}));
var Data;
(function (Data) {
    Data.SelectedProject;
})(Data || (Data = {}));
var Main;
(function (Main) {
    function Initialize() {
        var splits = window.SplitPathName();
        if (splits.length > 0) {
            var skey = splits[0];
            var key = What.Is.EnumValue(ViewType, skey);
            if (key == 2 /* Items */ && splits.length == 2) {
                Data.SelectedProject = { ProjectID: splits[1] };
            }
            window.Show(key);
        }
        else {
            window.Show(0 /* Projects */);
        }
    }
    Main.Initialize = Initialize;
    function subLoad() {
    }
    Main.subLoad = subLoad;
    function PageTitle(view) {
        return "Sword Object Constructor";
    }
    Main.PageTitle = PageTitle;
    function UrlTitle(view) {
        return "Sword Object Constructor - " + What.Is.EnumName(ViewType, view.Key);
    }
    Main.UrlTitle = UrlTitle;
    function Url(view) {
        var splits = window.SplitPathName();
        if (view.Key == 2 /* Items */) {
            return What.Is.EnumName(ViewType, view.Key) + "/" + Data.SelectedProject.ProjectID;
        }
        else {
            return What.Is.EnumName(ViewType, view.Key);
        }
    }
    Main.Url = Url;
    function PostLoaded(view) {
    }
    Main.PostLoaded = PostLoaded;
})(Main || (Main = {}));
