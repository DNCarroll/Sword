/// <reference path="../Modules/Ajax.ts"/>
/// <reference path="../Modules/Formatters.ts"/>
/// <reference path="../Modules/KeyPress.ts"/>
/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Modules/RegularExpression.ts"/>
/// <reference path="../Prototypes/Array.ts"/>
/// <reference path="../Prototypes/Date.ts"/>
/// <reference path="../Prototypes/HTMLElement.ts"/>
/// <reference path="../Prototypes/UnorderedList.ts"/>
/// <reference path="../Modules/Thing.ts"/>
/// <reference path="../Prototypes/Select.ts"/>
/// <reference path="../Prototypes/String.ts"/>
/// <reference path="../Prototypes/Window.ts"/>
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
            }
            else {
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
            //what is return line?
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
                    }
                    else if (property == "obj") {
                        arrayOfValues.push(obj);
                    }
                    else {
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
            }
            else if (this.ParameterProperties.length == 1) {
                return this.DrilldownValue(obj, this.ParameterProperties[0]);
            }
            else {
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
                    }
                    else {
                        dataObject = dataObject[properties[i]];
                    }
                }
                else {
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
    var Get;
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
            }
            else if (element.parentNode["DataObject"]) {
                dataObject = element.parentNode["DataObject"];
            }
            else if (element.parentNode) {
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
                        }
                        else {
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
            }
            else if (pn) {
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
                }
                else {
                    dataBindings = dataBindings.split("::");
                    for (var i = 0; i < dataBindings.length; i++) {
                        var dataBinding = dataBindings[i].split(":");
                        if (dataBinding.length == 1) {
                            ret.LineType = dataBinding[0].Trim();
                        }
                        else {
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
            }
            else if (Is.Object(dataBinding)) {
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
            }
            else if (Is.String(dataBinding) && element) {
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
                }
                else {
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
                    }
                    else if (inlineMatches[i] == "{sender}") {
                        arrayOfValues.push(element);
                        method = method.replace("{sender}", "obj" + i.toString());
                    }
                    else {
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
                }
                else {
                    attributeAndValue = { Name: attributeAndValue[0], Value: attributeAndValue[1] };
                }
            }
            else {
                attributeAndValue = line;
            }
            if (attributeAndValue) {
                var att = new Binding.Attribute(attributeAndValue.Name, attributeAndValue.Value);
                return att;
            }
            return null;
        }
        Get.Attribute = Attribute;
    })(Get = Binding.Get || (Binding.Get = {}));
    var Set;
    (function (Set) {
        function SetBinding(element, wrapper, attributes) {
            try {
                for (var i = 0; i < attributes.length; i++) {
                    var att = attributes[i];
                    if (att.EasyBindable) {
                        Binding.Set.AttributeValue(element, att);
                    }
                    else if (att.Name == "delete") {
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
            }
            catch (e) {
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
            }
            else if (att.Name == "onmouseover") {
                element.onmouseover = function () {
                    return att.Return(element);
                };
            }
            else if (att.Name == "onmouseout") {
                element.onmouseout = function () {
                    return att.Return(element);
                };
            }
            else if (att.Name == Binding.Attributes.OnFocus) {
                element.onfocus = function () {
                    return att.Return(element);
                };
            }
            else {
                tempValue = att.Return(element);
                if (att.Name == "classname" || att.Name == "cls") {
                    element.className = null;
                    element.className = tempValue;
                }
                else if (att.Name == "for") {
                    element.setAttribute("for", tempValue);
                }
                else if (Is.Property(att.Name, element)) {
                    element[att.Name] = null;
                    element[att.Name] = tempValue;
                }
                else if (Is.Style(att.Name)) {
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
            }
            else {
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
                    }
                    else {
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
                            }
                            else {
                                PostChange(element, wrapper, attributes, tempObj, extProp);
                                Updated(element.DataObject, 1 /* Update */, wrapper, extProp.Target);
                            }
                        }
                        else if (Is.Property(extProp.Target, tempObj)) {
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
            }
            else {
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
            }
            else {
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
            }
            else {
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
                            }
                            else {
                                PostChange(element, wrapper, attributes, tempObj, extProp);
                            }
                        }
                        else if (Is.Property(extProp.Target, tempObj)) {
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
                }
                else {
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
                                }
                                else {
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
                }
                else {
                    select.AddOptions(dataObject(), null, null, selectedValue);
                }
            }
            else if (attributes.First(function (o) {
                return o.Name == Binding.Attributes.ObjectSource;
            })) {
                var objectSource = attributes.First(function (o) {
                    return o.Name == Binding.Attributes.ObjectSource;
                });
                var dataObject = new Function("return " + objectSource.Value + ";");
                select.AddOptionsViaObject(dataObject(), selectedValue);
            }
            else if (attributes.First(function (o) {
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
    })(Set = Binding.Set || (Binding.Set = {}));
    function Execute(element, data, appendData) {
        if (appendData && element.DataObject && Is.Array(element.DataObject)) {
            element.DataObject.Add(data);
        }
        else {
            element.DataObject = data;
        }
        var wrapper;
        if (element.getAttribute("data-binding")) {
            var json = element.getAttribute("data-binding");
            element.Wrapper = new Binding.Wrapper(json);
            element.removeAttribute("data-binding");
            wrapper = element.Wrapper;
        }
        else if (element.Wrapper) {
            wrapper = element.Wrapper;
        }
        else if (!element.Wrapper) {
            element.Wrapper = wrapper;
        }
        var tagName = element.tagName.toLowerCase();
        if (tagName == "ul" && !wrapper.IsForm) {
            Binding.Grid.Execute(element, data, appendData);
        }
        else {
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
                }
                else {
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
                }
                else {
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
    var Grid;
    (function (Grid) {
        Grid.LineTypes = { Header: "Header", Footer: "Footer", Template: "Template" };
        function Add(unorderedList, data, appendData) {
            var arrayOfdata;
            if (Is.Array(data)) {
                arrayOfdata = data;
            }
            else {
                arrayOfdata = new Array();
                arrayOfdata.Add(data);
            }
            if (unorderedList.Wrapper.AsyncLoad) {
                AsyncBind(unorderedList, data, appendData);
            }
            else {
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
                var footer = unorderedList.First(function (o) { return o["LineType"] == Binding.Grid.LineTypes.Footer; });
                if (wrapper.NewRowBeingAdded) {
                    var insertListItem = wrapper.NewRowBeingAdded(tempObj);
                    if (insertListItem) {
                        if (footer) {
                            unorderedList.insertBefore(insertListItem, footer);
                        }
                        else {
                            unorderedList.appendChild(insertListItem);
                        }
                    }
                }
                if (footer) {
                    unorderedList.insertBefore(listitem, footer);
                }
                else {
                    unorderedList.appendChild(listitem);
                }
            }
            else {
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
                }
                else {
                    unorderedList.removeChild(header);
                }
                if (unorderedList.childNodes.length > 0) {
                    unorderedList.insertBefore(header, unorderedList.childNodes[0]);
                }
                else {
                    unorderedList.appendChild(header);
                }
                Binding.Grid.HookInsertTemplate(header, unorderedList);
            }
            if (unorderedList.Footer) {
                var footer = unorderedList.First(function (ele) { return ele["IsFooter"]; });
                if (!footer) {
                    div = "div".CreateElement({ innerHTML: unorderedList.Footer });
                    footer = div.children[0];
                    div.removeChild(footer);
                    footer["IsFooter"] = true;
                }
                else {
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
                    }
                    else {
                        EndAsyncBind(unorderedList);
                    }
                }
                else {
                    EndAsyncBind(unorderedList);
                }
            };
            if (!appendData) {
                unorderedList.innerHTML = html;
                unorderedList.AsyncPosition = 0;
            }
            else {
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
                }
                else {
                    return false;
                }
            });
            if (found) {
                Binding.subExecute(found, wrapper);
            }
            else {
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
                            }
                            else {
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
                    }
                    else if (dataBindings.LineType && dataBindings.LineType == Binding.Grid.LineTypes.Header) {
                        lineItems[i]["LineType"] = dataBindings.LineType;
                        lineItems[i]["InsertPosition"] = dataBindings.InsertPosition;
                        Binding.Grid.HookInsertTemplate(lineItems[i], unorderedList);
                        unorderedList.Header = lineItems[i].outerHTML;
                    }
                    else if (dataBindings.LineType && dataBindings.LineType == Binding.Grid.LineTypes.Footer) {
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
    })(Grid = Binding.Grid || (Binding.Grid = {}));
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
                }
                else {
                    executeSelect();
                }
            }
        }
        else if (wrapper.PrebindAction) {
            var fun = new Function('exe', wrapper.PrebindAction + "(exe);");
            fun(function () {
            });
        }
    }
    Binding.Load = Load;
})(Binding || (Binding = {}));
var Bind = Binding.Execute;
