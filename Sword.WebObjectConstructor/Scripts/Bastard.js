var Accordion;
(function (Accordion) {
    function Hook(ele, parentRule) {
        if (!parentRule) {
            parentRule = ".accordion";
        }
        var accordions = ele.Get(function (obj) {
            return !Is.NullOrEmpty(obj.getAttribute("data-accordion"));
        });
        for (var i = 0; i < accordions.length; i++) {
            accordions[i].className = null;
            accordions[i].className = Accordion.MaximumClass(accordions[i], parentRule);
        }
    }
    Accordion.Hook = Hook;
    function MaximumClass(ele, parentRule) {
        var className = parentRule + " input:checked ~ article.Max" + ele.id;

        //find does it already exists
        //yes? then mod it to be like this one
        var style = null;
        var mysheet = Accordion.GetStyleSheet("mainSheet");
        var rules = Accordion.GetStyleSheetRules(mysheet);
        for (var i = 0; i < rules.length; i++) {
            if (rules[i].selectorText.indexOf(className) > -1) {
                style = rules[i].style;
                style.height = ele.style.maxHeight;
            }
        }
        if (!style) {
            mysheet.insertRule(className + "{ height:" + ele.style.maxHeight + "}", 0);
        }
        return "Max" + ele.id;
    }
    Accordion.MaximumClass = MaximumClass;
    function GetStyleSheet(name) {
        for (var i = 0; i < document.styleSheets.length; i++) {
            var sheet = document.styleSheets[i];
            if (sheet.title == name) {
                return sheet;
            }
        }
    }
    Accordion.GetStyleSheet = GetStyleSheet;
    function GetStyleSheetRules(styleSheet) {
        var rules = document.all ? 'rules' : 'cssRules';
        return styleSheet[rules];
    }
    Accordion.GetStyleSheetRules = GetStyleSheetRules;
})(Accordion || (Accordion = {}));
var Ajax;
(function (Ajax) {
    Ajax.Host = "";
    Ajax.UseAsDateUTC = false;
    Ajax.AutoConvert = true;
    Ajax.ProgressElement = null;
    Ajax.DisableElement = null;
    function ConvertProperties(object) {
        var keyMap;
        if (Is.Array(object)) {
            for (var i = 0; i < object.length; i++) {
                var obj = object[i];
                if (obj) {
                    try  {
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
        } else if (Is.Object(object)) {
            var keyMap = getKeyMap(object);
            setValues(object, keyMap);
            for (var prop in object) {
                ConvertProperties(object[prop]);
            }
        }
    }
    Ajax.ConvertProperties = ConvertProperties;
    function Delete(url, parameters, successMethod, failureMethod, target) {
        Ajax.HttpAction("DELETE", url, parameters, successMethod, failureMethod, target);
    }
    Ajax.Delete = Delete;
    function getKeyMap(obj) {
        var keyMap = new Array();
        for (var prop in obj) {
            var val = obj[prop];
            if (val && Is.String(val)) {
                val = val.Trim();
                if (val.indexOf("/Date(") == 0 || val.indexOf("Date(") == 0) {
                    keyMap.push({ Key: prop, Type: "Date" });
                } else if (val.match(RegularExpression.UTCDate)) {
                    keyMap.push({ Key: prop, Type: "UTCDate" });
                } else if (val.match(RegularExpression.ZDate)) {
                    keyMap.push({ Key: prop, Type: "ZDate" });
                }
            }
        }
        return keyMap;
    }
    Ajax.getKeyMap = getKeyMap;
    function HandleOtherStates(xmlhttp, failureMethod) {
        if (xmlhttp.readyState == 4) {
            Ajax.HideProgress();
            if (xmlhttp.status == 404) {
                failureMethod("404 file not found.");
            } else if (xmlhttp.status == 500) {
                failureMethod("500 error.");
            } else {
                failureMethod("Unhandled status:" + xmlhttp.status);
            }
        }
    }
    Ajax.HandleOtherStates = HandleOtherStates;
    function HideProgress() {
        if (Ajax.ProgressElement != null) {
            Ajax.ProgressElement.style.display = "none";
        }
        if (Ajax.DisableElement) {
            if (Is.Array(Ajax.DisableElement)) {
                for (var i = 0; i < Ajax.DisableElement.length; i++) {
                    Ajax.DisableElement[i].removeAttribute("disabled");
                }
            } else {
                Ajax.DisableElement.removeAttribute("disabled");
            }
        }
    }
    Ajax.HideProgress = HideProgress;
    function HttpAction(httpAction, url, parameters, successMethod, failureMethod, target, isRaw) {
        var returnMethod = function (response) {
            var ret = response;
            if (!isRaw && !Is.NullOrEmpty(ret)) {
                try  {
                    ret = JSON.parse(ret);
                    if (ret.d) {
                        ret = ret.d;
                    }
                    if (Ajax.AutoConvert) {
                        Ajax.ConvertProperties(ret);
                    }
                } catch (e) {
                    //?
                }
            }
            if (target) {
                if (Is.Array(target)) {
                    target.splice.apply(target, [target.length, 0].concat(ret));
                    if (successMethod) {
                        successMethod();
                    }
                } else if (target.tagName && target.tagName.toLowerCase() == "select") {
                    for (var i = 0; i < ret.length; i++) {
                        target.options[target.options.length] = new Option(ret[i].Text, ret[i].Value);
                    }
                    if (successMethod) {
                        successMethod(ret);
                    }
                } else if (Is.Object(target)) {
                    Thing.Merge(ret, target);
                    if (successMethod) {
                        successMethod();
                    }
                }
            } else if (target == null && successMethod) {
                successMethod(ret);
            }
        };
        Ajax.Submit(httpAction, url, parameters, returnMethod, failureMethod, "application/json; charset=utf-8");
    }
    Ajax.HttpAction = HttpAction;
    function Initialize(disableElement, progressID) {
        Ajax.DisableElement = disableElement;
        if (!Ajax.ProgressElement && progressID) {
            Ajax.ProgressElement = progressID.E();
        }
    }
    Ajax.Initialize = Initialize;

    //tighly coupled says that it expects the base controller path and not the extend /method
    function Insert(url, parameters, successMethod, failureMethod, target) {
        Ajax.HttpAction("POST", url, parameters, successMethod, failureMethod, target);
    }
    Ajax.Insert = Insert;
    function Update(url, parameters, successMethod, failureMethod, target) {
        Ajax.HttpAction("PUT", url, parameters, successMethod, failureMethod, target);
    }
    Ajax.Update = Update;
    function Resolver() {
        var subDirectories = [];
        for (var _i = 0; _i < (arguments.length - 0); _i++) {
            subDirectories[_i] = arguments[_i + 0];
        }
        var split = window.SplitPathName(0).toLowerCase();
        var host = window.location.href.replace(window.location.pathname, "");
        for (var i = 0; i < subDirectories.length; i++) {
            if (subDirectories[i].toLowerCase() == split) {
                Ajax.Host = host + "/" + subDirectories[i], true;
                break;
            }
        }
    }
    Ajax.Resolver = Resolver;
    function setValues(obj, keyMap) {
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
                        } else {
                            delete obj[key];
                        }
                    } else {
                        obj[key] = new Date();
                    }
                    break;
                case "UTCDate":
                case "ZDate":
                    var tempDate = new Date(val);
                    if (Ajax.UseAsDateUTC) {
                        tempDate = new Date(tempDate.getUTCFullYear(), tempDate.getUTCMonth(), tempDate.getUTCDate());
                    } else if (Is.Chrome()) {
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
    Ajax.setValues = setValues;
    function ShowProgress() {
        if (Ajax.ProgressElement) {
            Ajax.ProgressElement.style.display = "inline";
        }
        if (Ajax.DisableElement) {
            if (Is.Array(Ajax.DisableElement)) {
                for (var i = 0; i < Ajax.DisableElement.length; i++) {
                    Ajax.DisableElement[i].setAttribute("disabled", "disabled");
                }
            } else {
                Ajax.DisableElement.setAttribute("disabled", "disabled");
            }
        }
    }
    Ajax.ShowProgress = ShowProgress;
    function Submit(method, url, parameters, returnMethod, failureMethod, contentType) {
        if (!failureMethod) {
            failureMethod = function (msg) {
                throw new Error(msg);
            };
        }
        var tempUrl = url;
        Ajax.ShowProgress();
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
                } else {
                    Ajax.HandleOtherStates(xmlhttp, failureMethod);
                }
            };
            xmlhttp.open(method, tempUrl, true);
            if (contentType) {
                xmlhttp.setRequestHeader("content-type", !Is.FireFox() ? contentType : "application/json;q=0.9");
            }
            try  {
                if (parameters) {
                    if (contentType == "application/json; charset=utf-8") {
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
                    } else {
                        xmlhttp.send(parameters);
                    }
                } else {
                    xmlhttp.send();
                }
            } catch (e) {
                Ajax.HideProgress();
                failureMethod(e.message);
            }
        }
    }
    Ajax.Submit = Submit;
    (function (View) {
        function Retrieve(url, callBack, error) {
            var stored = sessionStorage.getItem(url);
            if (!stored) {
                Ajax.HttpAction("GET", url, {}, function (result) {
                    sessionStorage.setItem(url, result);
                    callBack(result);
                }, function (result) {
                    error("Failed to retrieve html for " + url);
                }, null, true);
            } else {
                callBack(stored);
            }
        }
        View.Retrieve = Retrieve;
    })(Ajax.View || (Ajax.View = {}));
    var View = Ajax.View;
})(Ajax || (Ajax = {}));
var AutoSuggest;
(function (AutoSuggest) {
    function onKeyPress(e) {
        var key;
        var sender = null;
        var shiftKey = true;
        if (window.event) {
            key = window.event.keyCode;
            sender = window.event.srcElement;
            shiftKey = window.event.shiftKey;
        } else if (e) {
            key = e.which;
            sender = e.srcElement;
            shiftKey = e.shiftKey;
        }
        sender["hidelist"] = false;
        var value = sender.value ? sender.value : "";
        if (key != 8) {
            value += String.fromCharCode(key);
        } else {
            value = value.substring(0, value.length - 1);
        }
        if (!shiftKey && sender) {
            showList(sender, sender["displaycount"], value);
        }
    }
    function onMouseOut(input) {
        input["hidelist"] = true;
        setTimeout(function () {
            if (input["hidelist"]) {
                var list = input["AutocompleteList"];
                input["AutocompleteList"] = null;
                if (list) {
                    list.Remove();
                }
            }
        }, 1500);
    }
    function showList(sender, displaycount, value) {
        value = value.toLowerCase();
        var list = sender["AutocompleteList"];
        if (!list) {
            list = "select".CreateElement({ position: "absolute" });
            sender["AutocompleteList"] = list;
            document.body.appendChild(list);
            list.onchange = function () {
                setValue(sender, list);
                sender["hidelist"] = true;
                sender["AutocompleteList"] = null;
                list.Remove();
            };
            list.onmouseover = function () {
                sender["hidelist"] = false;
            };
            list.onmouseout = function () {
                onMouseOut(sender);
            };
        }
        var datasource = sender["datasource"];
        var displaymembers = sender["displaymembers"];
        var valuemember = sender["valuemember"];
        var displayjoiner = sender["displayjoiner"];
        list.options.length = 0;
        var showItems = datasource.Where(function (o) {
            return o.LowerCase.indexOf(value) > -1;
        }).Take(displaycount);
        for (var i = 0; i < showItems.length; i++) {
            var option = new Option(showItems[i].Display, showItems[i].Value);
            list.options[list.options.length] = option;
            ;
        }
        if (showItems.length > 0) {
            list.options[0].selected = "selected";
        }
        if (list.options.length > 0) {
            var diffAndPos = sender.DimAndOff();
            var height = sender.offsetHeight;
            list.style.width = (sender.offsetWidth + 16) + "px";
            list.style.top = (diffAndPos.Top + height) + "px";
            list.style.left = diffAndPos.Left + "px";
            list.style.display = "block";
            list.size = list.options.length < displaycount ? list.options.length : displaycount;
            list.style.display = "block";
        } else {
            list.style.display = "none";
        }
    }
    function Hook(input, dataSource, valueMember, displayMembers, displayJoiner, displayCount) {
        var newDataSource = new Array();
        dataSource.forEach(function (o) {
            newDataSource.push(new WrapperSourceObject(o, valueMember, displayMembers, displayJoiner));
        });
        input["datasource"] = newDataSource;
        input["valuemember"] = valueMember;
        input["displaymembers"] = displayMembers;
        input["displayjoiner"] = displayJoiner;
        input["displaycount"] = displayCount ? displayCount : 8;
        input.onkeydown = function (e) {
            input["hidelist"] = false;
            var key;
            var sender = null;
            var displaycount = input["displaycount"];
            var shiftKey = true;
            if (window.event) {
                key = window.event.keyCode;
                sender = window.event.srcElement;
                shiftKey = window.event.shiftKey;
            } else if (e) {
                key = e.which;
                sender = e.srcElement;
                shiftKey = e.shiftKey;
            }
            if (!shiftKey && sender) {
                var list = sender["AutocompleteList"];
                if (list) {
                    if (key == 13 || (key == 9 && list.options.length > 0 && list.value.length >= sender.value.length)) {
                        var index = list.selectedIndex > -1 ? list.selectedIndex : 0;
                        if (list.options.length > 0) {
                            setValue(sender, list, index);
                            input["AutocompleteList"] = null;
                            list.Remove();
                        }
                        if (window.event && key == 13) {
                            window.event.returnValue = false;
                        } else {
                            return;
                        }
                        return;
                    } else if (key == 38) {
                        if (list.selectedIndex > 0) {
                            list.options[list.selectedIndex - 1].selected = "selected";
                        } else {
                            list.options[0].selected = "selected";
                        }
                    } else if (key == 40) {
                        if (list.selectedIndex < list.options.length - 1) {
                            list.options[list.selectedIndex + 1].selected = "selected";
                        } else {
                            list.options[0].selected = "selected";
                        }
                    } else if (key == 8) {
                        onKeyPress(e);
                    }
                }
            }
        };
        input.onkeypress = function (e) {
            onKeyPress(e);
        };
        input.onmouseout = function (e) {
            onMouseOut(input);
        };
        input.onmouseover = function (e) {
            input["hidelist"] = false;
            showList(input, input["displaycount"], input.value);
        };
    }
    AutoSuggest.Hook = Hook;
    function setValue(input, list, selectedIndex) {
        selectedIndex = selectedIndex ? selectedIndex : list.selectedIndex;
        input.value = list.options[selectedIndex].text;
        input["SelectedValue"] = list.options[selectedIndex].value;
    }
    var WrapperSourceObject = (function () {
        function WrapperSourceObject(obj, valueMember, displayMembers, displayJoiner) {
            this.Source = obj;
            this.Value = obj[valueMember];
            var text = "";
            for (var j = 0; j < displayMembers.length; j++) {
                text += text != "" ? displayJoiner + obj[displayMembers[j]] : obj[displayMembers[j]];
            }
            this.Display = text;
            this.LowerCase = text.toLowerCase();
        }
        return WrapperSourceObject;
    })();
    AutoSuggest.WrapperSourceObject = WrapperSourceObject;
})(AutoSuggest || (AutoSuggest = {}));
var Binding;
(function (Binding) {
    Binding.Attributes = {
        OnMouseOver: "onmouseover",
        OnMouseOut: "onmouseout",
        OnClick: "onclick",
        OnFocus: "onfocus",
        Value: "value",
        InnerHTML: "innerHTML",
        For: "for",
        ID: "id",
        Checked: "checked",
        Src: "src",
        Href: "href",
        Style: "style",
        Class: "class",
        DisplayMember: "displaymember",
        ValueMember: "valuemember",
        ObjectSource: "objectsource",
        DataSource: "datasource",
        DataSourceMethod: "datasourcemethod",
        Radio: "radio",
        Prechange: "prechange",
        OnChange: "onchange",
        TargetProperty: "targetproperty",
        Formatting: "formatting",
        Delete: "delete"
    };

    //have this figure out everything it needs to know about
    //inline matches etc?
    //returns value no matter what?
    //take all other references to whatever figuring it out out
    var Attribute = (function () {
        //trying to do here is cache the function and pass the data over as array
        function Attribute(Name, Value) {
            this.Name = Name;
            this.Value = Value;
            var name = this.Name.toLowerCase();

            //is the name a style property ?
            if (Is.Style(this.Name)) {
                this.EasyBindable = true;
            } else {
                switch (name) {
                    case "objectsource":
                    case "datasource":
                    case "datasourcemethod":
                    case "valuemember":
                    case "displaymember":
                    case "checked":
                    case "radio":
                    case "onchange":
                    case "prechange":
                    case "targetproperty":
                    case "formatting":
                    case "delete":
                        this.Name = name;
                        this.EasyBindable = false;
                        break;
                    case "class":
                        this.Name = "className";
                        this.EasyBindable = true;
                        break;
                    case "innerhtml":
                        this.EasyBindable = true;
                        this.Name = "innerHTML";
                        break;
                    case "value":
                    case "for":
                    case "id":
                    case "onclick":
                    case "src":
                    case "href":

                    case "style":
                    default:
                        this.Name = name;
                        this.EasyBindable = true;
                        break;
                }
            }
            this.InlineMatches = new Array();
            this.ReturnMethod = null;
            this.ParameterProperties = new Array();
            this.InlineMatches = this.Value.match(RegularExpression.StandardBindingPattern);

            //if (!this.InlineMatches)
            //{
            //    this.InlineMatches = [this.Value];
            //}
            if (this.InlineMatches && this.InlineMatches.length > 0) {
                for (var i = 0; i < this.InlineMatches.length; i++) {
                    var prop = this.InlineMatches[i];
                    prop = prop.replace(RegularExpression.StandardBindingWrapper, "");
                    this.ParameterProperties.push(prop);
                }
            }
            if ((this.InlineMatches && this.InlineMatches.length > 1) || this.Value.indexOf("return") > -1 || this.Name == Binding.Attributes.OnClick || this.Name == Binding.Attributes.OnFocus || this.Name == Binding.Attributes.Prechange || this.Name == Binding.Attributes.OnMouseOut || this.Name == Binding.Attributes.OnMouseOver) {
                //set up the return method and the parameter array
                this.CreateTheReturn();
            }
        }
        Attribute.prototype.RawLine = function () {
            var method = this.Value;

            //.match(RegularExpression.MethodPattern);
            //if (bindingValue.indexOf("return ") == 0 || objectAndMethod) {
            if (method.substring(0, 6) != "return") {
                method = "return " + method;
            }
            if (method.substring(method.length - 1) != ";") {
                method += ";";
            }
            if (this.InlineMatches) {
                for (var i = 0; i < this.InlineMatches.length; i++) {
                    method = method.replace(this.InlineMatches[i], "obj" + i.toString());
                }
            }
            return method;
        };
        Attribute.prototype.CreateTheReturn = function () {
            switch (this.ParameterProperties.length) {
                case 0:
                    this.ReturnMethod = new Function(this.RawLine());
                    break;
                case 1:
                    this.ReturnMethod = new Function("obj0", this.RawLine());
                    break;
                case 2:
                    this.ReturnMethod = new Function("obj0", "obj1", this.RawLine());
                    break;
                case 3:
                    this.ReturnMethod = new Function("obj0", "obj1", "obj2", this.RawLine());
                    break;
                case 4:
                    this.ReturnMethod = new Function("obj0", "obj1", "obj2", "obj3", this.RawLine());
                    break;
                case 5:
                    this.ReturnMethod = new Function("obj0", "obj1", "obj2", "obj3", "obj4", this.RawLine());
                    break;
                default:
                    return null;
            }
        };

        //ExecuteReturn(element) {
        //    return null;
        //}
        Attribute.prototype.Return = function (element) {
            var obj = Binding.Get.Object(element);
            if (this.ReturnMethod) {
                var arrayOfValues = new Array();
                for (var i = 0; i < this.ParameterProperties.length; i++) {
                    var property = this.ParameterProperties[i];
                    if (property == "sender") {
                        arrayOfValues.push(element);
                    } else if (property == "obj") {
                        arrayOfValues.push(obj);
                    } else {
                        arrayOfValues.push(this.DrilldownValue(obj, property));
                    }
                }
                switch (arrayOfValues.length) {
                    case 0:
                        return this.ReturnMethod();
                    case 1:
                        return this.ReturnMethod(arrayOfValues[0]);
                    case 2:
                        return this.ReturnMethod(arrayOfValues[0], arrayOfValues[1]);
                    case 3:
                        return this.ReturnMethod(arrayOfValues[0], arrayOfValues[1], arrayOfValues[2]);
                    case 4:
                        return this.ReturnMethod(arrayOfValues[0], arrayOfValues[1], arrayOfValues[2], arrayOfValues[3]);
                    case 5:
                        return this.ReturnMethod(arrayOfValues[0], arrayOfValues[1], arrayOfValues[2], arrayOfValues[3], arrayOfValues[4]);
                    default:
                        return null;
                }
            } else if (this.ParameterProperties.length == 1) {
                return this.DrilldownValue(obj, this.ParameterProperties[0]);
            } else {
                return this.DrilldownValue(obj, this.Value);
            }
        };
        Attribute.prototype.DrilldownValue = function (obj, property) {
            var properties = property.split(".");
            var dataObject = obj;
            for (var i = 0; i < properties.length; i++) {
                if (Is.Property(properties[i], dataObject)) {
                    if (i + 1 == properties.length) {
                        return dataObject[properties[i]];
                    } else {
                        dataObject = dataObject[properties[i]];
                    }
                } else {
                    return null;
                }
            }
            return null;
        };
        return Attribute;
    })();
    Binding.Attribute = Attribute;
    (function (ActionType) {
        ActionType[ActionType["Insert"] = 0] = "Insert";
        ActionType[ActionType["Update"] = 1] = "Update";
        ActionType[ActionType["Delete"] = 2] = "Delete";
    })(Binding.ActionType || (Binding.ActionType = {}));
    var ActionType = Binding.ActionType;
    var Wrapper = (function () {
        function Wrapper(source) {
            this.WebApi = null;
            this.PrimaryKeys = new Array();
            this.NewRowBeingAdded = null;
            this.DataChanged = null;
            this.RequestChange = null;
            this.ExceptionEvent = null;
            this.ExceptionMethod = null;
            this.BindingArray = new Array();
            this.GetParameter = null;
            this.IsPatch = false;
            this.CanDelete = false;
            this.PrebindAction = null;
            this.RowBinding = null;
            this.IsForm = false;
            this.AsyncLoad = false;
            this.IsGranularUpdate = false;
            this.InitialLoad = true;
            this.UpdateEvent = null;
            this.SelectedItemChanged = null;
            this.SelectedListItemClass = null;
            this.ListItemClass = null;
            this.Form = null;
            if (source && Is.String(source)) {
                source = JSON.parse(source);
            }
            Thing.Merge(source, this);
            if (Is.String(this.NewRowBeingAdded)) {
                this.NewRowBeingAdded = new Function("obj", "return " + this.NewRowBeingAdded + "(obj);");
            }
            if (Is.String(this.RequestChange)) {
                this.RequestChange = new Function("obj", "target", "value", "return " + this.RequestChange + "(obj, target, value);");
            }
            if (!Is.NullOrEmpty(this.UpdateEvent) && Is.String(this.UpdateEvent)) {
                this.UpdateEvent = new Function("obj", "actionType", "field", "return " + this.UpdateEvent + "(obj, actionType, field);");
            }
            if (!Is.NullOrEmpty(this.SelectedItemChanged) && Is.String(this.SelectedItemChanged)) {
                this.SelectedItemChanged = new Function("obj", "sender", "return " + this.SelectedItemChanged + "(obj, sender);");
            }
            if (!Is.NullOrEmpty(this.Form) && Is.String(this.Form)) {
                this.Form = this.Form.E();
            }
        }
        return Wrapper;
    })();
    Binding.Wrapper = Wrapper;
    (function (Get) {
        function InlineReturn(returnLine, arrayOfValues) {
            switch (arrayOfValues.length) {
                case 0:
                    var fun = new Function(returnLine);
                    return fun();
                case 1:
                    var fun = new Function("obj0", returnLine);
                    return fun(arrayOfValues[0]);
                case 2:
                    var fun = new Function("obj0", "obj1", returnLine);
                    return fun(arrayOfValues[0], arrayOfValues[1]);
                case 3:
                    var fun = new Function("obj0", "obj1", "obj2", returnLine);
                    return fun(arrayOfValues[0], arrayOfValues[1], arrayOfValues[2]);
                case 4:
                    var fun = new Function("obj0", "obj1", "obj2", "obj3", returnLine);
                    return fun(arrayOfValues[0], arrayOfValues[1], arrayOfValues[2], arrayOfValues[3]);
                case 5:
                    var fun = new Function("obj0", "obj1", "obj2", "obj3", "obj4", returnLine);
                    return fun(arrayOfValues[0], arrayOfValues[1], arrayOfValues[2], arrayOfValues[3], arrayOfValues[4]);
                default:
                    return null;
            }
        }
        Get.InlineReturn = InlineReturn;
        function ExtendedProperty(value) {
            value = value.replace(RegularExpression.StandardBindingWrapper, "");
            var ret = {
                Extended: value,
                Target: value
            };
            if (value.indexOf(".") > -1) {
                var temp = value.split(".");
                ret.Target = temp[temp.length - 1];
            }
            return ret;
        }
        Get.ExtendedProperty = ExtendedProperty;
        function BoundElements(source) {
            var boundElements = source.Get(function (obj) {
                return obj.getAttribute("data-binding") || obj.DataObject;
            });
            return boundElements;
        }
        Get.BoundElements = BoundElements;
        function Object(element, property, callingElement) {
            var dataObject = null;
            if (!callingElement) {
                callingElement = element;
            }
            if (element.DataObject) {
                dataObject = element.DataObject;
            } else if (element.parentNode["DataObject"]) {
                dataObject = element.parentNode["DataObject"];
            } else if (element.parentNode) {
                dataObject = Binding.Get.Object(element.parentNode, property, callingElement);
            }
            if (property) {
                if (dataObject && element == callingElement && property.indexOf(".") > -1) {
                    var properties = property.split(".");
                    for (var i = 0; i < properties.length; i++) {
                        if (Is.Property(properties[i], dataObject)) {
                            if (i + 1 < properties.length) {
                                dataObject = dataObject[properties[i]];
                            }
                        } else {
                            dataObject = null;
                            break;
                        }
                    }
                }
            }
            return dataObject;
        }
        Get.Object = Object;
        function PrimaryKey(element) {
            var pn = element.parentNode;
            if (pn.Wrapper) {
                return pn.Wrapper.PrimaryKeys;
            } else if (pn) {
                return Binding.Get.PrimaryKey(pn);
            }
            return null;
        }
        Get.PrimaryKey = PrimaryKey;
        function TemplateAttributes(element) {
            var dataBindings = element.getAttribute("data-binding");
            var ret = {
                LineType: null,
                InsertPosition: null
            };
            if (dataBindings) {
                dataBindings = dataBindings.Trim();
                if (dataBindings.indexOf("{") == 0) {
                    ret = JSON.parse(dataBindings);
                } else {
                    dataBindings = dataBindings.split("::");
                    for (var i = 0; i < dataBindings.length; i++) {
                        var dataBinding = dataBindings[i].split(":");
                        if (dataBinding.length == 1) {
                            ret.LineType = dataBinding[0].Trim();
                        } else {
                            ret[dataBinding[0].Trim()] = dataBinding[1].Trim();
                        }
                    }
                }
            }
            return ret;
        }
        Get.TemplateAttributes = TemplateAttributes;
        function Attributes(dataBinding, element) {
            var ret = new Array();
            var tempObj = null;
            if (Is.String(dataBinding) && dataBinding.indexOf("{") == 0 && dataBinding.substring(dataBinding.length - 1) == "}") {
                tempObj = JSON.parse(dataBinding);
            } else if (Is.Object(dataBinding)) {
                tempObj = dataBinding;
            }
            if (tempObj && element) {
                for (var prop in tempObj) {
                    if (!Is.Function(tempObj[prop])) {
                        var att = this.Attribute({ Name: prop, Value: tempObj[prop] }, element);
                        if (att) {
                            ret.push(att);
                        }
                    }
                }
            } else if (Is.String(dataBinding) && element) {
                var splits = dataBinding.split("::");
                for (var i = 0; i < splits.length; i++) {
                    var att = this.Attribute(splits[i], element);
                    if (att) {
                        ret.push(att);
                    }
                }
            }
            return ret;
        }
        Get.Attributes = Attributes;
        function DataChanged(dataChanged, element, obj, property) {
            if (dataChanged) {
                if (Is.String(dataChanged)) {
                    var inlineMatches = dataChanged.match(RegularExpression.StandardBindingPattern);
                    var isReturn = dataChanged.indexOf("return") == 0 || dataChanged.match(RegularExpression.MethodPattern);

                    //set up isreturn
                    if (isReturn) {
                        Binding.Get.ReturnValue(dataChanged, element, inlineMatches);
                    }
                } else {
                    dataChanged(obj, property);
                }
            }
        }
        Get.DataChanged = DataChanged;
        function ReturnValue(bindingValue, element, inlineMatches) {
            var arrayOfValues = new Array();
            var tempValue = null;
            var objectAndMethod = bindingValue.match(RegularExpression.ObjectAndMethod);
            var method = bindingValue;

            //.match(RegularExpression.MethodPattern);
            //if (bindingValue.indexOf("return ") == 0 || objectAndMethod) {
            method = bindingValue;
            if (method.substring(0, 6) != "return") {
                method = "return " + method;
            }
            if (method.substring(method.length - 1) != ";") {
                method += ";";
            }
            if (inlineMatches) {
                for (var i = 0; i < inlineMatches.length; i++) {
                    if (inlineMatches[i] == "{obj}") {
                        arrayOfValues.push(Binding.Get.Object(element));
                        method = method.replace("{obj}", "obj" + i.toString());
                    } else if (inlineMatches[i] == "{sender}") {
                        arrayOfValues.push(element);
                        method = method.replace("{sender}", "obj" + i.toString());
                    } else {
                        var extProp = Binding.Get.ExtendedProperty(inlineMatches[i]);
                        var tempObj = Binding.Get.Object(element, extProp.Extended);
                        arrayOfValues.push(tempObj[extProp.Target]);
                        method = method.replace(inlineMatches[i], "obj" + i.toString());
                    }
                }
            }
            tempValue = Binding.Get.InlineReturn(method, arrayOfValues);
            return tempValue;
        }
        Get.ReturnValue = ReturnValue;
        function Attribute(line, element) {
            var attributeAndValue = null;
            if (Is.String(line)) {
                attributeAndValue = line.split(":");
                if (attributeAndValue.length == 1) {
                    var tagName = element.tagName.toLowerCase();
                    var attributeValue = attributeAndValue[0];
                    switch (tagName) {
                        case "input":
                            var input = element;
                            var type = input.type.toLowerCase();
                            switch (type) {
                                case "button":
                                    attributeAndValue = { Name: Binding.Attributes.OnClick, Value: attributeValue };
                                    break;
                                case "checkbox":
                                    attributeAndValue = { Name: Binding.Attributes.Checked, Value: attributeValue };
                                    break;
                                case "radio":
                                    attributeAndValue = { Name: Binding.Attributes.Radio, Value: attributeValue };
                                    break;
                                case "text":
                                case "password":
                                case "hidden":
                                    attributeAndValue = { Name: Binding.Attributes.Value, Value: attributeValue };
                                    break;
                                default:
                                    break;
                            }
                            break;
                        case "textarea":
                        case "select":
                            attributeAndValue = { Name: Binding.Attributes.Value, Value: attributeValue };
                            break;
                        case "label":
                            attributeAndValue = { Name: Binding.Attributes.For, Value: attributeValue };
                            break;
                        case "img":
                            attributeAndValue = { Name: Binding.Attributes.Src, Value: attributeValue };
                            break;
                        case "a":
                        case "div":
                        case "span":
                            attributeAndValue = { Name: Binding.Attributes.InnerHTML, Value: attributeValue };
                            break;
                        case Binding.Attributes.Formatting:
                        case Binding.Attributes.TargetProperty:
                            attributeAndValue = { Name: Binding.Attributes.TargetProperty, Value: attributeValue };
                            break;
                        default:
                            break;
                    }
                } else {
                    attributeAndValue = { Name: attributeAndValue[0], Value: attributeAndValue[1] };
                }
            } else {
                attributeAndValue = line;
            }
            if (attributeAndValue) {
                var att = new Binding.Attribute(attributeAndValue.Name, attributeAndValue.Value);
                return att;
            }
            return null;
        }
        Get.Attribute = Attribute;
    })(Binding.Get || (Binding.Get = {}));
    var Get = Binding.Get;
    (function (Set) {
        function SetBinding(element, wrapper, attributes) {
            try  {
                for (var i = 0; i < attributes.length; i++) {
                    var att = attributes[i];
                    if (att.EasyBindable) {
                        Binding.Set.AttributeValue(element, att);
                    } else if (att.Name == "delete") {
                        Binding.Set.Delete(element, wrapper, att);
                    }
                }
                var tagName = element.tagName.toLowerCase();
                switch (tagName) {
                    case "input":
                        var input = element;
                        var type = input.type.toLowerCase();
                        switch (type) {
                            case "checkbox":
                                Binding.Set.Checked(element, wrapper, attributes);
                                break;
                            case "radio":
                                Binding.Set.Radio(element, wrapper, attributes);
                                break;
                            case "text":
                            case "password":
                            case "hidden":
                            default:
                                Binding.Set.OnChange(element, wrapper, attributes);
                                break;
                        }
                        break;
                    case "textarea":
                        Binding.Set.OnChange(element, wrapper, attributes);
                        break;
                    case "select":
                        Binding.Set.DataSource(element, wrapper, attributes);
                        Binding.Set.OnChange(element, wrapper, attributes);
                        break;
                    default:
                        break;
                }
                //now hook onchange of value and select
                //click of checked and radio
            } catch (e) {
                if (wrapper.ExceptionMethod) {
                    wrapper.ExceptionMethod(e);
                }
            }
        }
        Set.SetBinding = SetBinding;
        function AttributeValue(element, att) {
            var tempValue = att.Value;
            if (att.Name == Binding.Attributes.OnClick) {
                element.onclick = function () {
                    return att.Return(element);
                };
            } else if (att.Name == "onmouseover") {
                element.onmouseover = function () {
                    return att.Return(element);
                };
            } else if (att.Name == "onmouseout") {
                element.onmouseout = function () {
                    return att.Return(element);
                };
            } else if (att.Name == Binding.Attributes.OnFocus) {
                element.onfocus = function () {
                    return att.Return(element);
                };
            } else {
                tempValue = att.Return(element);
                if (att.Name == "classname" || att.Name == "cls") {
                    element.className = null;
                    element.className = tempValue;
                } else if (att.Name == "for") {
                    element.setAttribute("for", tempValue);
                } else if (Is.Property(att.Name, element)) {
                    element[att.Name] = null;
                    element[att.Name] = tempValue;
                } else if (Is.Style(att.Name)) {
                    element.style[att.Name] = tempValue;
                }
            }
        }
        Set.AttributeValue = AttributeValue;
        function Cascade(element, prop) {
            var boundElements = document.body.Get(function (ele) {
                var temp = ele;
                return temp.DataObject && temp.BindingAttributes && temp != element && temp.DataObject == element.DataObject && temp.BindingAttributes.First(function (ba) {
                    return ba.Value == prop;
                });
            });
            boundElements.forEach(function (ele) {
                var temp = ele;
                Binding.Set.SetBinding(temp, temp.Wrapper, temp.BindingAttributes);
            });
        }
        Set.Cascade = Cascade;
        function PostChange(element, wrapper, attributes, tempObj, extProp) {
            var dcMethod = attributes.First(function (o) {
                return o.Name == Binding.Attributes.OnChange;
            });
            if (dcMethod) {
                dcMethod.Return(element);
            } else {
                Binding.Get.DataChanged(wrapper.DataChanged, element, tempObj, extProp.Target);
            }
            Binding.Set.Cascade(element, extProp.Target);
        }
        Set.PostChange = PostChange;
        function Delete(element, wrapper, attribute) {
            if (!element.onclick) {
                element.onclick = function () {
                    //gonna need parent ul
                    //gonna need li
                    var parameter = {};
                    if (wrapper.PrimaryKeys) {
                        for (var i = 0; i < wrapper.PrimaryKeys.length; i++) {
                            parameter[wrapper.PrimaryKeys[i]] = element.DataObject[wrapper.PrimaryKeys[i]];
                        }
                    }
                    if (wrapper.WebApi) {
                        //presumably this is always tabular based
                        wrapper.WebApi.Delete(parameter, function (result) {
                            var ul = element.Parent(function (p) {
                                return p.tagName == "UL";
                            });
                            var li = ul.First(function (l) {
                                return l.tagName == "LI" && l.DataObject == element.DataObject;
                            });
                            li.Remove();
                            var array = ul.DataObject;
                            array.Remove(function (obj) {
                                return obj == element.DataObject;
                            });
                            Updated(element.DataObject, 2 /* Delete */, wrapper, attribute.Name);
                        }, function (result) {
                        });
                    } else {
                        var ul = element.Parent(function (p) {
                            return p.tagName == "UL";
                        });
                        var array = ul.DataObject;
                        array.Remove(function (obj) {
                            return obj == element.DataObject;
                        });
                        var li = ul.First(function (l) {
                            return l.tagName == "LI" && l.DataObject == element.DataObject;
                        });
                        li.Remove();
                    }
                };
            }
        }
        Set.Delete = Delete;
        function Updated(obj, actionType, wrapper, field) {
            if (wrapper.UpdateEvent) {
                wrapper.UpdateEvent(obj, actionType, field);
            }
        }
        Set.Updated = Updated;
        function OnChange(element, wrapper, attributes) {
            var attribute = attributes.First(function (o) {
                return o.Name == Binding.Attributes.Value;
            });
            if (!wrapper) {
                wrapper = new Binding.Wrapper();
            }
            var tempElement = element;
            if (!tempElement.onchange) {
                tempElement.onchange = function () {
                    var canChange = true;
                    var extProp = Binding.Get.ExtendedProperty(attribute.Value);
                    var tempObj = Binding.Get.Object(element, extProp.Extended);
                    var tp = attributes.First(function (o) {
                        return o.Name == Binding.Attributes.TargetProperty;
                    });
                    if (tp) {
                        extProp.Target = tp.Value;
                        tempObj = Binding.Get.Object(element, extProp.Target);
                    }
                    if (tempObj) {
                        var prechange = attributes.First(function (o) {
                            return o.Name == Binding.Attributes.Prechange;
                        });
                        if (prechange) {
                            prechange.Return(element);
                        }
                        if (wrapper.RequestChange) {
                            canChange = wrapper.RequestChange(tempObj, extProp.Target, tempElement.value);
                        }
                        if (canChange) {
                            SetObjectValue(tempObj, extProp.Target, tempElement.value);
                            if (wrapper.WebApi) {
                                wrapper.WebApi.Update(UpdateParameter(wrapper, extProp, tempObj), function (result) {
                                    if (result && Is.Property(extProp.Target, result)) {
                                        tempElement.value = result[extProp.Target];
                                        SetObjectValue(tempObj, extProp.Target, result[extProp.Target].toString());
                                        Thing.Merge(result, tempObj);

                                        //do formatting method here
                                        var formatting = attributes.First(function (o) {
                                            return o.Name == Binding.Attributes.Formatting;
                                        });
                                        if (formatting) {
                                            var formattedValue = formatting.Return(element);
                                            tempElement.value = formattedValue;
                                        }
                                        PostChange(element, wrapper, attributes, tempObj, extProp);
                                        Updated(element.DataObject, 1 /* Update */, wrapper, extProp.Target);
                                    }
                                }, function (result) {
                                    if (wrapper.ExceptionEvent) {
                                        wrapper.ExceptionEvent(result, tempObj, extProp.Target);
                                    }
                                });
                            } else {
                                PostChange(element, wrapper, attributes, tempObj, extProp);
                                Updated(element.DataObject, 1 /* Update */, wrapper, extProp.Target);
                            }
                        } else if (Is.Property(extProp.Target, tempObj)) {
                            tempElement.value = tempObj[extProp.Target];
                        }
                    }
                };
            }
        }
        Set.OnChange = OnChange;
        function UpdateParameter(wrapper, extProp, tempObj) {
            var parameter = {};
            if (wrapper.IsGranularUpdate) {
                if (wrapper.PrimaryKeys) {
                    for (var i = 0; i < wrapper.PrimaryKeys.length; i++) {
                        parameter[wrapper.PrimaryKeys[i]] = tempObj[wrapper.PrimaryKeys[i]];
                    }
                }
                parameter[extProp.Target] = tempObj[extProp.Target];
            } else {
                parameter = tempObj;
            }
            return parameter;
        }
        Set.UpdateParameter = UpdateParameter;
        function SetObjectValue(obj, property, newValue) {
            var currentValue = obj[property];
            var tempString = newValue;

            //no need to test the property not the value
            //if (typeof value === "string") {
            if (typeof currentValue === "number") {
                obj[property] = parseFloat(tempString);
            } else {
                obj[property] = tempString;
            }
        }
        Set.SetObjectValue = SetObjectValue;
        function Checked(element, wrapper, attributes) {
            var attribute = attributes.First(function (o) {
                return o.Name == Binding.Attributes.Checked;
            });
            if (!wrapper) {
                wrapper = new Binding.Wrapper();
            }
            var input = element;
            var extProp = Binding.Get.ExtendedProperty(attribute.Value);
            var obj = Binding.Get.Object(element, extProp.Extended);
            if (Is.Property(extProp.Target, obj)) {
                input.checked = obj[extProp.Target] ? true : false;
            } else {
                input.checked = null;
            }
            if (!input.onclick) {
                input.onclick = function () {
                    var checked = false;
                    var tempObj = Binding.Get.Object(element, extProp.Extended);
                    if (input.checked) {
                        checked = true;
                    }
                    var objChecked = tempObj[extProp.Target] ? tempObj[extProp.Target] : false;
                    if (objChecked != checked) {
                        var canChange = true;
                        var prechange = attributes.First(function (o) {
                            return o.Name == Binding.Attributes.Prechange;
                        });
                        if (prechange) {
                            prechange.Return(element);
                        }
                        if (wrapper.RequestChange) {
                            canChange = wrapper.RequestChange(tempObj, extProp.Target, checked);
                        }
                        if (canChange) {
                            tempObj[extProp.Target] = checked;
                            if (wrapper.WebApi) {
                                wrapper.WebApi.Update(UpdateParameter(wrapper, extProp, tempObj), function (result) {
                                    if (result && Is.Property(extProp.Target, result)) {
                                        input.checked = result[extProp.Target] ? true : false;
                                        tempObj[extProp.Target] = result[extProp.Target];
                                        Thing.Merge(result, tempObj);
                                        PostChange(element, wrapper, attributes, tempObj, extProp);
                                        Updated(element.DataObject, 1 /* Update */, wrapper, extProp.Target);
                                    }
                                }, function (result) {
                                    if (wrapper.ExceptionEvent) {
                                        wrapper.ExceptionEvent(result, tempObj, extProp.Target);
                                    }
                                });
                            } else {
                                PostChange(element, wrapper, attributes, tempObj, extProp);
                            }
                        } else if (Is.Property(extProp.Target, tempObj)) {
                            input.checked = tempObj[extProp.Target];
                        }
                    }
                };
            }
        }
        Set.Checked = Checked;
        function Radio(element, wrapper, attributes) {
            var attribute = attributes.First(function (o) {
                return o.Name == Binding.Attributes.Radio;
            });
            if (!wrapper) {
                wrapper = new Binding.Wrapper();
            }
            var input = element;
            if (attribute) {
                var extProp = Binding.Get.ExtendedProperty(attribute.Value);
                var obj = Binding.Get.Object(element, extProp.Extended);
                if (Is.Property(extProp.Target, obj) && input.value == obj[extProp.Target]) {
                    input.checked = true;
                } else {
                    input.checked = null;
                }
                if (!input.onclick) {
                    input.onclick = function () {
                        var checked = false;
                        var canChange = true;
                        var tempObj = Binding.Get.Object(element, extProp.Extended);
                        if (input.checked) {
                            checked = true;
                        }
                        var prechange = attributes.First(function (o) {
                            return o.Name == Binding.Attributes.Prechange;
                        });
                        if (prechange) {
                            prechange.Return(element);
                        }
                        var objChecked = tempObj[extProp.Target] ? tempObj[extProp.Target] == input.value : false;
                        if (objChecked != checked) {
                            if (wrapper.RequestChange) {
                                canChange = wrapper.RequestChange(tempObj, extProp.Target, input.value);
                            }
                            if (canChange) {
                                SetObjectValue(tempObj, extProp.Target, input.value);
                                if (wrapper.WebApi) {
                                    wrapper.WebApi.Update(UpdateParameter(wrapper, extProp, tempObj), function (result) {
                                        if (result && Is.Property(extProp.Target, result)) {
                                            tempObj[extProp.Target] = result[extProp.Target];
                                            if (tempObj[extProp.Target] != input.value) {
                                                input.checked = false;
                                            }
                                            Thing.Merge(result, tempObj);
                                            Updated(element.DataObject, 1 /* Update */, wrapper, extProp.Target);
                                        }
                                        PostChange(element, wrapper, attributes, tempObj, extProp);
                                    }, function (result) {
                                        if (wrapper.ExceptionEvent) {
                                            wrapper.ExceptionEvent(result, tempObj, extProp.Target);
                                        }
                                    });
                                } else {
                                    PostChange(element, wrapper, attributes, tempObj, extProp);
                                }
                            }
                        }
                    };
                }
            }
        }
        Set.Radio = Radio;
        function DataSource(element, wrapper, attributes) {
            if (!wrapper) {
                wrapper = new Binding.Wrapper();
            }
            var valueAttr = attributes.First(function (o) {
                return o.Name == Binding.Attributes.Value;
            });
            var extProp = Binding.Get.ExtendedProperty(valueAttr.Value);
            var obj = Binding.Get.Object(element, extProp.Extended);
            var selectedValue;
            if (Is.Property(extProp.Target, obj)) {
                selectedValue = obj[extProp.Target];
            }
            var vm, dm;
            vm = attributes.First(function (o) {
                return o.Name == Binding.Attributes.ValueMember;
            });
            dm = attributes.First(function (o) {
                return o.Name == Binding.Attributes.DisplayMember;
            });
            var select = element;
            select.Clear();
            if (attributes.First(function (o) {
                return o.Name == Binding.Attributes.DataSource;
            })) {
                var dataSource = attributes.First(function (o) {
                    return o.Name == Binding.Attributes.DataSource;
                });
                var dataObject = new Function("return " + dataSource.Value + ";");
                if (vm != null && dm != null) {
                    select.AddOptions(dataObject(), vm.Value, dm.Value, selectedValue);
                } else {
                    select.AddOptions(dataObject(), null, null, selectedValue);
                }
            } else if (attributes.First(function (o) {
                return o.Name == Binding.Attributes.ObjectSource;
            })) {
                var objectSource = attributes.First(function (o) {
                    return o.Name == Binding.Attributes.ObjectSource;
                });
                var dataObject = new Function("return " + objectSource.Value + ";");
                select.AddOptionsViaObject(dataObject(), selectedValue);
            } else if (attributes.First(function (o) {
                return o.Name == Binding.Attributes.DataSourceMethod;
            })) {
                var dataSourceMethod = attributes.First(function (o) {
                    return o.Name == Binding.Attributes.DataSourceMethod;
                });
                var func = new Function("obj", "return " + dataSourceMethod.Value + "(obj);");
                select.AddOptions(func(obj), vm.Value, dm.Value, selectedValue);
            }
        }
        Set.DataSource = DataSource;
    })(Binding.Set || (Binding.Set = {}));
    var Set = Binding.Set;
    function Execute(element, data, appendData) {
        if (appendData && element.DataObject && Is.Array(element.DataObject)) {
            element.DataObject.Add(data);
        } else {
            element.DataObject = data;
        }
        var wrapper;
        if (element.getAttribute("data-binding")) {
            var json = element.getAttribute("data-binding");
            element.Wrapper = new Binding.Wrapper(json);
            element.removeAttribute("data-binding");
            wrapper = element.Wrapper;
        } else if (element.Wrapper) {
            wrapper = element.Wrapper;
        } else if (!element.Wrapper) {
            element.Wrapper = wrapper;
        }
        var tagName = element.tagName.toLowerCase();
        if (tagName == "ul" && !wrapper.IsForm) {
            Binding.Grid.Execute(element, data, appendData);
        } else {
            Binding.subExecute(element, wrapper);
        }
    }
    Binding.Execute = Execute;
    function subExecute(element, wrapper, ignoreElement) {
        var boundElements = Binding.Get.BoundElements(element);
        for (var i = 0; i < boundElements.length; i++) {
            var ele = boundElements[i];
            if (!ele.DataObject) {
                ele.DataObject = element.DataObject;
                ele["BoundParent"] = element;
                ele.Wrapper = wrapper;
                if (wrapper.BindingArray.length == i) {
                    var dataBinding = ele.getAttribute("data-binding").Trim();
                    var attributes = Binding.Get.Attributes(dataBinding, ele);
                    wrapper.BindingArray.push({ Attributes: attributes });
                    ele.BindingAttributes = attributes;
                } else {
                    ele.BindingAttributes = wrapper.BindingArray[i].Attributes;
                }
                ele.removeAttribute("data-binding");
            }
            ele.DataObject = element.DataObject;
            if (ele.BindingAttributes) {
                Binding.Set.SetBinding(ele, wrapper, ele.BindingAttributes);
            }
        }
        if (wrapper.RowBinding) {
            Binding.Set.SetBinding(element, wrapper, wrapper.RowBinding);
        }
    }
    Binding.subExecute = subExecute;
    function AsynchSubExecute(element, wrapper, obj, unorderedList) {
        element.DataObject = obj;
        if (element.tagName == "LI" && !unorderedList.Wrapper.IsForm) {
            Binding.Grid.HookUpListItemClicked(unorderedList, obj, element);
        }
        var boundElements = Binding.Get.BoundElements(element);
        for (var i = 0; i < boundElements.length; i++) {
            var ele = boundElements[i];
            if (!ele.DataObject) {
                ele.DataObject = element.DataObject;
                ele["BoundParent"] = element;
                ele.Wrapper = wrapper;
                if (wrapper.BindingArray.length == i) {
                    var dataBinding = ele.getAttribute("data-binding").Trim();
                    var attributes = Binding.Get.Attributes(dataBinding, ele);
                    wrapper.BindingArray.push({ Attributes: attributes });
                    ele.BindingAttributes = attributes;
                } else {
                    ele.BindingAttributes = wrapper.BindingArray[i].Attributes;
                }
                ele.removeAttribute("data-binding");
            }
            ele.DataObject = element.DataObject;
        }
        boundElements.forEach(function (ele) {
            setTimeout(Binding.Set.SetBinding, 0, ele, wrapper, ele.BindingAttributes);
        });
        if (wrapper.RowBinding) {
            Binding.Set.SetBinding(element, wrapper, wrapper.RowBinding);
        }
    }
    Binding.AsynchSubExecute = AsynchSubExecute;
    (function (Grid) {
        Grid.LineTypes = { Header: "Header", Footer: "Footer", Template: "Template" };
        function Add(unorderedList, data, appendData) {
            var arrayOfdata;
            if (Is.Array(data)) {
                arrayOfdata = data;
            } else {
                arrayOfdata = new Array();
                arrayOfdata.Add(data);
            }
            if (unorderedList.Wrapper.AsyncLoad) {
                AsyncBind(unorderedList, data, appendData);
            } else {
                for (var i = 0; i < arrayOfdata.length; i++) {
                    Binding.Grid.AddItem(unorderedList, arrayOfdata[i]);
                }
                if (arrayOfdata.length > 0) {
                    var obj = arrayOfdata[0];
                    var li = unorderedList.First(function (e) {
                        return e.tagName == "LI" && e.DataObject;
                    });
                    if (li) {
                        SetSelected(unorderedList, obj, li);
                    }
                }
                unorderedList.Wrapper.InitialLoad = false;
            }
        }
        Grid.Add = Add;
        function SetSelected(unorderedList, obj, listitem) {
            if (unorderedList.Wrapper.SelectedItemChanged) {
                unorderedList.Wrapper.SelectedItemChanged(obj, listitem);
            }
            if (unorderedList.SelectedElement && unorderedList.Wrapper.SelectedListItemClass) {
                unorderedList.SelectedElement.className = unorderedList.Wrapper.ListItemClass;
            }
            unorderedList.SelectedElement = listitem;
            if (unorderedList.Wrapper.SelectedListItemClass) {
                unorderedList.SelectedElement.className = unorderedList.Wrapper.SelectedListItemClass;
            }
            if (unorderedList.Wrapper.Form) {
                unorderedList.Wrapper.Form.Bind(obj);
            }
        }
        Grid.SetSelected = SetSelected;
        function HookUpListItemClicked(unorderedList, obj, listitem) {
            listitem.onclick = function () {
                SetSelected(unorderedList, obj, listitem);
            };
        }
        Grid.HookUpListItemClicked = HookUpListItemClicked;
        function CreateListItem(unorderedList, tempObj, wrapper) {
            var listitem = GetListItem(unorderedList.Template.style, unorderedList.Template.cls, unorderedList.Template.innerHTML, tempObj, wrapper);
            HookUpListItemClicked(unorderedList, tempObj, listitem);
            if (unorderedList.HasFooter) {
                var footer = unorderedList.First(function (o) {
                    return o["LineType"] == Binding.Grid.LineTypes.Footer;
                });
                if (wrapper.NewRowBeingAdded) {
                    var insertListItem = wrapper.NewRowBeingAdded(tempObj);
                    if (insertListItem) {
                        if (footer) {
                            unorderedList.insertBefore(insertListItem, footer);
                        } else {
                            unorderedList.appendChild(insertListItem);
                        }
                    }
                }
                if (footer) {
                    unorderedList.insertBefore(listitem, footer);
                } else {
                    unorderedList.appendChild(listitem);
                }
            } else {
                if (wrapper.NewRowBeingAdded) {
                    var insertListItem = wrapper.NewRowBeingAdded(tempObj);
                    if (insertListItem) {
                        unorderedList.appendChild(insertListItem);
                    }
                }
                unorderedList.appendChild(listitem);
            }
        }
        Grid.CreateListItem = CreateListItem;
        function EndAsyncBind(unorderedList) {
            var div;
            if (unorderedList.Header) {
                var header = unorderedList.First(function (ele) {
                    return ele["IsHeader"];
                });
                if (!header) {
                    div = "div".CreateElement({ innerHTML: unorderedList.Header });
                    var header = div.children[0];
                    div.removeChild(header);
                    header["IsHeader"] = true;
                } else {
                    unorderedList.removeChild(header);
                }
                if (unorderedList.childNodes.length > 0) {
                    unorderedList.insertBefore(header, unorderedList.childNodes[0]);
                } else {
                    unorderedList.appendChild(header);
                }
                Binding.Grid.HookInsertTemplate(header, unorderedList);
            }
            if (unorderedList.Footer) {
                var footer = unorderedList.First(function (ele) {
                    return ele["IsFooter"];
                });
                if (!footer) {
                    div = "div".CreateElement({ innerHTML: unorderedList.Footer });
                    footer = div.children[0];
                    div.removeChild(footer);
                    footer["IsFooter"] = true;
                } else {
                    unorderedList.removeChild(footer);
                }
                unorderedList.appendChild(footer);
                Binding.Grid.HookInsertTemplate(footer, unorderedList);
            }
            if (!unorderedList.Wrapper.InitialLoad) {
                var li = unorderedList.First(function (ele) {
                    return ele.tagName == "LI" && ele.DataObject;
                });
                SetSelected(unorderedList, li.DataObject, li);
            }
            Ajax.HideProgress();
            unorderedList.Wrapper.InitialLoad = false;
        }
        Grid.EndAsyncBind = EndAsyncBind;
        function AsyncBind(unorderedList, data, appendData) {
            var html = Array(data.length + 1).join(unorderedList.Template.outerHTML);
            var async = function () {
                if (document.body.contains(unorderedList) && unorderedList.DataObject && unorderedList.DataObject.length > 0 && unorderedList.DataObject.length > unorderedList.AsyncPosition) {
                    var listitem = unorderedList.children[unorderedList.AsyncPosition];
                    AsynchSubExecute(listitem, unorderedList.Wrapper, unorderedList.DataObject[unorderedList.AsyncPosition], unorderedList);
                    unorderedList.AsyncPosition = unorderedList.AsyncPosition + 1;
                    if (unorderedList.AsyncPosition < unorderedList.DataObject.length) {
                        setTimeout(async, 0);
                    } else {
                        EndAsyncBind(unorderedList);
                    }
                } else {
                    EndAsyncBind(unorderedList);
                }
            };
            if (!appendData) {
                unorderedList.innerHTML = html;
                unorderedList.AsyncPosition = 0;
            } else {
                var div = "div".CreateElement({ innerHTML: html });
                while (div.children.length > 0) {
                    var child = div.children[div.children.length - 1];
                    div.removeChild(child);
                    unorderedList.appendChild(child);
                }
            }
            Ajax.ShowProgress();
            setTimeout(async, 0);
        }
        Grid.AsyncBind = AsyncBind;
        function AddItem(unorderedList, tempObj) {
            var wrapper = unorderedList.Wrapper;
            var found = wrapper.InitialLoad ? null : unorderedList.First(function (ele) {
                if (wrapper.PrimaryKeys && wrapper.PrimaryKeys.length > 0) {
                    return ele.DataObject && Thing.Concat(ele.DataObject, wrapper.PrimaryKeys) == Thing.Concat(tempObj, wrapper.PrimaryKeys);
                } else {
                    return false;
                }
            });
            if (found) {
                Binding.subExecute(found, wrapper);
            } else {
                CreateListItem(unorderedList, tempObj, wrapper);
            }
        }
        Grid.AddItem = AddItem;
        function HookInsertTemplate(listItem, unorderedList) {
            var wrapper = unorderedList.Wrapper;
            if (wrapper.WebApi) {
                var boundElements = Binding.Get.BoundElements(listItem);
                var insertElement = boundElements.First(function (obj) {
                    return obj.getAttribute("data-binding").toLowerCase() == "insert";
                });
                if (insertElement) {
                    insertElement.onclick = function () {
                        var newObject = {};
                        for (var i = 0; i < boundElements.length; i++) {
                            var element = boundElements[i];
                            if (element != insertElement) {
                                var field = boundElements[i].getAttribute("data-binding");
                                var tagName = element.tagName.toLowerCase();
                                switch (tagName) {
                                    case "input":
                                        var type = element.type.toLowerCase();
                                        switch (type) {
                                            case "checkbox":
                                                newObject[field] = element.checked ? true : false;
                                                break;
                                            case "radio":
                                                //watch out for Name here
                                                //need to handle name
                                                newObject[field] = element.checked ? true : false;
                                                break;
                                            case "text":
                                            case "password":
                                            case "hidden":
                                            default:
                                                newObject[field] = element.value;
                                                break;
                                        }
                                        break;
                                    case "textarea":
                                        newObject[field] = element.value;
                                        break;
                                    case "select":
                                        newObject[field] = element.value;
                                        break;
                                    default:
                                        break;
                                }
                            }
                        }
                        if (wrapper.UpdateEvent != null) {
                            wrapper.UpdateEvent(newObject, 0 /* Insert */, null);
                        }
                        wrapper.WebApi.Insert(newObject, function (result) {
                            if (listItem["InsertPosition"] && listItem["InsertPosition"] == "top") {
                            } else {
                                unorderedList.DataObject.push(result);
                                Binding.Grid.AddItem(unorderedList, result);
                                Binding.Set.Updated(result, 0 /* Insert */, wrapper, null);
                            }
                        }, function (result) {
                        });
                    };
                }
            }
        }
        Grid.HookInsertTemplate = HookInsertTemplate;
        function Execute(unorderedList, data, appendData) {
            unorderedList.Template = unorderedList.Template ? unorderedList.Template : null;
            if (Is.NullOrEmpty(unorderedList.Template)) {
                var lineItems = unorderedList.getElementsByTagName("li");
                var foundTemplate = null;
                for (var i = 0; i < lineItems.length; i++) {
                    var dataBindings = Binding.Get.TemplateAttributes(lineItems[i]);
                    if (dataBindings.LineType && dataBindings.LineType == Binding.Grid.LineTypes.Template) {
                        foundTemplate = lineItems[i];
                        delete dataBindings.LineType;
                        delete dataBindings.InsertPosition;
                        if (!Is.EmptyObject(dataBindings)) {
                            unorderedList.Wrapper.RowBinding = Binding.Get.Attributes(dataBindings);
                        }
                    } else if (dataBindings.LineType && dataBindings.LineType == Binding.Grid.LineTypes.Header) {
                        lineItems[i]["LineType"] = dataBindings.LineType;
                        lineItems[i]["InsertPosition"] = dataBindings.InsertPosition;
                        Binding.Grid.HookInsertTemplate(lineItems[i], unorderedList);
                        unorderedList.Header = lineItems[i].outerHTML;
                    } else if (dataBindings.LineType && dataBindings.LineType == Binding.Grid.LineTypes.Footer) {
                        lineItems[i]["LineType"] = dataBindings.LineType;
                        lineItems[i]["InsertPosition"] = dataBindings.InsertPosition;
                        Binding.Grid.HookInsertTemplate(lineItems[i], unorderedList);
                        unorderedList.Footer = lineItems[i].outerHTML;
                    }
                }
                if (foundTemplate) {
                    unorderedList.Template = {
                        style: foundTemplate.style ? foundTemplate.style : null,
                        cls: foundTemplate.className ? foundTemplate.className : null,
                        innerHTML: foundTemplate.innerHTML,
                        outerHTML: foundTemplate.outerHTML
                    };
                }
            }
            if (!appendData) {
                unorderedList.Clear(function (ele) {
                    return !ele["LineType"];
                }, true);
            }
            unorderedList.HasFooter = unorderedList.First(function (obj) {
                return obj["LineType"] && obj["LineType"] == Binding.Grid.LineTypes.Footer;
            }) ? true : false;
            Binding.Grid.Add(unorderedList, data, appendData);
        }
        Grid.Execute = Execute;
        function GetRawListItem(style, cls, innerHTML, object, wrapper) {
            var li = "li".CreateElement({ style: style, cls: cls, innerHTML: innerHTML, DataObject: object });
            return li;
        }
        Grid.GetRawListItem = GetRawListItem;
        function GetListItem(style, cls, innerHTML, object, wrapper) {
            var li = "li".CreateElement({ style: style, cls: cls, innerHTML: innerHTML, DataObject: object });
            Binding.subExecute(li, wrapper);
            return li;
        }
        Grid.GetListItem = GetListItem;
    })(Binding.Grid || (Binding.Grid = {}));
    var Grid = Binding.Grid;
    function Load(element) {
        var json = element.getAttribute("data-loadbinding");
        element.Wrapper = new Binding.Wrapper(json);
        element.removeAttribute("data-loadbinding");
        var wrapper = element.Wrapper;
        if (wrapper && wrapper.WebApi) {
            var parameter = {};
            if (wrapper.GetParameter) {
                wrapper.GetParameter = wrapper.GetParameter.Trim();
                if (wrapper.GetParameter.indexOf("return") == -1) {
                    wrapper.GetParameter = "return " + wrapper.GetParameter;
                }
                if (wrapper.GetParameter.lastIndexOf(";") < wrapper.GetParameter.length - 1) {
                    wrapper.GetParameter += ";";
                }
                if (Is.String(wrapper.GetParameter)) {
                    var fun = new Function(wrapper.GetParameter);
                    parameter = fun();

                    //should we do this?
                    fun = null;
                }
            }
            var executeSelect = function () {
                wrapper.WebApi.Select(parameter, function (result) {
                    Bind(element, result);
                }, function () {
                });
            };
            if (parameter) {
                if (wrapper.PrebindAction) {
                    var fun = new Function('exe', wrapper.PrebindAction + "(exe);");
                    fun(executeSelect);
                } else {
                    executeSelect();
                }
            }
        } else if (wrapper.PrebindAction) {
            var fun = new Function('exe', wrapper.PrebindAction + "(exe);");
            fun(function () {
            });
        }
    }
    Binding.Load = Load;
})(Binding || (Binding = {}));
var Bind = Binding.Execute;
var ViewManager;
(function (ViewManager) {
    var Liason = (function () {
        function Liason(key, container, url, urlTitle, pageTitle, loaded, viewUrl) {
            this.Container = container;
            this.Key = key;
            this.Url = url;
            this.UrlTitle = urlTitle;
            this.PageTitle = pageTitle;
            this.Loaded = loaded;
            this.ViewUrl = viewUrl;
        }
        return Liason;
    })();
    ViewManager.Liason = Liason;
    ;
    var View = (function () {
        function View(key, parameters, liason) {
            this.Key = key;
            this.Parameters = parameters;
            this.Liason = liason;
            //can find liason by key
        }
        View.prototype.Show = function () {
            //get the html
            //set the ViewContainer inner html
            var url = "ViewKey" + this.Key.toString();
            var found = sessionStorage.getItem(url);
            var callback = this.SetHTML;
            var liason = this.Liason;
            var view = this;
            if (!found || window["IsDebug"]) {
                Ajax.HttpAction("GET", this.Liason.ViewUrl, {}, function (result) {
                    if (result) {
                        sessionStorage.setItem(url, result);
                        callback(result, liason, view);
                    }
                }, function (result) {
                });
            } else {
                this.SetHTML(found, this.Liason, this);
            }
        };
        View.prototype.SetHTML = function (html, liason, view) {
            liason.Container.innerHTML = html;
            var dataloading = liason.Container.Get(function (e) {
                return e.hasAttribute("data-loadbinding");
            });
            for (var i = 0; i < dataloading.length; i++) {
                Binding.Load(dataloading[i]);
            }
            if (liason.Loaded) {
                liason.Loaded(view);
            }
            if (ViewManager.PostLoaded) {
                ViewManager.PostLoaded(view);
            }
        };
        return View;
    })();
    ViewManager.View = View;
    ViewManager.Views = new Array();
    var Cache = new Array();
    ViewManager.PostLoaded;
    function Initialize(viewLiasons, postLoaded) {
        Cache = viewLiasons;
        ViewManager.PostLoaded = postLoaded;
        window.addEventListener("popstate", ViewManager.BackEvent);
    }
    ViewManager.Initialize = Initialize;
    function BackEvent(e) {
        if (ViewManager.Views.length > 1) {
            ViewManager.Views.splice(ViewManager.Views.length - 1, 1);
        }
        if (ViewManager.Views.length > 0) {
            var viewInfo = ViewManager.Views[ViewManager.Views.length - 1];
            var found = Cache.First(function (o) {
                return o.Key == viewInfo.Key;
            });
            viewInfo.Show();
        } else {
            //do nothing?
        }
    }
    ViewManager.BackEvent = BackEvent;
    function Load(viewKey, parameters) {
        var found = Cache.First(function (o) {
            return o.Key == viewKey;
        });
        if (found) {
            var view = new View(viewKey, parameters, found);
            ViewManager.Views.push(view);
            window.PushState(null, found.UrlTitle(this), found.Url(view));
            view.Show();
        }
    }
    ViewManager.Load = Load;
})(ViewManager || (ViewManager = {}));
var Calendar;
(function (Calendar) {
    function DateCell(date, calendar) {
        var div = "div".CreateElement(this.Format.Cell);
        div.Date = date;
        div.title = date.format("mmmm dd, yyyy");
        if (date != null) {
            var a = "a".CreateElement({ innerHTML: date.getDate(), href: "javascript:" });
            a.onclick = function () {
                if (calendar.SelectedDate.getMonth() == div.Date.getMonth() || !calendar.MonthChangeEvent) {
                    var previousDate = calendar.SelectedDateControl;
                    calendar.Set(div.Date);
                    if (calendar.SelectedDateControl && calendar.FormatCellMethod) {
                        var format = calendar.FormatCellMethod(div.Date);
                        div.className = format;
                    }
                    if (previousDate && calendar.FormatCellMethod) {
                        var format = calendar.FormatCellMethod(previousDate.Date);
                        previousDate.className = format;
                    }
                    calendar.SelectedDateControl = div;
                } else {
                    calendar.RequestedDate = div.Date;
                    calendar.MonthChanged = true;
                    calendar.MonthChangeEvent(div.Date, calendar.MonthChangedCallBack);
                }
            };
            div.appendChild(a);
            if (date.Equals(calendar.SelectedDate)) {
                calendar.SelectedDateControl = div;
            }
            if (calendar.FormatCellMethod) {
                var format = calendar.FormatCellMethod(div.Date);
                if (format) {
                    div.className = format;
                }
            }
        }
        return div;
    }
    Calendar.DateCell = DateCell;
    function HeaderCell(elementArrayOrString, cellProps) {
        var div = "div".CreateElement(this.Format.Cell);
        Thing.Merge(cellProps, div);
        if (elementArrayOrString && elementArrayOrString.substring) {
            div.innerHTML = elementArrayOrString;
        } else if (Is.Array(elementArrayOrString)) {
            for (var i = 0; i < elementArrayOrString.length; i++) {
                var sub = elementArrayOrString[i];
                if (Is.String(sub)) {
                    div.appendChild("span".CreateElement({ innerHTML: sub }));
                } else if (Is.Element(sub)) {
                    div.appendChild(sub);
                }
            }
        } else if (Is.Element(elementArrayOrString)) {
            div.appendChild(elementArrayOrString);
        }
        return div;
    }
    Calendar.HeaderCell = HeaderCell;
    Calendar.Format = {
        Table: {
            display: "table",
            borderCollapse: "collapse",
            listStyleType: "none",
            margin: "0px 0px",
            padding: "0px 0px",
            width: "100%"
        },
        Row: {
            display: "table-row",
            listStyle: "none"
        },
        Cell: {
            display: "table-cell",
            textAlign: "center"
        }
    };
    function MonthItem(monthName, index, onclickEvent) {
        var li = "li".CreateElement();
        var div = "div".CreateElement();
        li.appendChild(div);
        var a = "a".CreateElement({ innerHTML: monthName, href: "javascript:" });
        div.appendChild(a);
        a.onclick = function () {
            onclickEvent(index);
        };
        return li;
    }
    Calendar.MonthItem = MonthItem;
    function YearItem(year, onclickEvent) {
        var li = "li".CreateElement();
        var div = "div".CreateElement();
        li.appendChild(div);
        var a = "a".CreateElement({ innerHTML: year, href: "javascript:" });
        div.appendChild(a);
        a.onclick = function () {
            onclickEvent(year);
        };
        return li;
    }
    Calendar.YearItem = YearItem;
    function Create(element, selectedDateChanged, formatCellMethod, monthChangeEvent, headerClass, rowsClass, dayOfWeekClass, dateRowClass, monthClass, yearClass, navigateClass, defaultDateClass, monthPopupClass, yearPopupClass, calendarBuiltEvent) {
        if (!element.SelectedDate) {
            element.SelectedDate = new Date().SmallDate();
        }
        element.MonthClass = monthClass;
        element.YearClass = yearClass;
        element.NavigateClass = navigateClass;
        element.DefaultDateClass = defaultDateClass;
        element.MonthChangeEvent = monthChangeEvent;
        element.HeaderClass = headerClass;
        element.DateRowClass = dateRowClass;
        element.RowsClass = rowsClass;
        element.DayOfWeekClass = dayOfWeekClass;
        element.RequestedDate = new Date();
        element.SelectedDateChanged = selectedDateChanged;
        element.FormatCellMethod = formatCellMethod;
        element.MonthPopupClass = monthPopupClass;
        element.YearPopupClass = yearPopupClass;
        element.SelectedDateControl = null;
        element.PreviousDateControl = null;
        element.CalendarBuiltEvent = calendarBuiltEvent;
        element.MonthChanged = false;
        element.MonthChangedCallBack = function (allow) {
            if (allow) {
                //need to reset formatting?
                element.Set(element.RequestedDate);
                element.MonthChanged = false;
            }
        };
        element.Set = function (selectedDate) {
            var rebuild = selectedDate.getMonth() != element.SelectedDate.getMonth() || selectedDate.getFullYear() != element.SelectedDate.getFullYear();
            element.SelectedDate = selectedDate;
            if (rebuild) {
                element.Build();
            } else {
                var selectedDateControl = element.First(function (obj) {
                    return obj.tagName.toLowerCase() == "div" && obj.Date && obj.Date.Equals(selectedDate);
                });
                if (selectedDateControl) {
                    element.SelectedDateControl = selectedDateControl;
                }
            }
            if (element.SelectedDateChanged) {
                element.SelectedDateChanged(element.SelectedDate);
            }
        };
        element.MonthNameClicked = function (month) {
            if (month != element.SelectedDate.getMonth()) {
                var requestmonth = month;
                var requestyear = element.SelectedDate.getFullYear();
                var testDate = new Date(requestyear, requestmonth, 1);
                element.RequestedDate = new Date(requestyear, requestmonth, element.SelectedDate.getDate());
                while (element.RequestedDate.getMonth() > testDate) {
                    element.RequestedDate = element.RequestedDate.AddDays(-1);
                }
                if (element.MonthChangeEvent) {
                    element.MonthChanged = true;
                    element.MonthChangeEvent(element.RequestedDate, element.MonthChangedCallBack);
                } else {
                    element.Set(element.RequestedDate);
                }
            }
            Dialog.Hide("workoutMonthpopup".E());
        };
        element.YearNameClicked = function (year) {
            if (year != element.SelectedDate.getFullYear()) {
                var requestyear = year;
                var requestmonth = element.SelectedDate.getMonth();
                element.RequestedDate = new Date(requestyear, requestmonth, element.SelectedDate.getDate());
                while (element.RequestedDate.getMonth() > element.SelectedDate.getMonth()) {
                    element.RequestedDate = element.RequestedDate.AddDays(-1);
                }
                if (element.MonthChangeEvent) {
                    element.MonthChanged = true;
                    element.MonthChangeEvent(element.RequestedDate, element.MonthChangedCallBack);
                } else {
                    element.Set(element.RequestedDate);
                }
            }
            Dialog.Hide("workoutYearpopup".E());
        };
        element.Build = function () {
            element.Clear();
            var header = "ul".CreateElement(Calendar.Format.Table);
            if (element.HeaderClass) {
                header.className = element.HeaderClass;
            }
            var left = "a".CreateElement({ innerHTML: "&lt;", href: "javascript:" });
            left.onclick = function () {
                var requestmonth = element.SelectedDate.getMonth();
                var requestyear = element.SelectedDate.getFullYear();
                if (requestmonth == 0) {
                    requestyear--;
                    requestmonth = 11;
                } else {
                    requestmonth--;
                }
                element.RequestedDate = new Date(requestyear, requestmonth, element.SelectedDate.getDate());
                while (element.RequestedDate.getMonth() == element.SelectedDate.getMonth()) {
                    element.RequestedDate = element.RequestedDate.AddDays(-1);
                }
                if (element.MonthChangeEvent) {
                    element.MonthChanged = true;
                    element.MonthChangeEvent(element.RequestedDate, element.MonthChangedCallBack);
                } else {
                    element.Set(element.RequestedDate);
                }
            };
            var right = "a".CreateElement({ innerHTML: "&gt;", href: "javascript:" });
            right.onclick = function () {
                var requestmonth = element.SelectedDate.getMonth();
                var requestyear = element.SelectedDate.getFullYear();
                if (requestmonth == 11) {
                    requestmonth = 0;
                    requestyear++;
                } else {
                    requestmonth++;
                }
                element.RequestedDate = new Date(requestyear, requestmonth, element.SelectedDate.getDate());
                while (element.RequestedDate.getMonth() > element.SelectedDate.getMonth() + 1) {
                    element.RequestedDate = element.RequestedDate.AddDays(-1);
                }
                if (element.MonthChangeEvent) {
                    element.MonthChanged = true;
                    element.MonthChangeEvent(element.RequestedDate, element.MonthChangedCallBack);
                } else {
                    element.Set(element.RequestedDate);
                }
            };
            if (element.NavigateClass) {
                left.className = element.NavigateClass;
                right.className = element.NavigateClass;
            }
            var month = "a".CreateElement({ innerHTML: element.SelectedDate.MonthName(), marginRight: ".25em", href: "javascript:" });
            month.onclick = function () {
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var ulMonths = "ul".CreateElement({ id: "workoutMonthpopup", Target: month });
                if (element.MonthPopupClass) {
                    ulMonths.className = element.MonthPopupClass;
                } else {
                    ulMonths.Set(Calendar.Format.Table);
                }
                for (var i = 0; i < months.length; i++) {
                    ulMonths.appendChild(Calendar.MonthItem(months[i], i, element.MonthNameClicked));
                }
                Dialog.Popup(ulMonths);
            };
            var year = "a".CreateElement({ innerHTML: element.SelectedDate.getFullYear(), marginLeft: ".25em", href: "javascript:" });
            year.onclick = function () {
                //dont move beyond current year
                //this needs to be dynamic
                //if now == current year do one thing else do something else
                var years = new Array();
                var currentyear = (new Date()).getFullYear();
                var selectedYear = element.SelectedDate.getFullYear();
                if (selectedYear >= currentyear) {
                    years.push(currentyear - 4);
                    years.push(currentyear - 3);
                    years.push(currentyear - 2);
                    years.push(currentyear - 1);
                    years.push(currentyear - 0);
                } else {
                    var diff = currentyear - selectedYear;
                    if (diff > 1) {
                        years.push(selectedYear - 2);
                        years.push(selectedYear - 1);
                        years.push(selectedYear);
                        years.push(selectedYear + 1);
                        years.push(selectedYear + 2);
                    } else {
                        years.push(selectedYear - 3);
                        years.push(selectedYear - 2);
                        years.push(selectedYear - 1);
                        years.push(selectedYear);
                        years.push(selectedYear + 1);
                    }
                }
                var ulYears = "ul".CreateElement({ id: "workoutYearpopup", Target: year });
                if (element.YearPopupClass) {
                    ulYears.className = element.YearPopupClass;
                } else {
                    ulYears.Set(Calendar.Format.Table);
                }
                for (var i = 0; i < years.length; i++) {
                    ulYears.appendChild(Calendar.YearItem(years[i], element.YearNameClicked));
                }
                Dialog.Popup(ulYears);
            };
            if (element.MonthClass) {
                month.className = element.MonthClass;
            }
            if (element.YearClass) {
                year.className = element.YearClass;
            }
            var headerRow = "li".CreateElement(Calendar.Format.Row);
            header.appendChild(headerRow);
            headerRow.AddRange(Calendar.HeaderCell(left), Calendar.HeaderCell([month, year]), Calendar.HeaderCell(right));
            element.appendChild(header);
            var daysContainer = "ul".CreateElement(Calendar.Format.Table);
            if (element.RowsClass) {
                daysContainer.className = element.RowsClass;
            }
            element.appendChild(daysContainer);
            var pos = 0;
            var daysInMonth = element.SelectedDate.DaysInMonth();
            var startDate = new Date(element.SelectedDate.getFullYear(), element.SelectedDate.getMonth(), 1);
            var week = "li".CreateElement(Calendar.Format.Row);
            daysContainer.appendChild(week);
            if (element.DayOfWeekClass) {
                week.className = element.DayOfWeekClass;
            }
            week.AddRange(Calendar.HeaderCell("Su"), Calendar.HeaderCell("M"), Calendar.HeaderCell("T"), Calendar.HeaderCell("W"), Calendar.HeaderCell("Th"), Calendar.HeaderCell("F"), Calendar.HeaderCell("Sa"));
            week = "li".CreateElement(Calendar.Format.Row);
            var dow = startDate.getDay();
            if (dow != 0) {
                startDate = startDate.AddDays(dow * -1);
            }
            var breakCalendar = false;
            while (!breakCalendar) {
                if (pos == 0) {
                    if (element.DateRowClass) {
                        week.className = element.DateRowClass;
                    }
                    daysContainer.appendChild(week);
                }
                var dow = startDate.getDay();
                if (dow == 6 && ((startDate.getMonth() > element.SelectedDate.getMonth() || startDate.getFullYear() > element.SelectedDate.getFullYear()) || startDate.getDate() == daysInMonth)) {
                    breakCalendar = true;
                }
                if (pos == dow) {
                    week.appendChild(Calendar.DateCell(startDate, element));
                    startDate = startDate.AddDays(1);
                }
                pos++;
                if (pos == 7) {
                    week = "li".CreateElement(Calendar.Format.Row);
                    pos = 0;
                }
            }
            if (element.CalendarBuiltEvent) {
                element.CalendarBuiltEvent();
            }
        };
        element.Build();
        if (element.SelectedDateChanged) {
            element.SelectedDateChanged(element.SelectedDate);
        }
    }
    Calendar.Create = Create;
})(Calendar || (Calendar = {}));
var Convert;
(function (Convert) {
    function EmToFloat(value) {
        if (value && value.substring && value.indexOf("em")) {
            value = value.replace("em", "");
            value = parseFloat(value);
        }
        ;
        return value;
    }
    Convert.EmToFloat = EmToFloat;
    function EmValueToPixelValue(value) {
        if (value) {
            value = EmToFloat(value) * 16;
            return value;
        }
        return 0;
    }
    Convert.EmValueToPixelValue = EmValueToPixelValue;
})(Convert || (Convert = {}));
var Cookie;
(function (Cookie) {
    function Create(name, value, days) {
        if (days) {
            var date = new Date();
            date.setTime(date.getTime() + (days * 24 * 60 * 60 * 1000));
            var expires = "; expires=" + date.toUTCString();
        } else
            var expires = "";
        document.cookie = name + "=" + value + expires + "; path=/";
    }
    Cookie.Create = Create;
    function Read(name) {
        var nameEQ = name + "=";
        var ca = document.cookie.split(';');
        for (var i = 0; i < ca.length; i++) {
            var c = ca[i];
            while (c.charAt(0) == ' ')
                c = c.substring(1, c.length);
            if (c.indexOf(nameEQ) == 0)
                return c.substring(nameEQ.length, c.length);
        }
        return null;
    }
    Cookie.Read = Read;
    function Erase(name) {
        Cookie.Create(name, "", -1);
    }
    Cookie.Erase = Erase;
})(Cookie || (Cookie = {}));
var DialogType;
(function (DialogType) {
    DialogType[DialogType["Modal"] = 0] = "Modal";
    DialogType[DialogType["Popup"] = 1] = "Popup";
    DialogType[DialogType["Quick"] = 2] = "Quick";
    DialogType[DialogType["Standard"] = 3] = "Standard";
})(DialogType || (DialogType = {}));
var DialogPosition;
(function (DialogPosition) {
    DialogPosition[DialogPosition["MiddleOfWindow"] = 0] = "MiddleOfWindow";
    DialogPosition[DialogPosition["Below"] = 1] = "Below";
    DialogPosition[DialogPosition["Above"] = 2] = "Above";
    DialogPosition[DialogPosition["Manual"] = 100] = "Manual";
})(DialogPosition || (DialogPosition = {}));
var DialogResult;
(function (DialogResult) {
    DialogResult[DialogResult["No"] = 0] = "No";
    DialogResult[DialogResult["Yes"] = 1] = "Yes";
    DialogResult[DialogResult["Ok"] = 2] = "Ok";
})(DialogResult || (DialogResult = {}));
var ButtonType;
(function (ButtonType) {
    ButtonType[ButtonType["InputButton"] = 0] = "InputButton";
    ButtonType[ButtonType["Anchor"] = 1] = "Anchor";
    ButtonType[ButtonType["ImageButton"] = 2] = "ImageButton";
})(ButtonType || (ButtonType = {}));
var DialogButton = (function () {
    function DialogButton(text, buttonType, className) {
        this.Text = text;
        this.ClassName = className;
        this.ButtonType = buttonType == null ? 0 /* InputButton */ : buttonType;
        //        this.ImageSrc = imageSrc;
    }
    return DialogButton;
})();
var DialogProperties = (function () {
    function DialogProperties(container, dialogType, target, hideInterval, position, modalClass, offSetX, offsetY) {
        this.DialogType = dialogType;
        this.Target = target;
        this.Container = container;
        this.Container["DialogProperties"] = this;
        this.OffSetX = Convert.EmValueToPixelValue(offSetX);
        this.OffSetY = Convert.EmValueToPixelValue(offsetY);
        this.IsActive = false;
        this.Interval = null;
        this.Modal = null;
        this.ModalClass = modalClass;
        if (hideInterval == null) {
            if (this.DialogType == 1 /* Popup */ || this.DialogType == 2 /* Quick */) {
                this.HideInterval = Dialog.DefaultHideInterval;
            } else {
                this.HideInterval = -1;
            }
        } else {
            this.HideInterval = hideInterval;
        }
        if (position != 100 /* Manual */) {
            if (position == null && this.Target == null) {
                this.Position = 0 /* MiddleOfWindow */;
            } else if (position == null && this.Target != null) {
                this.Position = 1 /* Below */;
            } else {
                this.Position = position;
            }
        } else {
            this.Position = 100 /* Manual */;
        }
    }
    return DialogProperties;
})();
var Dialog;
(function (Dialog) {
    function Confirm(message, onclick, title, target, modalClass, yesButton, noButton, containerStyle, titleStyle, position) {
        yesButton = yesButton == null ? new DialogButton("Yes", 0 /* InputButton */) : yesButton;
        noButton = noButton == null ? new DialogButton("No", 0 /* InputButton */) : noButton;
        title = title == null ? "&nbsp;" : title;
        var container = "ul".CreateElement();
        var liTitle = "li".CreateElement();
        var divTitle = "div".CreateElement({ innerHTML: title });
        divTitle.Set(titleStyle);
        liTitle.appendChild(divTitle);
        var liMessage = "li".CreateElement();
        var divMessage = "div".CreateElement({ innerHTML: message });
        liMessage.appendChild(divMessage);
        var liDialog = "li".CreateElement();
        var divDialog = "div".CreateElement();
        var ulDialogContainer = "ul".CreateElement({ width: "100%" });
        divDialog.appendChild(ulDialogContainer);
        liDialog.appendChild(divDialog);
        var liSubDialog = "li".CreateElement();
        var divButton = "div".CreateElement();
        liSubDialog.appendChild(divButton);
        ulDialogContainer.appendChild(liSubDialog);
        divButton.appendChild(getDialogButton(onclick, noButton, 0 /* No */, container));
        divButton.appendChild(getDialogButton(onclick, yesButton, 1 /* Yes */, container));
        setUL(container);
        setUL(ulDialogContainer);
        setLI(liTitle);
        setDiv(divTitle, "left", ".25em .25em");
        divTitle.style.borderBottom = "1px solid #999";
        divTitle.style.backgroundColor = "#C0C0C0";
        setLI(liMessage);
        setDiv(divMessage, "center", "1em 1em");
        setLI(liDialog);
        setDiv(divDialog, "left", "0em 0em");
        container.style.border = "1px solid #999";
        container.Set(containerStyle);
        container.appendChild(liTitle);
        container.appendChild(liMessage);
        container.appendChild(liDialog);
        if (position == null) {
            position = target == null ? 0 /* MiddleOfWindow */ : 1 /* Below */;
        }
        if (modalClass == null) {
            Dialog.Show(container, 3 /* Standard */, target, null, position);
        } else {
            Dialog.Modal(container, modalClass, position, null, target);
        }
    }
    Dialog.Confirm = Confirm;
    function Ok(message, title, target, modalClass, okButton, containerClass, titleClass) {
        okButton = okButton == null ? new DialogButton("Ok", 0 /* InputButton */) : okButton;
        title = title == null ? "&nbsp;" : title;
        var container = "ul".CreateElement();
        var liTitle = "li".CreateElement();
        var divTitle = "div".CreateElement({ innerHTML: title });
        if (titleClass != null) {
            divTitle.className = titleClass;
        }
        liTitle.appendChild(divTitle);
        var liMessage = "li".CreateElement();
        var divMessage = "div".CreateElement({ innerHTML: message });
        liMessage.appendChild(divMessage);
        var liDialog = "li".CreateElement();
        var divDialog = "div".CreateElement();
        var ulDialogContainer = "ul".CreateElement({ width: "100%" });
        divDialog.appendChild(ulDialogContainer);
        liDialog.appendChild(divDialog);
        var liSubDialog = "li".CreateElement();
        var divButton = "div".CreateElement();
        liSubDialog.appendChild(divButton);
        ulDialogContainer.appendChild(liSubDialog);
        divButton.appendChild(getDialogButton(function (r) {
        }, okButton, 2 /* Ok */, container));
        if (containerClass != null) {
            container.className = containerClass;
        } else {
            setUL(container);
            setUL(ulDialogContainer);
            setLI(liTitle);
            setDiv(divTitle, "left", ".25em .25em");
            divTitle.style.borderBottom = "1px solid #999";
            divTitle.style.backgroundColor = "#C0C0C0";
            setLI(liMessage);
            setDiv(divMessage, "center", "1em 1em");
            setLI(liDialog);
            setDiv(divDialog, "left", "0em 0em");
            container.style.border = "1px solid #999";
        }
        container.appendChild(liTitle);
        container.appendChild(liMessage);
        container.appendChild(liDialog);
        if (modalClass == null) {
            Dialog.Show(container, 3 /* Standard */, target, null, target == null ? 0 /* MiddleOfWindow */ : 1 /* Below */);
        } else {
            Dialog.Modal(container, modalClass, target == null ? 0 /* MiddleOfWindow */ : 1 /* Below */, null, target);
        }
    }
    Dialog.Ok = Ok;
    function setUL(ul) {
        ul.style.display = "table";
        ul.style.borderCollapse = "collapse";
        ul.style.listStyleType = "none";
        ul.style.margin = "0px 0px";
        ul.style.padding = "0px 0px";
        ul.style.backgroundColor = "#fff";
    }
    function setLI(li) {
        li.style.display = "table-row";
        li.style.listStyle = "none";
    }
    function setDiv(div, textAlign, padding) {
        div.style.display = "table-cell";
        div.style.verticalAlign = "middle";
        div.style.textAlign = textAlign;
        div.style.padding = padding;
    }
    function getDialogButton(onclick, dialogButton, dialogResult, container, containerClass) {
        var button;
        switch (dialogButton.ButtonType) {
            case 1 /* Anchor */:
                button = "a".CreateElement({ innerHTML: dialogButton.Text.toString() });
                break;

            case 0 /* InputButton */:
                button = "input".CreateElement({ type: "button", value: dialogButton.Text.toString() });
                break;
        }
        if (dialogButton.ClassName) {
            button.className = dialogButton.ClassName.toString();
        }
        dialogButton = null;
        button.onclick = function () {
            onclick(dialogResult);
            Dialog.Hide(container);
        };
        if (containerClass == null) {
            button.style.margin = ".5em .5em";
            if (dialogResult == 0 /* No */) {
                button.style.cssFloat = "left";
            } else {
                button.style.cssFloat = "right";
            }
        }
        return button;
    }
    Dialog.DefaultHideInterval = 1500;
    function Popup(elementToShow, target, position, hideInterval) {
        Show(elementToShow, 1 /* Popup */, target, hideInterval, position);
    }
    Dialog.Popup = Popup;
    function Modal(elementToShow, modalClass, position, hideInterval, target) {
        Show(elementToShow, 0 /* Modal */, target, hideInterval, position, modalClass);
    }
    Dialog.Modal = Modal;
    function Quick(elementToShow, target, position) {
        Show(elementToShow, 2 /* Quick */, target, Dialog.DefaultHideInterval, position);
    }
    Dialog.Quick = Quick;
    function Standard(dialogProperties) {
        var elementToShow = dialogProperties.Container;
        if (dialogProperties.DialogType == 0 /* Modal */) {
            var winDim = window.Dimensions();
            dialogProperties.Modal = "div".CreateElement({ cls: dialogProperties.ModalClass });
            dialogProperties.Modal.style.height = winDim.Height.toString() + "px";
            dialogProperties.Modal.style.display = "block";
            dialogProperties.Modal.style.left = "0px";
            dialogProperties.Modal.style.top = "0px";
            dialogProperties.Modal.style.width = winDim.Width.toString() + "px";
            dialogProperties.Modal.style.position = "absolute";
            document.body.appendChild(dialogProperties.Modal);
        }
        document.body.appendChild(elementToShow);
        SetPosition(elementToShow, dialogProperties);
        if (dialogProperties.HideInterval > -1) {
            elementToShow.AddListener("onmouseover", function () {
                dialogProperties.IsActive = true;
            });
            elementToShow.AddListener("onmouseout", function () {
                dialogProperties.IsActive = false;
            });
            dialogProperties.Interval = setInterval(function () {
                if (!dialogProperties.IsActive) {
                    Dialog.Hide(elementToShow);
                }
            }, dialogProperties.HideInterval);
        }
    }
    Dialog.Standard = Standard;
    function Show(elementToShow, dialogType, target, hideInterval, position, modalClass) {
        var offsetx = elementToShow["OffSetX"] ? elementToShow["OffSetX"] : "0";
        var offsety = elementToShow["OffSetY"] ? elementToShow["OffSetY"] : "0";
        var dp = new DialogProperties(elementToShow, dialogType, target, hideInterval, position, modalClass, offsetx, offsety);
        Standard(dp);
    }
    Dialog.Show = Show;
    function SetPosition(elementToShow, dialogProperties) {
        var x = 0;
        var y = 0;
        var dim = elementToShow.Dimensions();
        switch (dialogProperties.Position) {
            case 0 /* MiddleOfWindow */:
                var winDim = window.Dimensions();
                y = (winDim.Height - dim.height) / 2;
                x = (winDim.Width - dim.width) / 2;
                break;
            case 1 /* Below */:
                var targetDetails = dialogProperties.Target.DimAndOff();
                y = targetDetails.Top + targetDetails.Height;
                x = targetDetails.Left;
                break;
            case 2 /* Above */:
                var targetDetails = dialogProperties.Target.DimAndOff();
                y = targetDetails.Top - dim.height;
                x = targetDetails.Left;
                break;
            case 100 /* Manual */:
            default:
                break;
        }
        if (dialogProperties.Position != 100 /* Manual */) {
            if (dialogProperties.OffSetX) {
                x += dialogProperties.OffSetX;
            }
            if (dialogProperties.OffSetY) {
                y += dialogProperties.OffSetY;
            }
            elementToShow.style.left = x.toString() + "px";
            elementToShow.style.top = y.toString() + "px";
            elementToShow.style.position = "absolute";
        }
    }
    Dialog.SetPosition = SetPosition;
    function Hide(obj) {
        var ele;
        if (Is.String(obj)) {
            var temp = obj;
            ele = temp.E();
        } else if (Is.Element(obj)) {
            ele = obj;
        }
        if (ele) {
            var dp = ele["DialogProperties"];
            if (dp != null) {
                if (dp.HideInterval > -1) {
                    clearInterval(dp.Interval);
                }
                if (dp.Modal) {
                    dp.Modal.Remove();
                }
            }
            ele.Remove();
        }
    }
    Dialog.Hide = Hide;
})(Dialog || (Dialog = {}));
var Formatters;
(function (Formatters) {
    (function (DateTime) {
        DateTime.Token = /d{1,4}|m{1,4}|yy(?:yy)?|([HhMsTt])\1?|[LloSZ]|"[^"]*"|'[^']*'/g;
        DateTime.Timezone = /\b(?:[PMCEA][SDP]T|(?:Pacific|Mountain|Central|Eastern|Atlantic) (?:Standard|Daylight|Prevailing) Time|(?:GMT|UTC)(?:[-+]\d{4})?)\b/g;
        DateTime.TimezoneClip = /[^-+\dA-Z]/g;
        DateTime.i18n = {
            dayNames: ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"],
            monthNames: ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec", "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"]
        };
        DateTime.Masks = {
            "default": "ddd mmm dd yyyy HH:MM:ss",
            shortDate: "m/d/yy",
            mediumDate: "mmm d, yyyy",
            longDate: "mmmm d, yyyy",
            fullDate: "dddd, mmmm d, yyyy",
            shortTime: "h:MM TT",
            mediumTime: "h:MM:ss TT",
            longTime: "h:MM:ss TT Z",
            isoDate: "yyyy-mm-dd",
            isoTime: "HH:MM:ss",
            isoDateTime: "yyyy-mm-dd'T'HH:MM:ss",
            isoUtcDateTime: "UTC:yyyy-mm-dd'T'HH:MM:ss'Z'"
        };
        function Pad(val, len) {
            val = String(val);
            len = len || 2;
            while (val.length < len)
                val = "0" + val;
            return val;
        }
        DateTime.Pad = Pad;
        function Format(date, mask, utc) {
            if (arguments.length == 1 && Object.prototype.toString.call(date) == "[object String]" && !/\d/.test(date)) {
                mask = date;
                date = undefined;
            }

            // Passing date through Date applies Date.parse, if necessary
            date = date ? new Date(date) : new Date();
            if (isNaN(date))
                throw SyntaxError("invalid date");
            mask = String(DateTime.Masks[mask] || mask || DateTime.Masks["default"]);

            // Allow setting the utc argument via the mask
            if (mask.slice(0, 4) == "UTC:") {
                mask = mask.slice(4);
                utc = true;
            }
            var _ = utc ? "getUTC" : "get", d = date[_ + "Date"](), D = date[_ + "Day"](), m = date[_ + "Month"](), y = date[_ + "FullYear"](), H = date[_ + "Hours"](), M = date[_ + "Minutes"](), s = date[_ + "Seconds"](), L = date[_ + "Milliseconds"](), o = utc ? 0 : date.getTimezoneOffset(), flags = {
                d: d,
                dd: DateTime.Pad(d),
                ddd: DateTime.i18n.dayNames[D],
                dddd: DateTime.i18n.dayNames[D + 7],
                m: m + 1,
                mm: DateTime.Pad(m + 1),
                mmm: DateTime.i18n.monthNames[m],
                mmmm: DateTime.i18n.monthNames[m + 12],
                yy: String(y).slice(2),
                yyyy: y,
                h: H % 12 || 12,
                hh: DateTime.Pad(H % 12 || 12),
                H: H,
                HH: DateTime.Pad(H),
                M: M,
                MM: DateTime.Pad(M),
                s: s,
                ss: DateTime.Pad(s),
                l: DateTime.Pad(L, 3),
                L: DateTime.Pad(L > 99 ? Math.round(L / 10) : L),
                t: H < 12 ? "a" : "p",
                tt: H < 12 ? "am" : "pm",
                T: H < 12 ? "A" : "P",
                TT: H < 12 ? "AM" : "PM",
                Z: utc ? "UTC" : (String(date).match(DateTime.Timezone) || [""]).pop().replace(DateTime.TimezoneClip, ""),
                o: (o > 0 ? "-" : "+") + DateTime.Pad(Math.floor(Math.abs(o) / 60) * 100 + Math.abs(o) % 60, 4)
            };
            return mask.replace(DateTime.Token, function ($0) {
                return $0 in flags ? flags[$0] : $0.slice(1, $0.length - 1);
            });
        }
        DateTime.Format = Format;
    })(Formatters.DateTime || (Formatters.DateTime = {}));
    var DateTime = Formatters.DateTime;
    (function (Number) {
        function Comma(stringOrNumber) {
            stringOrNumber += '';
            var x = stringOrNumber.split('.');
            var x1 = x[0];
            var x2 = x.length > 1 ? '.' + x[1] : '';
            var rgx = /(\d+)(\d{3})/;
            while (rgx.test(x1)) {
                x1 = x1.replace(rgx, '$1' + ',' + '$2');
            }
            return x1 + x2;
        }
        Number.Comma = Comma;
        function Pad(value, length) {
            var str = '' + value;
            while (str.length < length) {
                str = '0' + str;
            }
            return str;
        }
        Number.Pad = Pad;
    })(Formatters.Number || (Formatters.Number = {}));
    var Number = Formatters.Number;
})(Formatters || (Formatters = {}));
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
var KeyPress;
(function (KeyPress) {
    KeyPress.ADCONTROL_ZERO = 48;
    KeyPress.ADCONTROL_ONE = 49;
    KeyPress.ADCONTROL_TWO = 50;
    KeyPress.ADCONTROL_THREE = 51;
    KeyPress.ADCONTROL_FOUR = 52;
    KeyPress.ADCONTROL_FIVE = 53;
    KeyPress.ADCONTROL_SIX = 54;
    KeyPress.ADCONTROL_SEVEN = 55;
    KeyPress.ADCONTROL_EIGHT = 56;
    KeyPress.ADCONTROL_NINE = 57;
    function GetZeroLengthString(value) {
        switch (value) {
            case 1:
            case 0:
                return String(value);
            default:
                return "0" + String(value) + "/";
        }
    }
    KeyPress.GetZeroLengthString = GetZeroLengthString;
    function GetOneLengthString(value, currentValue) {
        if (currentValue == 0) {
            return "0" + String(value) + "/";
        } else {
            if (value > 3) {
                return "01/0" + String(value) + "/";
            } else if (value == 3) {
                return "01/3";
            } else {
                return "1" + String(value) + "/";
            }
        }
    }
    KeyPress.GetOneLengthString = GetOneLengthString;
    function GetThreeLengthString(value, currentValue) {
        if (value > 3) {
            return currentValue + "0" + String(value) + "/";
        } else {
            return currentValue + String(value);
        }
    }
    KeyPress.GetThreeLengthString = GetThreeLengthString;
    function GetFourLengthString(value, currentValue, previousValue) {
        if (previousValue == 3 && value > 1) {
            return String(currentValue).substring(0, String(currentValue).length - 1) + "03/" + String(value);
        } else {
            return currentValue + value + "/";
        }
    }
    KeyPress.GetFourLengthString = GetFourLengthString;
    function NoBlanks(e, canSpecialCharacter) {
        var ret = true;
        var KeyID = null;
        var sender = null;
        var shiftKey = true;
        if (window.event) {
            KeyID = window.event.keyCode;
            sender = window.event.srcElement;
            shiftKey = window.event.shiftKey;
            e = window.event;
        } else if (e) {
            KeyID = e.which;
            sender = e.srcElement;
            shiftKey = e.shiftKey;
        }
        var keyChar = String.fromCharCode(KeyID);
        if (!canSpecialCharacter) {
            var regex = /[a-z0-9]/gi;
            var test = regex.test(keyChar);
            if (!test) {
                ret = false;
                e.cancel = true;
            }
        } else if (keyChar == " ") {
            ret = false;
            e.cancel = true;
        }
        if (window.event) {
            e.returnValue = ret;
        }
        return ret;
    }
    KeyPress.NoBlanks = NoBlanks;
    function ShortDate(e) {
        var KeyID = null;
        var sender = null;
        var shiftKey = true;
        if (window.event) {
            KeyID = window.event.keyCode;
            sender = window.event.srcElement;
            shiftKey = window.event.shiftKey;
        } else if (e) {
            KeyID = e.which;
            sender = e.srcElement;
            shiftKey = e.shiftKey;
        }

        //hook up events to it
        if (!sender.onclick) {
            sender.onclick = function (e) {
                sender.focus();
                sender.select();
            };
        }
        if (!sender.onfocus) {
            sender.onfocus = function () {
                sender.select();
            };
        }
        if (!sender.onblur) {
            sender.onblur = function () {
                if (sender.value.length == 0)
                    return;
                if (sender.value.length == 8) {
                    var lastTwo = sender.value.substring(6, 8);
                    if (lastTwo.indexOf("9") == 0) {
                        sender.value = sender.value.substring(0, 6) + "19" + lastTwo;
                    } else {
                        sender.value = sender.value.substring(0, 6) + "20" + lastTwo;
                    }
                }
                if (!Is.ValidDate(sender.value)) {
                    alert("Please enter a valid date.");
                    sender.focus();
                }
            };
        }
        var keyChar = String.fromCharCode(KeyID);
        var ret = true;
        var length = sender.value.length;
        if (KeyID >= KeyPress.ADCONTROL_ZERO && KeyID <= KeyPress.ADCONTROL_NINE) {
            if (sender.value.length == 10) {
                sender.value = "";
            }
            var value = parseInt(keyChar);
            switch (length) {
                case 0:
                    ret = false;
                    sender.value = KeyPress.GetZeroLengthString(value);
                    break;
                case 1:
                    ret = false;
                    sender.value = KeyPress.GetOneLengthString(value, sender.value);
                    break;
                case 3:
                    ret = false;
                    sender.value = KeyPress.GetThreeLengthString(value, sender.value);
                    break;
                case 4:
                    ret = false;
                    sender.value = KeyPress.GetFourLengthString(value, sender.value, sender.PreviousValue);
                    break;
                default:
                    break;
            }
            sender.PreviousValue = value;
            if (event) {
                event.returnValue = ret;
            }
            return ret;
        } else if (KeyID == 13) {
            if (sender.tabIndex) {
                var ti = parseInt(sender.tabIndex) + 1;
                var elements = document.getElementsByTagName('*');
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    if (element.tabIndex == ti) {
                        element.focus();
                        if (element.type && element.type == "text") {
                            element.select();
                        }
                        break;
                    }
                }
            }
        } else {
            return false;
        }
    }
    KeyPress.ShortDate = ShortDate;
    function Number(e, allowDecimals, useTabForward) {
        var key = null;
        var sender = null;
        var shiftKey = true;
        if (window.event) {
            key = window.event.keyCode;
            sender = window.event.srcElement;
            shiftKey = window.event.shiftKey;
        } else if (e) {
            key = e.which;
            sender = e.srcElement;
            shiftKey = e.shiftKey;
        }
        var keyChar = String.fromCharCode(key);
        var ret = true;
        var length = sender.value.length;
        var containsDecimal = sender.value.indexOf(".") > -1;
        if (key == 13) {
            if (sender.tabIndex && useTabForward) {
                var ti = parseInt(sender.tabIndex) + 1;
                var elements = document.getElementsByTagName('*');
                for (var i = 0; i < elements.length; i++) {
                    var element = elements[i];
                    if (element.tabIndex == ti) {
                        element.focus();
                        if (element.type && element.type == "text") {
                            element.select();
                        }
                        break;
                    }
                }
            }
        } else if (key >= 48 && key <= 57) {
            ret = true;
        } else if (keyChar == "." && allowDecimals) {
            if (sender.value.indexOf(".") > -1) {
                var txt = '';
                if (window.getSelection) {
                    txt = window.getSelection().toString();
                } else if (document.getSelection) {
                    txt = document.getSelection().toString();
                } else if (document.selection) {
                    txt = document.selection.createRange().text;
                }
                if (txt.length != sender.value.length) {
                    ret = false;
                }
            }
        } else if (keyChar == "." && !allowDecimals) {
            ret = false;
        } else {
            if (keyChar == "-") {
                if (sender.value != "") {
                    ret = false;
                }
            } else {
                ret = false;
            }
        }
        if (event) {
            event.returnValue = ret;
        }
        return ret;
    }
    KeyPress.Number = Number;
})(KeyPress || (KeyPress = {}));
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
var RegularExpression;
(function (RegularExpression) {
    RegularExpression.StandardBindingWrapper = /{|}/g, RegularExpression.StandardBindingPattern = /{(\w+(\.\w+)*)}/g, RegularExpression.MethodPattern = /\w+(\.\w+)*\(/g, RegularExpression.ObjectAndMethod = /{(\w+(\.\w+)*)}\.\w+\(\)/g, RegularExpression.ObjectMethod = /\.\w+\(\)/g, RegularExpression.ParameterPattern = /\(.*(,\s*.*)*\)/g, RegularExpression.ZDate = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z/g, RegularExpression.UTCDate = /\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}/i;
    function Replace(patternToLookFor, sourceString, sourceObjectOrArray, trimFromResultPattern) {
        var matches = sourceString.match(patternToLookFor);
        if (matches) {
            var regMatches = new Array();
            for (var i = 0; i < matches.length; i++) {
                regMatches.push({
                    Match: matches[i],
                    PropertyName: matches[i].replace(RegularExpression.StandardBindingWrapper, "")
                });
            }
            if (Is.Array(sourceObjectOrArray)) {
                for (var i = 0; i < regMatches.length; i++) {
                    for (var j = 0; j < sourceObjectOrArray.length; j++) {
                        if (sourceObjectOrArray[j] && sourceObjectOrArray[j].hasOwnProperty(regMatches[i].PropertyName)) {
                            //Common.HasProperty(sourceObjectOrArray[j], regMatches[i].PropertyName)) {
                            sourceString = sourceString.replace(regMatches[i].Match, sourceObjectOrArray[j][regMatches[i].PropertyName]);
                            break;
                        }
                    }
                }
            } else {
                for (var i = 0; i < regMatches.length; i++) {
                    if (sourceObjectOrArray && sourceObjectOrArray.hasOwnProperty(regMatches[i].PropertyName)) {
                        //Common.HasProperty(sourceObjectOrArray, regMatches[i].PropertyName)) {
                        sourceString = sourceString.replace(regMatches[i].Match, sourceObjectOrArray[regMatches[i].PropertyName]);
                    }
                }
            }
        }
        return sourceString;
    }
    RegularExpression.Replace = Replace;
})(RegularExpression || (RegularExpression = {}));
var Session;
(function (Session) {
    Session.Dictionary = {};
    function CanStore() {
        try  {
            return sessionStorage ? true : false;
        } catch (e) {
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
        try  {
            var temp = null;
            var found = Session.Dictionary[key];
            if (found) {
                temp = found;
            } else if (!temp && Session.CanStore()) {
                if (Is.Property(key, sessionStorage)) {
                    temp = sessionStorage.getItem(key);
                }
                if (Is.Json(temp)) {
                    temp = JSON.parse(temp);
                    Ajax.ConvertProperties(temp);
                } else if (defaultObject) {
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
    Session.Get = Get;
})(Session || (Session = {}));
var Thing;
(function (Thing) {
    function Merge(object, into) {
        for (var prop in object) {
            var value = object[prop];
            if (value) {
                into[prop] = object[prop];
            }
        }
        return into;
    }
    Thing.Merge = Merge;
    function Clone(object) {
        var newobject = {};
        for (var prop in object) {
            newobject[prop] = object[prop];
        }
        return newobject;
    }
    Thing.Clone = Clone;
    function ToArray(object, nameColumn, valueColumn) {
        var ret = new Array();
        if (!nameColumn) {
            nameColumn = "Name";
        }
        if (!valueColumn) {
            valueColumn = "Value";
        }
        for (var prop in object) {
            var localObj = {};
            localObj[nameColumn] = prop;
            localObj[valueColumn] = object[prop];
            ret.push(localObj);
        }
        return ret;
    }
    Thing.ToArray = ToArray;
    function Concat(object, properties) {
        var ret = "";
        for (var i = 0; i < properties.length; i++) {
            if (Is.Property(properties[i], object)) {
                var value = object[properties[i]];
                if (value) {
                    ret += value.toString();
                }
            }
        }
        return ret;
    }
    Thing.Concat = Concat;
    function GetValueIn(object, forPropertyName, defaultValue) {
        if (object[forPropertyName]) {
            return object[forPropertyName];
        } else if (defaultValue) {
            return defaultValue;
        }
        return null;
    }
    Thing.GetValueIn = GetValueIn;
})(Thing || (Thing = {}));
var What;
(function (What) {
    (function (Is) {
        function EnumName(inObject, forValue) {
            for (var prop in inObject) {
                if (inObject[prop] == forValue) {
                    return prop;
                }
            }
            return null;
        }
        Is.EnumName = EnumName;
        function EnumValue(inObject, forName) {
            for (var prop in inObject) {
                if (prop == forName) {
                    return inObject[prop];
                }
            }
            return null;
        }
        Is.EnumValue = EnumValue;
    })(What.Is || (What.Is = {}));
    var Is = What.Is;
})(What || (What = {}));

Array.prototype.Select = function (keySelector) {
    var ret = new Array();
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        var newObj = keySelector(obj);
        ret.push(newObj);
    }
    return ret;
};
Array.prototype.Ascend = function (keySelector) {
    return this.sort(function (a, b) {
        return keySelector(a) < keySelector(b) ? -1 : keySelector(a) > keySelector(b) ? 1 : 0;
    });
};
Array.prototype.Descend = function (keySelector) {
    return this.sort(function (a, b) {
        return keySelector(a) < keySelector(b) ? 1 : keySelector(a) > keySelector(b) ? -1 : 0;
    });
};
Array.prototype.First = function (func) {
    var firstFound = -1;
    if (func) {
        for (var i = 0; i < this.length; i++) {
            var currentObject = this[i];
            var match = func(currentObject);
            if (match) {
                firstFound = i;
            }
            if (firstFound > -1) {
                return this[firstFound];
            }
        }
    } else if (this.length > 0) {
        return this[0];
    }
    return null;
};
Array.prototype.Last = function (func) {
    if (func) {
        if (this.length > 0) {
            var firstFound = -1;
            var pos = this.length - 1;
            while (pos > 0) {
                var currentObject = this[pos];
                var match = func(currentObject);
                if (match) {
                    firstFound = pos;
                }
                if (firstFound > -1) {
                    return this[firstFound];
                }
                pos--;
            }
        }
    } else {
        if (this.length > 0) {
            return this[this.length - 1];
        }
    }
    return null;
};
Array.prototype.Remove = function (func) {
    var removeIndexes = new Array();
    for (var i = 0; i < this.length; i++) {
        var currentObject = this[i];
        var match = func(currentObject);
        if (match) {
            removeIndexes.push(i);
        }
    }
    var pos = removeIndexes.length - 1;
    var trySave = pos > -1;
    while (pos > -1) {
        this.splice(removeIndexes[pos], 1);
        pos--;
    }
    return this;
};
Array.prototype.Where = function (func) {
    var matches = new Array();
    for (var i = 0; i < this.length; i++) {
        var currentObject = this[i];
        var match = func(currentObject);
        if (match) {
            matches.push(currentObject);
        }
    }
    return matches;
};
Array.prototype.Min = function (field) {
    var ret = null;
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (obj[field]) {
            if (ret == null) {
                ret = obj[field];
            } else if (ret > obj[field]) {
                ret = obj[field];
            }
        }
    }
    return ret;
};
Array.prototype.Max = function (field) {
    var ret = 0;
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (obj[field]) {
            if (ret < obj[field]) {
                ret = obj[field];
            }
        }
    }
    return ret;
};
Array.prototype.Take = function (count) {
    var ret = new Array();
    for (var i = 0; i < count; i++) {
        if (this.length > i) {
            ret.push(this[i]);
        } else {
            break;
        }
    }
    return ret;
};

///takes args as parameters array
Array.prototype.Add = function (objectOrObjects) {
    if (!Is.Array(objectOrObjects)) {
        objectOrObjects = [objectOrObjects];
    }
    for (var i = 0; i < objectOrObjects.length; i++) {
        this.push(objectOrObjects[i]);
    }
};

///takes args as parameters array
Array.prototype.GroupBy = function () {
    var groupBy = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        groupBy[_i] = arguments[_i + 0];
    }
    var ret = new Array();
    for (var i = 0; i < this.length; i++) {
        var that = this[i];
        var found = ret.First(function (obj) {
            var f = true;
            for (var i = 0; i < groupBy.length; i++) {
                if (obj[groupBy[i]] != that[groupBy[i]]) {
                    f = false;
                    break;
                }
            }
            return f;
        });
        if (!found) {
            var newObj = {
                Grouping: new Array()
            };
            for (var field in that) {
                newObj[field] = that[field];
            }
            newObj.Grouping.push(that);
            ret.push(newObj);
        } else {
            found["Grouping"].push(that);
        }
    }
    return ret;
};

///If functionOrObject is object supply only fields necessary for match
Array.prototype.IndexOf = function (funcOrObj) {
    var i = -1;
    var isFunction = Is.Function(funcOrObj);
    if (isFunction) {
        for (var i = 0; i < this.length; i++) {
            if (funcOrObj(this[i])) {
                return i;
            }
        }
    } else {
        for (var i = 0; i < this.length; i++) {
            var match = true;
            for (var prop in funcOrObj) {
                if (funcOrObj[prop] != this[i][prop]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                return i;
            }
        }
    }
    return i;
};

///obj - object to insert
///position - where you want it in the array
Array.prototype.Insert = function (obj, position) {
    if (position == undefined) {
        position = 0;
    }
    if (position > this.length) {
        position = this.length;
    }
    this.splice(position, 0, obj);
};

///If functionOrObject is object supply only fields necessary for match
///field - the field to sum against
Array.prototype.Sum = function (field) {
    var ret = 0;
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (obj[field]) {
            ret += obj[field];
        }
    }
    return ret;
};

///property is the property name of the object you want to return as an array
Array.prototype.ToArray = function (property) {
    var ret = new Array();
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (item[property]) {
            ret.push(item[property]);
        }
    }
    return ret;
};

Date.prototype.Clone = function () {
    return this.AddDays(0);
};
Date.prototype.format = function (mask, utc) {
    return Formatters.DateTime.Format(this, mask, utc);
};
Date.prototype.ShortDate = function () {
    return this.format("mm/dd/yyyy");
};
Date.prototype.SmallDate = function () {
    var now = new Date(this.getFullYear(), this.getMonth(), this.getDate(), 0, 0, 0, 0);
    return now;
};

/*
date - date to compare with current date
*/
Date.prototype.Equals = function (date) {
    var ret = this.getMonth() == date.getMonth() && this.getFullYear() == date.getFullYear() && this.getDate() == date.getDate();
    return ret;
};

/*
days - number of days to add to the current date
*/
Date.prototype.AddDays = function (days) {
    //var milliSecondsPerDay = 24 * 60 * 60 * 1000 * days;
    //var currentDate = this;
    //var valueofcurrentDate = currentDate.valueOf() + ((24 * 60 * 60 * 1000) * days);
    //done like this cause daylight savings interferes with it
    return this.Add(0, 0, days);
    //return new Date(valueofcurrentDate);
    //var newDate = new Date(valueofcurrentDate);
    //return new Date(this.getTime() + milliSecondsPerDay);
};
Date.prototype.Add = function (years, months, days, hours, minutes, seconds) {
    //var milliSecondsPerDay = 24 * 60 * 60 * 1000 * days;
    //var currentDate = this;
    //var valueofcurrentDate = currentDate.valueOf() + ((24 * 60 * 60 * 1000) * days);
    //done like this cause daylight savings interferes with it
    years = years ? years : 0;
    months = months ? months : 0;
    days = days ? days : 0;
    hours = hours ? hours : 0;
    minutes = minutes ? minutes : 0;
    seconds = seconds ? seconds : 0;
    var y = this.getFullYear() + years;
    var m = this.getMonth() + months;
    var d = this.getDate() + days;
    var h = this.getHours() + hours;
    var mm = this.getMinutes() + minutes;
    var s = this.getSeconds() + seconds;
    var ms = this.getMilliseconds();
    return new Date(y, m, d, h, mm, s, ms);
};

/*
Returns the number of days in the current month
*/
Date.prototype.DaysInMonth = function () {
    return 32 - new Date(this.getFullYear(), this.getMonth(), 32).getDate();
};

/*
Returns the Name of the current month
*/
Date.prototype.MonthName = function () {
    switch (this.getMonth()) {
        case 0:
            return "January";
        case 1:
            return "February";
        case 2:
            return "March";
        case 3:
            return "April";
        case 4:
            return "May";
        case 5:
            return "June";
        case 6:
            return "July";
        case 7:
            return "August";
        case 8:
            return "September";
        case 9:
            return "October";
        case 10:
            return "November";
        case 11:
            return "December";
        default:
            return "Unknown";
    }
};

/*
subtractDate - date object
This return total days between the extended date and the subtract date
*/
Date.prototype.DaysDiff = function (subtractDate) {
    var diff = Math.abs(this - subtractDate);
    return diff / 1000 / 60 / 60 / 24;
};

/*
subtractDate - date object
This return total minutes between the extended date and the subtract date
*/
Date.prototype.MinuteDiff = function (subtractDate) {
    var diff = Math.abs(this - subtractDate);
    return diff / 1000 / 60 / 60;
};

Element.prototype.Popup = function (target, position, hideInterval) {
    Dialog.Popup(this, target, position, hideInterval);
};
Element.prototype.Modal = function (modalClass, position, hideInterval, target) {
    Dialog.Modal(this, modalClass, position, hideInterval, target);
};
Element.prototype.Quick = function (target, position, hideInterval) {
    Dialog.Quick(this, target, position);
};
Element.prototype.Dialog = function (dialogProperties) {
    var dp = new DialogProperties(this, Thing.GetValueIn(dialogProperties, "DialogType", 3 /* Standard */), Thing.GetValueIn(dialogProperties, "Target"), Thing.GetValueIn(dialogProperties, "HideInterval"), Thing.GetValueIn(dialogProperties, "Position", 0 /* MiddleOfWindow */), Thing.GetValueIn(dialogProperties, "ModalClass"), Thing.GetValueIn(dialogProperties, "OffSetX"), Thing.GetValueIn(dialogProperties, "OffSetY"));
    Dialog.Standard(dp);
};

HTMLElement.prototype.SetSelected = function (obj) {
    if (this.tagName == "UL" && this.DataObject) {
        var selectedListItem = this.First(function (ele) {
            return ele.tagName == "LI" && ele.DataObject == obj;
        });
        if (selectedListItem) {
            Binding.Grid.SetSelected(this, obj, selectedListItem);
        }
    }
};
HTMLElement.prototype.Bind = function (data, appendData) {
    if (data) {
        Bind(this, data, appendData);
    } else {
        Binding.Load(this);
    }
};
HTMLElement.prototype.Set = function (objectProperties) {
    var that = this;
    if (objectProperties) {
        for (var prop in objectProperties) {
            var tempPropName = prop;
            if (tempPropName != "cls" && tempPropName != "className") {
                var isStyleProp = Is.Style(tempPropName);
                if (isStyleProp) {
                    that.style[tempPropName] = objectProperties[prop];
                } else if (prop == "style") {
                    if (objectProperties.style.cssText) {
                        that.style.cssText = objectProperties.style.cssText;
                    }
                } else {
                    that[tempPropName] = objectProperties[prop];
                }
            } else {
                that.SetClass(objectProperties[prop]);
            }
        }
    }
    return that;
};

///Add listener event to the Element
HTMLElement.prototype.AddListener = function (eventName, method) {
    if (this.addEventListener) {
        this.addEventListener(eventName, method);
    } else {
        this.attachEvent(eventName, method);
    }
};

///clears all matching descendants from the predicate
///predicate returns bool accepts one arg (element)
HTMLElement.prototype.Clear = function (predicate, notRecursive) {
    var that = this;
    var children = that.childNodes;
    if (!predicate) {
        while (children.length > 0) {
            that.removeChild(children[0]);
        }
    } else {
        var pos = children.length - 1;
        while (pos > 0) {
            if (children[pos].nodeType == 1) {
                var child = children[pos];
                if (predicate(child)) {
                    that.removeChild(child);
                } else if (!notRecursive && child.Clear) {
                    child.Clear(predicate, notRecursive);
                }
            } else {
                that.removeChild(children[pos]);
            }
            pos--;
        }
    }
};

///predicate is bool return function that operates with a Parameter of element
///assumes First element found is only one to delete
HTMLElement.prototype.Delete = function (predicate) {
    var that = this;
    var found = that.First(predicate);
    if (found) {
        found.Remove();
    }
};

///add range of elements to Element
HTMLElement.prototype.AddRange = function () {
    var elements = [];
    for (var _i = 0; _i < (arguments.length - 0); _i++) {
        elements[_i] = arguments[_i + 0];
    }
    var that = this;
    for (var i = 0; i < elements.length; i++) {
        var child = elements[i];
        that.appendChild(child);
    }
    return that;
};
HTMLElement.prototype.DimAndOff = function () {
    var ret = {
        Height: 0,
        Width: 0,
        Top: 0,
        Left: 0
    };
    var dim = this.Dimensions();
    var pos = this.OffSet();
    ret.Height = dim.height;
    ret.Width = dim.width;
    ret.Top = pos.top;
    ret.Left = pos.left;
    return ret;
};

//returns { width: number; height: number; } for element
HTMLElement.prototype.Dimensions = function () {
    var ret = { width: 0, height: 0 };
    ret.width = this.offsetWidth;
    ret.height = this.offsetHeight;
    return ret;
};

///return { top: number; left: number; } for Element
HTMLElement.prototype.OffSet = function () {
    var _x = 0;
    var _y = 0;
    var el = this;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;

        //may not work
        el = el.offsetParent;
    }
    return { top: _y, left: _x };
};

///returns first parent ancestor that produces true from the predicate function
//predicate returns bool and takes one arg
HTMLElement.prototype.Parent = function (predicate) {
    if (predicate(this.parentNode)) {
        return this.parentNode;
    } else {
        return this.parentNode.Parent(predicate);
    }
    return null;
};

///clears and sets class on Element
HTMLElement.prototype.SetClass = function (className) {
    this.className = null;
    this.className = className;
};

///functionOrObject - function or object used to find matching child elements of the Element
///notRecursive - default false, if true will only go one child deep otherwise dives all descendants,
///dont supply nodes, its used for recursive additions on descendants
HTMLElement.prototype.Get = function (func, notRecursive, nodes) {
    if (nodes == null) {
        nodes = new Array();
    }
    var that = this;
    for (var i = 0; i < that.childNodes.length; i++) {
        if (this.childNodes[i].nodeType == 1) {
            var child = this.childNodes[i];
            var fmatch = func(child);
            if (fmatch) {
                nodes.push(child);
            }
            if (!notRecursive && child.Get) {
                child.Get(func, notRecursive, nodes);
            }
        }
    }
    return nodes;
};

///just removes child
HTMLElement.prototype.Remove = function () {
    this.parentNode.removeChild(this);
};

///functionOrObject - function or object used to find first matching child element of the Element
HTMLElement.prototype.First = function (func) {
    var that = this;
    var children = that.childNodes;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 1) {
            var child = children[i];
            if (func(child)) {
                return child;
            }
        }
    }
    var found = null;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 1) {
            var c = children[i];
            if (c.First) {
                found = c.First(func);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
};

HTMLInputElement.prototype.AutoSuggest = function (dataSource, valueMember, displayMembers, displayJoiner, displayCount) {
    AutoSuggest.Hook(this, dataSource, valueMember, displayMembers, displayJoiner, displayCount);
};

HTMLSelectElement.prototype.AddOptions = function (arrayOrObject, valueProperty, displayProperty, selectedValue) {
    var select = this;
    if (Is.Array(arrayOrObject)) {
        var tempArray = arrayOrObject;
        if (displayProperty && valueProperty) {
            for (var i = 0; i < tempArray.length; i++) {
                var item = tempArray[i];
                select["options"][select.options.length] = new Option(item[displayProperty], item[valueProperty]);
                if (selectedValue && item[valueProperty] == selectedValue) {
                    select["options"][select.options.length - 1].selected = "true";
                }
            }
        } else if (tempArray.length > 1 && Is.String(tempArray[0])) {
            for (var i = 0; i < tempArray.length; i++) {
                var item = tempArray[i];
                select["options"][select.options.length] = new Option(item, item);
                if (selectedValue && item == selectedValue) {
                    select["options"][select.options.length - 1].selected = "true";
                }
            }
        }
    } else if (arrayOrObject) {
        for (var prop in arrayOrObject) {
            if (Is.Function(prop)) {
                select["options"][select.options.length] = new Option(prop, prop);
                if (selectedValue && selectedValue == prop) {
                    select["options"][select.options.length - 1].selected = "selected";
                }
            }
        }
    }
    return select;
};
HTMLSelectElement.prototype.AddOptionsViaObject = function (obj, selectedValue, orderedAsIs) {
    var select = this;
    if (orderedAsIs) {
        for (var prop in obj) {
            select["options"][select.options.length] = new Option(prop, obj[prop]);
            if (selectedValue && selectedValue == obj[prop]) {
                select["options"][select.options.length - 1].selected = "selected";
            }
        }
    } else {
        var tempArray = new Array();
        for (var prop in obj) {
            if (Is.Numeric(obj[prop])) {
                tempArray.push(prop);
            }
        }
        tempArray = tempArray.sort();
        for (var i = 0; i < tempArray.length; i++) {
            var prop = tempArray[i];
            select["options"][select.options.length] = new Option(prop, obj[prop]);
            if (selectedValue != undefined && selectedValue == obj[prop]) {
                select["options"][select.options.length - 1].selected = "selected";
            }
        }
    }
};

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

Window.prototype.Show = function (viewKey, parameters) {
    ViewManager.Load(viewKey, parameters);
};
Window.prototype.SetLocation = function (url) {
    var temp = window;
    temp.location = url;
};
Window.prototype.Dimensions = function () {
    var ret = { Height: 0, Width: 0 };
    var temp = window;
    if (typeof temp.innerWidth != 'undefined') {
        ret.Width = temp.innerWidth, ret.Height = temp.innerHeight;
    } else if (typeof document.documentElement != 'undefined' && typeof document.documentElement.clientWidth != 'undefined' && document.documentElement.clientWidth != 0) {
        ret.Width = document.documentElement.clientWidth, ret.Height = document.documentElement.clientHeight;
    } else {
        ret.Width = document.getElementsByTagName('body')[0].clientWidth, ret.Height = document.getElementsByTagName('body')[0].clientHeight;
    }
    return ret;
};
Window.prototype.PushState = function (stateobj, title, url) {
    if (history && history.pushState) {
        if (Is.Array(url)) {
            url = "/" + url.join("/");
        } else if (!url) {
            url = "/";
        } else if (url.indexOf("/") != 0) {
            url = "/" + url;
        }
        history.pushState(stateobj, title, url);
    }
};
Window.prototype.ShortDate = function () {
    var date = new Date();
    var now = new Date(date.getFullYear(), date.getMonth(), date.getDate(), 0, 0, 0, 0);
    return now;
};
Window.prototype.Sleep = function (milliseconds) {
    var date = new Date();
    var curDate = new Date();
    while (curDate.getMilliseconds() - date.getMilliseconds() < milliseconds) {
    }
};
Window.prototype.MousePosition = function (e) {
    if (event || e) {
        if (Is.InternetExplorer()) {
            return { X: event.clientX + document.body.scrollLeft, Y: event.clientY + document.body.scrollTop };
        } else {
            return { X: e.pageX, Y: e.pageY };
        }
    }
    return { X: 0, Y: 0 };
};
Window.prototype.UniqueID = function () {
    return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function (c) {
        var r = Math.random() * 16 | 0, v = c == 'x' ? r : (r & 0x3 | 0x8);
        return v.toString(16);
    }).replace("-", "").substring(0, 16);
};
Window.prototype.SplitPathName = function (index) {
    var ret = new Array();
    var pathName = window.location.pathname;
    if (index == undefined) {
        index = -1;
    }
    pathName = pathName.substring(1);
    var lastCharacter = pathName.charAt(pathName.length - 1);
    if (lastCharacter == "/") {
        pathName = pathName.substring(0, pathName.length - 1);
    }
    var split = pathName.split("/");
    if (index > -1) {
        return split[index];
    } else {
        return split;
    }
    return null;
};
Window.prototype.PageLoaded = function (postLoadFuntion, e) {
    if (document.readyState === "complete") {
        postLoadFuntion();
    } else {
        if (window.onload) {
            var curronload = window.onload;
            var newonload = function () {
                curronload(e);
                postLoadFuntion();
            };
            window.onload = newonload;
        } else {
            window.onload = function () {
                postLoadFuntion();
            };
        }
    }
};
function autoBindForms() {
    var elements = document.body.Get(function (ele) {
        return !Is.NullOrEmpty(ele.getAttribute("data-loadbinding"));
    });
    for (var i = 0; i < elements.length; i++) {
        Binding.Load(elements[i]);
    }
}
function WindowLoad(e) {
    if (document.readyState === "complete") {
        var pg = document.getElementById("progress");
        if (pg != null && Ajax) {
            Ajax.ProgressElement = pg;
        }
        autoBindForms();
    } else {
        if (window.onload) {
            var curronload = window.onload;
            var newonload = function () {
                var pg = document.getElementById("progress");
                if (pg != null && Ajax) {
                    Ajax.ProgressElement = pg;
                }
                curronload(e);
                autoBindForms();
            };
            window.onload = newonload;
        } else {
            window.onload = function () {
                var pg = document.getElementById("progress");
                if (pg != null && Ajax) {
                    Ajax.ProgressElement = pg;
                }
                autoBindForms();
            };
        }
    }
}
WindowLoad();
//# sourceMappingURL=Bastard.js.map
