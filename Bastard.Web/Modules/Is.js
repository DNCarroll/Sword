/// <reference path="../Prototypes/String.ts"/>
var Is;
(function (Is) {
    function Json(value) {
        var temp = value;
        if (temp != null && temp != "undefined") {
            temp = temp.Trim();
            return temp.indexOf("{") == 0 || temp.indexOf("[{") == 0;
        }
        return false;
    }
    Is.Json = Json;
    function Property(property, inObject) {
        try  {
            return typeof (inObject[property]) !== 'undefined';
        } catch (e) {
        }
        return false;
    }
    Is.Property = Property;
    function Array(value) {
        return Object.prototype.toString.call(value) === '[object Array]';
        //return value && typeof value === 'object' && typeof value.length === 'number';
    }
    Is.Array = Array;
    function Boolean(value) {
        if (value.toLowerCase() == "true" || value.toLowerCase() == "false") {
            return true;
        }
    }
    Is.Boolean = Boolean;
    function ValidDate(value) {
        try  {
            if (Object.prototype.toString.call(value) === "[object Date]") {
                if (isNaN(value.getTime())) {
                    return false;
                } else {
                    return true;
                }
            } else if (String(value)) {
                var objDate = new Date(value);

                //what was doing
                //var objDate = new Date(Date.parse(value));
                var parts = value.split("/");
                var year = parseInt(parts[2]);
                var month = parseInt(parts[0].indexOf("0") == 0 ? parts[0].substring(1) : parts[0]);
                var day = parseInt(parts[1].indexOf("0") == 0 ? parts[1].substring(1) : parts[1]);

                if (objDate.getFullYear() != year)
                    return false;
                if (objDate.getMonth() != month - 1)
                    return false;
                if (objDate.getDate() != day)
                    return false;
                return true;
            }
        } catch (e) {
        }
        return false;
    }
    Is.ValidDate = ValidDate;
    function Element(value) {
        return value && value.tagName;
    }
    Is.Element = Element;
    function EmptyObject(obj) {
        for (var prop in obj) {
            if (Object.prototype.hasOwnProperty.call(obj, prop)) {
                return false;
            }
        }
        return true;
    }
    Is.EmptyObject = EmptyObject;
    function EnumValueContainedIn(source, value, zeroNotAllowed) {
        if (source == value) {
            return true;
        } else if (value > source) {
            return false;
        } else if (value == 0 && !zeroNotAllowed) {
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
            } else {
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
    Is.EnumValueContainedIn = EnumValueContainedIn;
    function FireFox() {
        if (navigator) {
            return /Firefox[\/\s](\d+\.\d+)/.test(navigator.userAgent);
        }
        return false;
    }
    Is.FireFox = FireFox;
    function Function(obj) {
        var getType = {};
        return obj && getType.toString.call(obj) === '[object Function]';
    }
    Is.Function = Function;
    function InternetExplorer() {
        //MSIE may be spoofed?
        //        var ua = window.navigator.userAgent;
        //        var msie = ua.indexOf("MSIE ");
        //        return msie > 0;
        return '\v' == 'v';
    }
    Is.InternetExplorer = InternetExplorer;
    function Chrome() {
        var w = window;
        return w.chrome;
    }
    Is.Chrome = Chrome;
    function NullOrEmpty(value) {
        if (value == null) {
            return true;
        } else if (value.length == 0) {
            return true;
        }
    }
    Is.NullOrEmpty = NullOrEmpty;
    function Numeric(input) {
        var RE = /^-{0,1}\d*\.{0,1}\d+$/;
        return (RE.test(input));
    }
    Is.Numeric = Numeric;
    function Object(value) {
        return value && typeof value == 'object';
    }
    Is.Object = Object;
    function String(value) {
        return typeof value == 'string';
    }
    Is.String = String;
    function Style(value) {
        return value in document.body.style;
    }
    Is.Style = Style;
    function ValidEmail(address) {
        var reg = /^([A-Za-z0-9_\-\.])+\@([A-Za-z0-9_\-\.])+\.([A-Za-z]{2,4})$/;
        if (reg.test(address) == false) {
            return false;
        }
        return true;
    }
    Is.ValidEmail = ValidEmail;
    function Url(value) {
        var pattern = /(https?):\/\/(\w+:{0,1}\w*@)?(\S+)(:[0-9]+)?(\/|\/([\w#!:.?+=&%@!\-\/]))?/;
        return pattern.test(value) ? true : false;
    }
    Is.Url = Url;
})(Is || (Is = {}));
