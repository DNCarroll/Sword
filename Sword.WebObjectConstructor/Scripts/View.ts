module View {
    export module Projects {
        export function LoadView(obj, viewType: ViewType) {
            Data.SelectedProject = obj;
            window.Show(viewType);
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