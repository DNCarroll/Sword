module View {
    export module Projects {
        export function LoadItems(obj) {
            Data.SelectedProject = obj;
            window.Show(ViewType.Items);
        }
    }
    export module Items {
        export function UpdateEvent(obj, actionType, field) {
            if (actionType == Binding.ActionType.Insert) {
                obj.ProjectID = Data.SelectedProject.ProjectID;
            }
        }
    }
} 