///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
///<reference path="../Scripts/View.ts"/>
var Projects;
(function (Projects) {
    function Load() {
        "Grid".E().Bind(Data.Projects);
    }
    Projects.Load = Load;
})(Projects || (Projects = {}));
//# sourceMappingURL=Projects.js.map
