/// <reference path="../Modules/Ajax.ts"/>
/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Prototypes/String.ts"/>
module Local {
    export var Dictionary: {} = {};
    export function CanStore(): boolean {
        try {
            return localStorage ? true : false;
        } catch (e) {
            return false;
        }
    }
    export function Remove(key: string): void {
        if (Local.CanStore()) {
            localStorage.removeItem(key);            
            delete Local.Dictionary[key];
        }
    }
    export function Clear(): void {
        if (Local.CanStore()) {
            localStorage.clear();
            Local.Dictionary = {}; 
        }
    }
    export function Save(obj: any, key: string): void {        
        Local.Dictionary[key] = obj;
        if (Local.CanStore()) {
            var json = JSON.stringify(obj);            
            localStorage.setItem(key, json);
        }
    }
    export function Get(key: string, defaultObject?: any) {
        try {
            var temp = null;
            var found = Local.Dictionary[key];
            if (found) {                
                temp = found;
            }
            else if (!temp && Local.CanStore()) {
                if (Is.Property(key, localStorage)) {
                    temp = localStorage.getItem(key);
                }
                if (Is.Json(temp)) {
                    temp = JSON.parse(temp);
                    Ajax.ConvertProperties(temp);
                }
                else if (defaultObject) {
                    temp = defaultObject;
                }
            }
            if (!found && temp) {
                Local.Dictionary[key] = temp;
            }
            return temp;
        } catch (e) {
            throw e;
        }
    }
}