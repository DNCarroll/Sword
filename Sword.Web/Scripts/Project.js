///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
///<reference path="../Scripts/View.ts"/>
var Project;
(function (Project) {
    (function (Code) {
        function Load() {
            var cont = "CodeContainer".E();
            var viewInfo = Data.Views[Data.Views.length - 1];
            var api = "/api/Project/Code/" + viewInfo.Parameters[0];
            var parameter = {};
            if (viewInfo.Parameters[0] == "Project") {
                parameter = Data.SelectedProject();
            } else {
                parameter = viewInfo.Parameters[1];
            }
            api.Submit(parameter, function (result) {
                cont.value = result;
            }, function (result) {
                cont.value = "Failed to get Code";
            });
        }
        Code.Load = Load;
    })(Project.Code || (Project.Code = {}));
    var Code = Project.Code;
    (function (Connections) {
        function Load() {
            if (Data.ProjectID == 0 || Data.ProjectID == null) {
                var viewInfo = Data.Views[Data.Views.length - 1];
                if (viewInfo.Project) {
                    var found = Data.Projects.First(function (o) {
                        return o.Name == viewInfo.Project;
                    });
                    if (found) {
                        Data.ProjectID = found.ProjectID;
                        Loaded();
                    }
                }
            } else {
                Loaded();
            }
        }
        Connections.Load = Load;
        function Loaded() {
            "InsertProjectID".Input().value = Data.ProjectID.toString();
            "/Api/Project/ConnectionStrings".Select({ ProjectID: Data.ProjectID }, function (result) {
                "Grid".E().Bind(result);
            }, function (result) {
                alert("Failed to load connectionstrings");
            });
        }
        Connections.Loaded = Loaded;
    })(Project.Connections || (Project.Connections = {}));
    var Connections = Project.Connections;
    (function (Enums) {
        function Load() {
            if (Data.ProjectID == 0 || Data.ProjectID == null) {
                var viewInfo = Data.Views[Data.Views.length - 1];
                if (viewInfo.Project) {
                    var found = Data.Projects.First(function (o) {
                        return o.Name == viewInfo.Project;
                    });
                    if (found) {
                        Data.ProjectID = found.ProjectID;
                        Loaded();
                    }
                }
            } else {
                Loaded();
            }
        }
        Enums.Load = Load;
        function Loaded() {
            var select = "InsertConnectionID".E();
            select.AddOptions(Data.Connections, "ConnectionID", "Name");
            "InsertProjectID".Input().value = Data.ProjectID.toString();
            "/Api/Project/Enums".Select({ ProjectID: Data.ProjectID }, function (result) {
                "Grid".E().Bind(result);
            }, function (result) {
                alert("Failed to load enums");
            });
        }
        Enums.Loaded = Loaded;
        function TypeScript(obj) {
            View.Navigate(View.Type.Project.Code, Data.SelectedProject().Name, ["Enum", obj], Data.ProjectID);
        }
        Enums.TypeScript = TypeScript;
    })(Project.Enums || (Project.Enums = {}));
    var Enums = Project.Enums;
    (function (Fields) {
        function Load() {
            var viewInfo = Data.Views[Data.Views.length - 1];
            if (viewInfo && viewInfo.Parameters[0] && Data.Items) {
                Loaded();
            }
        }
        Fields.Load = Load;
        function Loaded() {
            var viewInfo = Data.Views[Data.Views.length - 1];
            var found = Data.Items.First(function (o) {
                return o.ClassName == viewInfo.Parameters[0];
            });
            if (found) {
                "InsertObjectID".Input().value = found.ObjectID;
                "/Api/Project/Fields".Select({ ObjectID: found.ObjectID }, function (result) {
                    Data.Items = result;
                    "Grid".E().Bind(result);
                }, function (result) {
                    alert("Failed to load Fields");
                });
            }
        }
        Fields.Loaded = Loaded;
    })(Project.Fields || (Project.Fields = {}));
    var Fields = Project.Fields;
    (function (Items) {
        function Load() {
            if (Data.ProjectID == 0 || Data.ProjectID == null) {
                var viewInfo = Data.Views[Data.Views.length - 1];
                if (viewInfo.Project) {
                    var found = Data.Projects.First(function (o) {
                        return o.Name == viewInfo.Project;
                    });
                    if (found) {
                        Data.ProjectID = found.ProjectID;
                        Loaded();
                    }
                }
            } else {
                Loaded();
            }
        }
        Items.Load = Load;
        function Loaded() {
            var select = "InsertConnectionID".E();
            select.AddOptions(Data.Connections, "ConnectionID", "Name");
            "InsertNamespace".Input().value = Data.SelectedProject()["Namespace"];
            "InsertProjectID".Input().value = Data.ProjectID.toString();
            "/Api/Project/Items".Select({ ProjectID: Data.ProjectID }, function (result) {
                Data.Items = result;
                "Grid".E().Bind(result);
            }, function (result) {
                alert("Failed to load Items");
            });
        }
        Items.Loaded = Loaded;
        function TypeScript(obj) {
            View.Navigate(View.Type.Project.Code, Data.SelectedProject().Name, ["Items", obj], Data.ProjectID);
        }
        Items.TypeScript = TypeScript;
    })(Project.Items || (Project.Items = {}));
    var Items = Project.Items;
})(Project || (Project = {}));
//# sourceMappingURL=Project.js.map
