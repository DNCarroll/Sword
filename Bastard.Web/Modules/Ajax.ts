/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Modules/RegularExpression.ts"/>
/// <reference path="../Prototypes/HTMLElement.ts"/>
/// <reference path="../Prototypes/Window.ts"/>
/// <reference path="../Modules/Thing.ts"/>
module Ajax {
    export var Host: string = "";
    export var UseAsDateUTC = false;
    export var AutoConvert: boolean = true;
    export var ProgressElement: HTMLElement = null;
    export var DisableElement: any = null;
    export function ConvertProperties(object) {
        var keyMap: Array<any>;
        if (Is.Array(object)) {
            for (var i = 0; i < object.length; i++) {
                var obj = object[i];
                if (obj) {
                    try {
                        if (keyMap == null) {
                            keyMap = Ajax.getKeyMap(obj);
                        }
                    } catch (e) {
                        alert(e);
                    }
                    Ajax.setValues(obj, keyMap);
                }
                for (var prop in obj) {
                    Ajax.ConvertProperties(obj[prop]);
                }
            }
        }
        else if (Is.Object(object)) {
            var keyMap = getKeyMap(object);
            setValues(object, keyMap);
            for (var prop in object) {
                ConvertProperties(object[prop]);
            }
        }
    }
    export function Delete(url, parameters, successMethod?, failureMethod?, target?) {
        Ajax.HttpAction("DELETE", url, parameters, successMethod, failureMethod, target);
    }
    export function getKeyMap(obj) : Array<any> {
        var keyMap = new Array();
        for (var prop in obj) {
            var val = obj[prop];
            if (val && Is.String(val)) {
                val = val.Trim();
                if (val.indexOf("/Date(") == 0 || val.indexOf("Date(") == 0) {
                    keyMap.push({ Key: prop, Type: "Date" });
                }
                else if (val.match(RegularExpression.UTCDate)) {
                    keyMap.push({ Key: prop, Type: "UTCDate" });
                }
                else if (val.match(RegularExpression.ZDate)) {
                    keyMap.push({ Key: prop, Type: "ZDate" });
                }
            }
        }
        return keyMap;
    }
    export function HandleOtherStates(xmlhttp, failureMethod) {
        if (xmlhttp.readyState == 4) {
            Ajax.HideProgress();
            if (xmlhttp.status == 404) {
                failureMethod("404 file not found.");
            }
            else if (xmlhttp.status == 500) {
                failureMethod("500 error.");
            }
            else {
                failureMethod("Unhandled status:" + xmlhttp.status);
            }
        }
    }
    export function HideProgress() {
        if (Ajax.ProgressElement != null) {
            Ajax.ProgressElement.style.display = "none";
        }
        if (Ajax.DisableElement) {
            if (Is.Array(Ajax.DisableElement)) {
                for (var i = 0; i < Ajax.DisableElement.length; i++) {
                    Ajax.DisableElement[i].removeAttribute("disabled");
                }
            }
            else {
                Ajax.DisableElement.removeAttribute("disabled");
            }
        }
    }
    export function HttpAction(httpAction, url, parameters, successMethod?, failureMethod?, target?, isRaw?: boolean) {
        var returnMethod = function (response) {
            var ret = response;
            if (!isRaw && !Is.NullOrEmpty(ret)) {
                try {
                    ret = JSON.parse(ret);
                    if (ret.d) {
                        ret = ret.d;
                    }
                    if (Ajax.AutoConvert) {
                        Ajax.ConvertProperties(ret);
                    }
                }
                catch (e) {
                    //?
                }
            }
            if (target) {
                if (Is.Array(target)) {
                    target.splice.apply(target, [target.length, 0].concat(ret));
                    if (successMethod) {
                        successMethod();
                    }
                }
                else if (target.tagName && target.tagName.toLowerCase() == "select") {
                    for (var i = 0; i < ret.length; i++) {
                        target.options[target.options.length] = new Option(ret[i].Text, ret[i].Value);
                    }
                    if (successMethod) {
                        successMethod(ret);
                    }
                }
                else if (Is.Object(target)) {
                    Thing.Merge(ret, target);
                    if (successMethod) {
                        successMethod();
                    }
                }
            }
            else if (target == null && successMethod) {
                successMethod(ret);
            }
        };
        Ajax.Submit(httpAction, url, parameters, returnMethod, failureMethod, "application/json; charset=utf-8");
    }
    export function Initialize(disableElement: any, progressID?: string) {
        DisableElement = disableElement;
        if (!ProgressElement && progressID) {
            ProgressElement = progressID.E();
        }
    }
    //tighly coupled says that it expects the base controller path and not the extend /method
    export function Insert(url, parameters, successMethod?, failureMethod?, target?) {
        Ajax.HttpAction("POST", url, parameters, successMethod, failureMethod, target);
    }
    export function Update(url, parameters, successMethod?, failureMethod?, target?) {
        Ajax.HttpAction("PUT", url, parameters, successMethod, failureMethod, target);
    }
    export function Resolver(...subDirectories: string[]) {        
        var split = window.SplitPathName(0).toLowerCase();
        var host = window.location.href.replace(window.location.pathname, "");
        for (var i = 0; i < subDirectories.length; i++) {
            if (subDirectories[i].toLowerCase() == split) {
                Ajax.Host = host + "/" + subDirectories[i], true; break;
            }
        }
    }
    export function setValues(obj, keyMap: Array<any>) {
        for (var j = 0; j < keyMap.length; j++) {

            var key = keyMap[j].Key;
            var type = keyMap[j].Type;
            var val = obj[key];

            switch (type) {
                case "Date":
                    if (val) {
                        val = val.substring(6);
                        val = val.replace(")/", "");
                        val = parseInt(val);
                        if (val > -62135575200000) {
                            val = new Date(val);
                            obj[key] = val;
                        }
                        else {
                            delete obj[key];
                        }
                    }
                    else {
                        obj[key] = new Date();
                    }
                    break;
                case "UTCDate":
                case "ZDate":
                    var tempDate = new Date(val);
                    if (UseAsDateUTC) {
                        tempDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate());
                    }
                    else if(Is.Chrome()) {
                        var offset = new Date().getTimezoneOffset();
                        tempDate = tempDate.Add(0, 0, 0, 0, offset);
                    }
                    obj[key] = tempDate;
                    break;
                default:
                    break;
            }
        }
    }
    export function ShowProgress() {
        if (Ajax.ProgressElement) {
            Ajax.ProgressElement.style.display = "inline";
        }
        if (Ajax.DisableElement) {
            if (Is.Array(Ajax.DisableElement)) {
                for (var i = 0; i < Ajax.DisableElement.length; i++) {
                    Ajax.DisableElement[i].setAttribute("disabled", "disabled");
                }
            }
            else {
                Ajax.DisableElement.setAttribute("disabled", "disabled");
            }
        }
    }
    export function Submit(method, url, parameters, returnMethod, failureMethod, contentType) {
        if (!failureMethod) {
            failureMethod = function (msg) {
                throw new Error(msg)
            };
        }
        var tempUrl = url;
        Ajax.ShowProgress()
        if (url.indexOf("http") == -1 && Ajax.Host != "") {
            tempUrl = Ajax.Host + (url.indexOf("/") == 0 ? url : "/" + url);
        }
        // code for IE7+, Firefox, Chrome, Opera, Safari
        var xmlhttp = new XMLHttpRequest();
        if (xmlhttp) {
            xmlhttp.onreadystatechange = function () {
                if (xmlhttp.readyState == 4 && (xmlhttp.status == 200 || xmlhttp.status == 204)) {
                    Ajax.HideProgress();
                    returnMethod(xmlhttp.responseText);
                }
                else {
                    Ajax.HandleOtherStates(xmlhttp, failureMethod);
                }
            };
            xmlhttp.open(method, tempUrl, true);
            if (contentType) {                
                xmlhttp.setRequestHeader("content-type", !Is.FireFox() ? contentType : "application/json;q=0.9");
            }
            try {
                if (parameters) {
                    if (contentType == "application/json; charset=utf-8")
                    {                           
                        var JsonWParam = new Object();
                        for (var prop in parameters) {
                            JsonWParam[prop] = parameters[prop];
                        }
                        var json = JsonWParam == null ? "{}" : JSON.stringify(JsonWParam);
                        json = json.replace(/\\\"__type\\\"\:\\\"[\w+\.?]+\\\"\,/g, "");
                        json = json.replace(/\"__type\"\:\"[\w+\.?]+\"\,/g, "");
                        json = json.replace(/<script/ig, "");
                        json = json.replace(/script>/ig, "");
                        xmlhttp.send(json);
                    }
                    //handles file uploads
                    else {
                        xmlhttp.send(parameters);
                    }
                }
                else {
                    xmlhttp.send();
                }

            } catch (e) {
                Ajax.HideProgress()
                failureMethod(e.message);
            }
        }
    }
    export module View {
        export function Retrieve(url, callBack: (result: any) => void , error: (message: string) => void ) {
            var stored = sessionStorage.getItem(url);
            if (!stored) {
                Ajax.HttpAction("GET", url, {}, function (result) {
                    sessionStorage.setItem(url, result);
                    callBack(result);
                }, function (result) {
                        error("Failed to retrieve html for " + url);
                    }, null, true);
            }
            else {
                callBack(stored);
            }
        }
    }
}