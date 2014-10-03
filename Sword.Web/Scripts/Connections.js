///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
///<reference path="../Scripts/View.ts"/>
var Connections;
(function (Connections) {
    function Load() {
        "Grid".E().Bind(Data.Connections);
    }
    Connections.Load = Load;
})(Connections || (Connections = {}));
//# sourceMappingURL=Connections.js.map
