///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
///<reference path="../Scripts/View.ts"/>
module Project {
    export module Code {
        export function Load() {
            var cont = <any>"CodeContainer".E();
            var viewInfo = Data.Views[Data.Views.length - 1];
            var api = "/api/Project/Code/" + viewInfo.Parameters[0];
            var parameter = {};
            if (viewInfo.Parameters[0] == "Project")
            {
                parameter = Data.SelectedProject();
            }
            else
            {
                parameter = viewInfo.Parameters[1];
            }            
            api.Submit(parameter, function (result) {
                cont.value = result;
            }, function (result) {
                    cont.value = "Failed to get Code";
            });
        }
    }
    export module Connections {
        export function Load() {
            if (Data.ProjectID == 0 || Data.ProjectID == null)
            {
                var viewInfo = Data.Views[Data.Views.length - 1];
                if (viewInfo.Project)
                {
                    var found = <any>Data.Projects.First((o) => { return o.Name == viewInfo.Project; });
                    if (found)
                    {
                        Data.ProjectID = found.ProjectID;
                        Loaded();
                    }
                }
            }
            else
            {
                Loaded();
            }
        }
        export function Loaded() {            
            "InsertProjectID".Input().value = Data.ProjectID.toString();
            "/Api/Project/ConnectionStrings".Select({ ProjectID: Data.ProjectID }, function (result) {
                "Grid".E().Bind(result);
            }, function (result) {
                    alert("Failed to load connectionstrings");
            });
        }
    }
    export module Enums {
        export function Load() {
            if (Data.ProjectID == 0 || Data.ProjectID == null)
            {
                var viewInfo = Data.Views[Data.Views.length - 1];
                if (viewInfo.Project)
                {
                    var found = <any>Data.Projects.First((o) => { return o.Name == viewInfo.Project; });
                    if (found)
                    {
                        Data.ProjectID = found.ProjectID;
                        Loaded();
                    }
                }
            }
            else
            {
                Loaded();
            }
        }
        export function Loaded() {
            var select = <HTMLSelectElement>"InsertConnectionID".E();
            select.AddOptions(Data.Connections, "ConnectionID", "Name");
            "InsertProjectID".Input().value = Data.ProjectID.toString();
            "/Api/Project/Enums".Select({ ProjectID: Data.ProjectID }, function (result) {
                "Grid".E().Bind(result);
            }, function (result) {
                    alert("Failed to load enums");
            });
        }
        export function TypeScript(obj) {            
            View.Navigate(View.Type.Project.Code, Data.SelectedProject().Name, ["Enum", obj], Data.ProjectID);
        }
    }
    export module Fields {
        export function Load() {
            var viewInfo = Data.Views[Data.Views.length - 1];
            if (viewInfo && viewInfo.Parameters[0] && Data.Items)
            {
                Loaded();
            }
        }
        export function Loaded() {
            var viewInfo = Data.Views[Data.Views.length - 1];
            var found = <any>Data.Items.First((o) => { return o.ClassName == viewInfo.Parameters[0]; });
            if (found)
            {
                "InsertObjectID".Input().value = found.ObjectID;
                "/Api/Project/Fields".Select({ ObjectID: found.ObjectID }, function (result) {
                    Data.Items = result;
                    "Grid".E().Bind(result);
                }, function (result) {
                        alert("Failed to load Fields");
                });
            }
        }
    }
    export module Items {
        export function Load() {
            if (Data.ProjectID == 0 || Data.ProjectID == null)
            {
                var viewInfo = Data.Views[Data.Views.length - 1];
                if (viewInfo.Project)
                {
                    var found = <any>Data.Projects.First((o) => { return o.Name == viewInfo.Project; });
                    if (found)
                    {
                        Data.ProjectID = found.ProjectID;
                        Loaded();
                    }
                }
            }
            else
            {
                Loaded();
            }
        }
        export function Loaded() {
            var select = <HTMLSelectElement>"InsertConnectionID".E();
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
        export function TypeScript(obj) {
            View.Navigate(View.Type.Project.Code, Data.SelectedProject().Name, ["Items", obj], Data.ProjectID);
        }
    }
}