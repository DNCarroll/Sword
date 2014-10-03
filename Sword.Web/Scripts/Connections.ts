///<reference path="../Scripts/Bastard.ts"/>
///<reference path="../Scripts/Data.ts"/>
///<reference path="../Scripts/View.ts"/>
module Connections {
    export function Load() {
        "Grid".E().Bind(Data.Connections);
    }
}