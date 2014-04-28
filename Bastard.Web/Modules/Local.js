/// <reference path="../Modules/Ajax.ts"/>
/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Prototypes/String.ts"/>
var Local;
(function (Local) {
    Local.Dictionary = {};
    function CanStore() {
        try  {
            return localStorage ? true : false;
        } catch (e) {
            return false;
        }
    }
    Local.CanStore = CanStore;
    function Remove(key) {
        if (Local.CanStore()) {
            localStorage.removeItem(key);
            delete Local.Dictionary[key];
        }
    }
    Local.Remove = Remove;
    function Clear() {
        if (Local.CanStore()) {
            localStorage.clear();
            Local.Dictionary = {};
        }
    }
    Local.Clear = Clear;
    function Save(obj, key) {
        Local.Dictionary[key] = obj;
        if (Local.CanStore()) {
            var json = JSON.stringify(obj);
            localStorage.setItem(key, json);
        }
    }
    Local.Save = Save;
    function Get(key, defaultObject) {
        try  {
            var temp = null;
            var found = Local.Dictionary[key];
            if (found) {
                temp = found;
            } else if (!temp && Local.CanStore()) {
                if (Is.Property(key, localStorage)) {
                    temp = localStorage.getItem(key);
                }
                if (Is.Json(temp)) {
                    temp = JSON.parse(temp);
                    Ajax.ConvertProperties(temp);
                } else if (defaultObject) {
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
    Local.Get = Get;
})(Local || (Local = {}));
