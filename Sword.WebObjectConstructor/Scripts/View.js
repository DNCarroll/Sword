var View;
(function (View) {
    var Projects;
    (function (Projects) {
        function LoadItems(obj) {
            Data.SelectedProject = obj;
            window.Show(2 /* Items */);
        }
        Projects.LoadItems = LoadItems;
    })(Projects = View.Projects || (View.Projects = {}));
    var Items;
    (function (Items) {
        function UpdateEvent(obj, actionType, field) {
            if (actionType == 0 /* Insert */) {
                obj.ProjectID = Data.SelectedProject.ProjectID;
            }
        }
        Items.UpdateEvent = UpdateEvent;
    })(Items = View.Items || (View.Items = {}));
})(View || (View = {}));
