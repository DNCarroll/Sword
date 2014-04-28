/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Modules/RegularExpression.ts"/>
/// <reference path="../Prototypes/HTMLElement.ts"/>
/// <reference path="../Modules/Ajax.ts"/>
String.prototype.Ok = function (target, title, modalClass, okButton, containerClass, titleClass) {
    if (Is.String(target)) {
        target = target.E();
    }
    Dialog.Ok(this, title, target, modalClass, okButton, containerClass, titleClass);
};
String.prototype.Popup = function (target) {
    if (Is.String(target)) {
        target = target.E();
    }
    Dialog.Quick("div".CreateElement({
        innerHTML: this,
        border: "solid 1px #000",
        backgroundColor: "#D3D3D3",
        textAlign: "center",
        padding: ".5em"
    }), target);
};
String.prototype.DropDown = function () {
    var obj = document.getElementById(this.toString());
    if (obj) {
        return obj;
    }
    return null;
};
String.prototype.Input = function () {
    var obj = document.getElementById(this.toString());
    if (obj) {
        return obj;
    }
    return null;
};
String.prototype.Update = function (parameters, success, failure, target, isRaw) {
    Ajax.HttpAction("PUT", this, parameters, success, failure, target, isRaw);
};
String.prototype.Delete = function (parameters, success, failure, target, isRaw) {
    Ajax.HttpAction("DELETE", this, parameters, success, failure, target, isRaw);
};
String.prototype.ParialUpdate = function (parameters, success, failure, target, isRaw) {
    Ajax.HttpAction("PATCH", this + "/PartialUpdate", parameters, success, failure, target, isRaw);
};
String.prototype.Select = function (parameters, success, failure, target, isRaw) {
    Ajax.HttpAction("PATCH", this + "/Select", parameters, success, failure, target, isRaw);
};
String.prototype.Submit = function (parameters, success, failure, target, isRaw) {
    Ajax.HttpAction("PATCH", this, parameters, success, failure, target, isRaw);
};
String.prototype.Insert = function (parameters, success, failure, target, isRaw) {
    Ajax.HttpAction("POST", this, parameters, success, failure, target, isRaw);
};

///to parse ajax html to an object and pull scripts out of it
///returns {Html:string, Scripts:Array, LoadScripts()}
///use LoadScripts to load the array of scripts
String.prototype.ParseHtml = function () {
    var scripts = new Array();
    var html = this;
    var matches = this.match(/(<script[^>]*>[\s\S]*?<\/script>)/gi);
    if (matches) {
        for (var i = 0; i < matches.length; i++) {
            scripts.push(matches[i]);
            html = html.replace(matches[i], "");
        }
        html = html.replace(/(\r\n|\n|\r)/gm, "");
    }
    var ret = {
        Html: html, Scripts: scripts, LoadScripts: function () {
            for (var i = 0; i < ret.Scripts.length; i++) {
                var script = ret.Scripts[i].replace(/<script[^>]*>/gi, "");
                script = script.replace(/<\/script>/gi, "");
                var match = ret.Scripts[i].match(/id=('|")(.*?)('|")/g);
                var id = null;
                if (match) {
                    match = match[0].replace(/(\"|')/gi, "");
                    match = match.replace("id=", "");
                    id = match;
                    match = document.getElementById(match) ? true : false;
                }
                if (!match && script) {
                    var head = document.getElementsByTagName('head')[0];
                    var scriptElement = document.createElement('script');
                    scriptElement.setAttribute('type', 'text/javascript');
                    scriptElement["IsTemporary"] = true;
                    if (id) {
                        scriptElement.setAttribute('id', id);
                    }
                    scriptElement.textContent = script;
                    head.appendChild(scriptElement);
                }
            }
        }
    };
    return ret;
};

/*
returns a string with the whitespace from left and right side of string removed
var str = "   This is a string   ".Trim();
//str = "This is a string"
*/
String.prototype.Trim = function () {
    return this.replace(/^\s+|\s+$/g, "");
};

/*
characterAtZero - character to start at, if end it is not supplied, returns from start chart to end of string
characterAtEnd - optional, character to stop
returns the string from characterAtZero to characterAtEnd
//come back to this one with an example
*/
String.prototype.TrimCharacters = function (characterAtZero, characterAtEnd) {
    var ret = this;
    if (characterAtZero) {
        if (ret.indexOf(characterAtZero) == 0) {
            ret = ret.substring(1);
        }
    }
    if (characterAtEnd) {
        var lastCharacter = ret.substring(ret.length - 1);
        if (lastCharacter == characterAtEnd) {
            //not sure about that
            ret = ret.substring(0, ret.length - 1);
        }
    }
    return ret;
};

/*
returns a string with white space removed from left side of current string
var str = "    This is a string".LeftTrim();
//str == "This is a string"
*/
String.prototype.LeftTrim = function () {
    return this.replace(/^\s+/, "");
};

/*
returns a string with white space removed from right side of current string
var str = "This is a string    ".RightTrim();
//str == "This is a string"
*/
String.prototype.RightTrim = function () {
    return this.replace(/\s+$/, "");
};

/*
use: "IDofElementOrNameOfElements".E()
depending on whether an ID or Name is used:
returns an object for ID
returns an array of elements for name
returns null if neither is found
*/
String.prototype.E = function () {
    var obj = document.getElementById(this.toString());
    if (obj) {
        return obj;
    }
    return null;
};

/*
takes a string of properties and values '"id": "CustomerName", "color": "red", "innerHTML": "John Smith"'
returns an object with the properties and values added from the string
var obj = '"id":"CustomerName","color":"red","innerHTML":"John Smith"'.CreateObject();
var id = obj.id; //id == CustomerName
or var id = obj["id"];
*/
String.prototype.CreateObject = function () {
    return JSON.parse(this);
};

/*
replace part of string with pattern in object or an array
*/
String.prototype.ScriptReplace = function (sourceObjectOrArray, patternToLookFor, trimFromResultPattern) {
    if (!trimFromResultPattern) {
        trimFromResultPattern = RegularExpression.StandardBindingWrapper;
    }
    if (!patternToLookFor) {
        patternToLookFor = RegularExpression.StandardBindingPattern;
    }
    return RegularExpression.Replace(patternToLookFor, this, sourceObjectOrArray, trimFromResultPattern);
};

/*
From a camel case string
returns a string with a space between each word that begins with an upper case letter
var sentence = "ThisIsAString".SplitOnUpperCase();
sentence == "This Is A String";
*/
String.prototype.SplitOnUpperCase = function () {
    if (this && this.length > 0) {
        var split = this.match(/[A-Z][a-z]+/g);
        if (split) {
            return split.join(" ");
        }
    }
    return this;
};

String.prototype.CreateElement = function (objectProperties) {
    var obj = document.createElement(this);
    if (objectProperties) {
        obj.Set(objectProperties);
    }
    return obj;
};
