/// <reference path="../Modules/Ajax.ts"/>
/// <reference path="../Prototypes/String.ts"/>
/// <reference path="../Modules/Is.ts"/>
var Session;
(function (Session) {
    Session.Dictionary = {};
    function CanStore() {
        try {
            return sessionStorage ? true : false;
        }
        catch (e) {
            return false;
        }
    }
    Session.CanStore = CanStore;
    function Remove(key) {
        if (Session.CanStore()) {
            sessionStorage.removeItem(key);
            delete Session.Dictionary[key];
        }
    }
    Session.Remove = Remove;
    function Clear() {
        if (Session.CanStore()) {
            sessionStorage.clear();
            Session.Dictionary = {};
        }
    }
    Session.Clear = Clear;
    function Save(obj, key) {
        Session.Dictionary[key] = obj;
        if (Session.CanStore()) {
            var json = JSON.stringify(obj);
            sessionStorage.setItem(key, json);
        }
    }
    Session.Save = Save;
    function Get(key, defaultObject) {
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
        }
        catch (e) {
            throw e;
        }
    }
    Session.Get = Get;
})(Session || (Session = {}));
