/// <reference path="../Modules/Ajax.ts"/>
/// <reference path="../Prototypes/String.ts"/>
/// <reference path="../Modules/Is.ts"/>
module Session {
    export var Dictionary: {} = {};

    export function CanStore(): boolean {
        try {
            return sessionStorage ? true : false;
        } catch (e) {
            return false;
        }
    }

    export function Remove(key: string): void {
        if (Session.CanStore()) {
            sessionStorage.removeItem(key);            
            delete Session.Dictionary[key];
        }
    }

    export function Clear(): void {
        if (Session.CanStore()) {
            sessionStorage.clear();
            Session.Dictionary = {};
        }
    }

    export function Save(obj: any, key: string): void {        
        Session.Dictionary[key] = obj;
        if (Session.CanStore()) {
            var json = JSON.stringify(obj);            
            sessionStorage.setItem(key, json);
        }
    }

    export function Get(key: string, defaultObject: any) {
        try {
            var temp = null;
            var found = Session.Dictionary[key];
            if (found) {
                temp = found;
            }
            else if (!temp && Session.CanStore()) {
                if (Is.Property(key, sessionStorage)) {
                    temp = sessionStorage.getItem(key);
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
                Session.Dictionary[key] = temp;
            }
            return temp;
        } catch (e) {
            throw e;
        }
    }
}