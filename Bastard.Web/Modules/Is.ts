/// <reference path="../Prototypes/String.ts"/>

module Is {
    export function Json(value: string): boolean {
        var temp = value;
        if (temp != null && temp != "undefined")
        {
            temp = temp.Trim();
            return temp.indexOf("{") == 0 || temp.indexOf("[{") == 0;
        }
        return false;
    }
    export function Property(property, inObject): boolean {
        try {
            return typeof (inObject[property]) !== 'undefined';
        } catch (e) {

        }
        return false;
    }
    export function Array(value): boolean {
        return Object.prototype.toString.call(value) === '[object Array]';
        //return value && typeof value === 'object' && typeof value.length === 'number';
    }
    export function Boolean(value) {
        if (value.toLowerCase() == "true" || value.toLowerCase() == "false") {
            return true;
        }
    }
    export function ValidDate(value) {
        try {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                if (isNaN(value.getTime())) {
                    return false;
                }
                else {
                    return true;
                }                
            }
            else if (String(value)) {

                var objDate = new Date(value);
                //what was doing
                //var objDate = new Date(Date.parse(value));
                var parts = value.split("/");
                var year = parseInt(parts[2]);
                var month = parseInt(parts[0].indexOf("0") == 0 ? parts[0].substring(1) : parts[0]);
                var day = parseInt(parts[1].indexOf("0") == 0 ? parts[1].substring(1) : parts[1]);

                if (objDate.getFullYear() != year) return false;
                if (objDate.getMonth() != month - 1) return false;
                if (objDate.getDate() != day) return false;
                return true;
            }

        } catch (e) {

        }
        return false;
    }
    export function Element(value:any) {
        return value && value.tagName;
    }
    export function EmptyObject(obj): boolean {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }
        return true;
    }
    export function EnumValueContainedIn(source: number, value: number, zeroNotAllowed?: boolean): boolean {
        if (source == value) {
            return true
        }
        else if (value > source) {
            return false;
        }
        else if (value == 0 && !zeroNotAllowed) {
            return true;
        }
        var flagArray = [0, 1];
        while (source >= flagArray[flagArray.length - 1]) {
            flagArray.push(flagArray[flagArray.length - 1] * 2);
        }
        //remove the last one becuase its large than source
        flagArray.splice(flagArray.length - 1, 1);
        var ret = false;
        while (!ret && value <= flagArray[flagArray.length - 1]) {
            if (value == flagArray[flagArray.length - 1]) {
                ret = true;
            }
            else {
                source -= flagArray[flagArray.length - 1];
                while (flagArray[flagArray.length - 1] > source) {
                    flagArray.splice(flagArray.length - 1, 1);
                    if (flagArray.length == 0) {
                        break;
                    }
                }
            }
        }
        return ret;
    }
    export function FireFox(): boolean {
        if (navigator) {
            return /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
        }
        return false;
    }
    export function Function(obj): boolean {
        var getType = {};
        return obj && getType.toString.call(obj) === '[object Function]';
    }
    export function InternetExplorer(): boolean {
        //MSIE may be spoofed?
        //        var ua = window.navigator.userAgent;
        //        var msie = ua.indexOf("MSIE ");
        //        return msie > 0;
        return '\v' == 'v';
    }
    export function Chrome(): boolean {
        var w = <any>window;
        return w.chrome;
    }
    export function NullOrEmpty(value): boolean {
        if (value == null) {
            return true;
        }
        else if (value.length == 0) {
            return true;
        }
    }
    export function Numeric(input: string): boolean {
        var RE = /^-{0,1}\d*\.{0,1}\d+$/;
        return (RE.test(input));
    }
    export function Object(value) {
        return value && typeof value == 'object';
    }
    export function String(value) {
        return typeof value == 'string';
    }
    export function Style(value: string) {
        return value in document.body.style;
    }
    export function ValidEmail(address: string) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(address) == false) {
            return false;
        }
        return true;
    }
    export function Url(value: string): boolean {
        var pattern = /(https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return pattern.test(value) ? true : false;
    }
}