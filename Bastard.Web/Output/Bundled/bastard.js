if (!this.JSON) {
    this.JSON = {};
}

(function () {

    function f(n) {
        // Format integers to have at least two digits.
        return n < 10 ? '0' + n : n;
    }

    if (typeof Date.prototype.toJSON !== 'function') {

        Date.prototype.toJSON = function (key) {

            return isFinite(this.valueOf()) ?
                   this.getUTCFullYear() + '-' +
                 f(this.getUTCMonth() + 1) + '-' +
                 f(this.getUTCDate()) + 'T' +
                 //f(this.getUTCDate())      + ' ' +
                 f(this.getUTCHours()) + ':' +
                 f(this.getUTCMinutes()) + ':' +
                 f(this.getUTCSeconds()) + 'Z' : null;
        };

        String.prototype.toJSON =
        Number.prototype.toJSON =
        Boolean.prototype.toJSON = function (key) {
            return this.valueOf();
        };
    }

    var cx = /[\u0000\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        escapable = /[\\\"\x00-\x1f\x7f-\x9f\u00ad\u0600-\u0604\u070f\u17b4\u17b5\u200c-\u200f\u2028-\u202f\u2060-\u206f\ufeff\ufff0-\uffff]/g,
        gap,
        indent,
        meta = {    // table of character substitutions
            '\b': '\\b',
            '\t': '\\t',
            '\n': '\\n',
            '\f': '\\f',
            '\r': '\\r',
            '"': '\\"',
            '\\': '\\\\'
        },
        rep;


    function quote(string) {

        // If the string contains no control characters, no quote characters, and no
        // backslash characters, then we can safely slap some quotes around it.
        // Otherwise we must also replace the offending characters with safe escape
        // sequences.

        escapable.lastIndex = 0;
        return escapable.test(string) ?
            '"' + string.replace(escapable, function (a) {
                var c = meta[a];
                return typeof c === 'string' ? c :
                    '\\u' + ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
            }) + '"' :
            '"' + string + '"';
    }


    function str(key, holder) {

        // Produce a string from holder[key].

        var i,          // The loop counter.
            k,          // The member key.
            v,          // The member value.
            length,
            mind = gap,
            partial,
            value = holder[key];

        // If the value has a toJSON method, call it to obtain a replacement value.

        if (value && typeof value === 'object' &&
                typeof value.toJSON === 'function') {
            value = value.toJSON(key);
        }

        // If we were called with a replacer function, then call the replacer to
        // obtain a replacement value.

        if (typeof rep === 'function') {
            value = rep.call(holder, key, value);
        }

        // What happens next depends on the value's type.

        switch (typeof value) {
            case 'string':
                return quote(value);

            case 'number':

                // JSON numbers must be finite. Encode non-finite numbers as null.

                return isFinite(value) ? String(value) : 'null';

            case 'boolean':
            case 'null':

                // If the value is a boolean or null, convert it to a string. Note:
                // typeof null does not produce 'null'. The case is included here in
                // the remote chance that this gets fixed someday.

                return String(value);

                // If the type is 'object', we might be dealing with an object or an array or
                // null.

            case 'object':

                // Due to a specification blunder in ECMAScript, typeof null is 'object',
                // so watch out for that case.

                if (!value) {
                    return 'null';
                }

                // Make an array to hold the partial results of stringifying this object value.

                gap += indent;
                partial = [];

                // Is the value an array?

                if (Object.prototype.toString.apply(value) === '[object Array]') {

                    // The value is an array. Stringify every element. Use null as a placeholder
                    // for non-JSON values.

                    length = value.length;
                    for (i = 0; i < length; i += 1) {
                        partial[i] = str(i, value) || 'null';
                    }

                    // Join all of the elements together, separated with commas, and wrap them in
                    // brackets.

                    v = partial.length === 0 ? '[]' :
                        gap ? '[\n' + gap +
                                partial.join(',\n' + gap) + '\n' +
                                    mind + ']' :
                              '[' + partial.join(',') + ']';
                    gap = mind;
                    return v;
                }

                // If the replacer is an array, use it to select the members to be stringified.

                if (rep && typeof rep === 'object') {
                    length = rep.length;
                    for (i = 0; i < length; i += 1) {
                        k = rep[i];
                        if (typeof k === 'string') {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                } else {

                    // Otherwise, iterate through all of the keys in the object.

                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = str(k, value);
                            if (v) {
                                partial.push(quote(k) + (gap ? ': ' : ':') + v);
                            }
                        }
                    }
                }

                // Join all of the member texts together, separated with commas,
                // and wrap them in braces.

                v = partial.length === 0 ? '{}' :
                    gap ? '{\n' + gap + partial.join(',\n' + gap) + '\n' +
                            mind + '}' : '{' + partial.join(',') + '}';
                gap = mind;
                return v;
        }
    }

    // If the JSON object does not yet have a stringify method, give it one.

    if (typeof JSON.stringify !== 'function') {
        JSON.stringify = function (value, replacer, space) {

            // The stringify method takes a value and an optional replacer, and an optional
            // space parameter, and returns a JSON text. The replacer can be a function
            // that can replace values, or an array of strings that will select the keys.
            // A default replacer method can be provided. Use of the space parameter can
            // produce text that is more easily readable.

            var i;
            gap = '';
            indent = '';

            // If the space parameter is a number, make an indent string containing that
            // many spaces.

            if (typeof space === 'number') {
                for (i = 0; i < space; i += 1) {
                    indent += ' ';
                }

                // If the space parameter is a string, it will be used as the indent string.

            } else if (typeof space === 'string') {
                indent = space;
            }

            // If there is a replacer, it must be a function or an array.
            // Otherwise, throw an error.

            rep = replacer;
            if (replacer && typeof replacer !== 'function' &&
                    (typeof replacer !== 'object' ||
                     typeof replacer.length !== 'number')) {
                throw new Error('JSON.stringify');
            }

            // Make a fake root object containing our value under the key of ''.
            // Return the result of stringifying the value.

            return str('', { '': value });
        };
    }


    // If the JSON object does not yet have a parse method, give it one.

    if (typeof JSON.parse !== 'function') {
        JSON.parse = function (text, reviver) {

            // The parse method takes a text and an optional reviver function, and returns
            // a JavaScript value if the text is a valid JSON text.

            var j;

            function walk(holder, key) {

                // The walk method is used to recursively walk the resulting structure so
                // that modifications can be made.

                var k, v, value = holder[key];
                if (value && typeof value === 'object') {
                    for (k in value) {
                        if (Object.hasOwnProperty.call(value, k)) {
                            v = walk(value, k);
                            if (v !== undefined) {
                                value[k] = v;
                            } else {
                                delete value[k];
                            }
                        }
                    }
                }
                return reviver.call(holder, key, value);
            }


            // Parsing happens in four stages. In the first stage, we replace certain
            // Unicode characters with escape sequences. JavaScript handles many characters
            // incorrectly, either silently deleting them, or treating them as line endings.

            text = String(text);
            cx.lastIndex = 0;
            if (cx.test(text)) {
                text = text.replace(cx, function (a) {
                    return '\\u' +
                        ('0000' + a.charCodeAt(0).toString(16)).slice(-4);
                });
            }

            // In the second stage, we run the text against regular expressions that look
            // for non-JSON patterns. We are especially concerned with '()' and 'new'
            // because they can cause invocation, and '=' because it can cause mutation.
            // But just to be safe, we want to reject all unexpected forms.

            // We split the second stage into 4 regexp operations in order to work around
            // crippling inefficiencies in IE's and Safari's regexp engines. First we
            // replace the JSON backslash pairs with '@' (a non-JSON character). Second, we
            // replace all simple value tokens with ']' characters. Third, we delete all
            // open brackets that follow a colon or comma or that begin the text. Finally,
            // we look to see that the remaining characters are only whitespace or ']' or
            // ',' or ':' or '{' or '}'. If that is so, then the text is safe for eval.

            if (/^[\],:{}\s]*$/
.test(text.replace(/\\(?:["\\\/bfnrt]|u[0-9a-fA-F]{4})/g, '@')
.replace(/"[^"\\\n\r]*"|true|false|null|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?/g, ']')
.replace(/(?:^|:|,)(?:\s*\[)+/g, ''))) {

                // In the third stage we use the eval function to compile the text into a
                // JavaScript structure. The '{' operator is subject to a syntactic ambiguity
                // in JavaScript: it can begin a block or an object literal. We wrap the text
                // in parens to eliminate the ambiguity.

                j = eval('(' + text + ')');

                // In the optional fourth stage, we recursively walk the new structure, passing
                // each name/value pair to a reviver function for possible transformation.

                return typeof reviver === 'function' ?
                    walk({ '': j }, '') : j;
            }

            // If the text is not JSON parseable, then a SyntaxError is thrown.

            throw new SyntaxError('JSON.parse');
        };
    }
}());

///takes args as parameters array
Array.prototype.Add = function (objectOrObjects) {
    if (!objectOrObjects.length) {
        objectOrObjects = [objectOrObjects];
    }
    for (var i = 0; i < objectOrObjects.length; i++) {
        this.push(objectOrObjects[i]);
    }
};

///If functionOrObject is object supply only fields necessary for match
Array.prototype.First = function (functionOrObject) {
    var firstFound = -1;
    var isFunction = Is.Function(functionOrObject);
    for (var i = 0; i < this.length; i++) {
        var currentObject = this[i];
        var match = true;
        if (isFunction) {
            match = functionOrObject(currentObject);
            if (match) {
                firstFound = i;
            }
        } else {
            for (var prop in functionOrObject) {
                if (functionOrObject[prop] != currentObject[prop]) {
                    match = false;
                    break;
                }
            }
            if (match) {
                firstFound = i;
            }
        }
        if (firstFound > -1) {
            return this[firstFound];
        }
    }
    return null;
};

///takes args as parameters array
Array.prototype.GroupBy = function () {
    var groupBy = [];
    for (var _i = 0; _i < (arguments.length - 0) ; _i++) {
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
Array.prototype.IndexOf = function (functionOrObject) {
    var i = -1;
    var isFunction = Is.Function(functionOrObject);
    if (isFunction) {
        for (var i = 0; i < this.length; i++) {
            if (functionOrObject(this[i])) {
                return i;
            }
        }
    } else {
        for (var i = 0; i < this.length; i++) {
            var match = true;
            for (var prop in functionOrObject) {
                if (functionOrObject[prop] != this[i][prop]) {
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
Array.prototype.Remove = function (functionOrObject) {
    var removeIndexes = new Array();
    var isFunction = Is.Function(functionOrObject);
    for (var i = 0; i < this.length; i++) {
        var currentObject = this[i];
        var match = true;
        if (isFunction) {
            match = functionOrObject(currentObject);
        } else {
            var prop;
            for (prop in functionOrObject) {
                if (functionOrObject[prop] != currentObject[prop]) {
                    match = false;
                    break;
                }
            }
        }
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

///If functionOrObject is object supply only fields necessary for match
Array.prototype.Where = function (functionOrObject) {
    var matches = new Array();
    var isFunction = Is.Function(functionOrObject);
    for (var i = 0; i < this.length; i++) {
        var currentObject = this[i];
        var match = true;
        if (isFunction) {
            match = functionOrObject(currentObject);
        } else {
            match = true;
            for (var prop in functionOrObject) {
                if (functionOrObject[prop] != currentObject[prop]) {
                    match = false;
                    break;
                }
            }
        }
        if (match) {
            matches.push(currentObject);
        }
    }
    return matches;
};
//@ sourceMappingURL=Array.js.map

Date.prototype.format = function (mask, utc) {
    return Formatters.DateTime.Format(this, mask, utc);
};

Date.prototype.ShortDate = function () {
    return this.format("mm/dd/yyyy");
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
    var y = this.getFullYear();
    var m = this.getMonth();
    var d = this.getDate();

    //hours, minutes, seconds, milliseconds
    var h = this.getHours();
    var mm = this.getMinutes();
    var s = this.getSeconds();
    var ms = this.getMilliseconds();
    d = d + days;

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
//@ sourceMappingURL=Date.js.map

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
    var dp = new DialogProperties(this, Thing.GetValueIn(dialogProperties, "DialogType", DialogType.Standard), Thing.GetValueIn(dialogProperties, "Target"), Thing.GetValueIn(dialogProperties, "HideInterval"), Thing.GetValueIn(dialogProperties, "Position", DialogPosition.MiddleOfWindow), Thing.GetValueIn(dialogProperties, "ModalClass"), Thing.GetValueIn(dialogProperties, "OffSetX"), Thing.GetValueIn(dialogProperties, "OffSetY"));
    Dialog.Standard(dp);
};
//@ sourceMappingURL=Element.js.map

HTMLElement.prototype.Bind = function (data) {
    Bind(this, data);
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
    if (Is.InternetExplorer()) {
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
        that.removeChild(children[i]);
    } else {
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeType == 1) {
                var child = children[i];
                if (predicate(child)) {
                    that.removeChild(child);
                } else if (!notRecursive) {
                    child.Clear(predicate, notRecursive);
                }
            }
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
    for (var _i = 0; _i < (arguments.length - 0) ; _i++) {
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
    var el = this;
    var ret = { width: 0, height: 0 };
    ret.width = el.offsetWidth;
    ret.height = el.offsetHeight;
    if (ret.height == 0 && el.style.height) {
        ret.height = Convert.EmValueToPixelValue(el.style.height);
        if (el.style.paddingTop) {
            ret.height += Convert.EmValueToPixelValue(el.style.paddingTop);
        }
        if (el.style.paddingBottom) {
            ret.height += Convert.EmValueToPixelValue(el.style.paddingBottom);
        }
    } else if (ret.height == 0) {
        for (var i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i].nodeType == 1) {
                var childDim = (el.childNodes[i]).Dimensions();
                if (childDim.height) {
                    ret.height += childDim.height;
                }
            }
        }
        if (el.style.paddingTop) {
            ret.height += Convert.EmValueToPixelValue(el.style.paddingTop);
        }
        if (el.style.paddingBottom) {
            ret.height += Convert.EmValueToPixelValue(el.style.paddingBottom);
        }
    }
    if (ret.width == 0 && el.style.width) {
        ret.width = Convert.EmValueToPixelValue(el.style.width);
        if (el.style.paddingLeft) {
            ret.width += Convert.EmValueToPixelValue(el.style.paddingLeft);
        }
        if (el.style.paddingRight) {
            ret.width += Convert.EmValueToPixelValue(el.style.paddingRight);
        }
    } else if (ret.width == 0) {
        for (var i = 0; i < el.childNodes.length; i++) {
            if (el.childNodes[i].nodeType == 1) {
                var childDim = (el.childNodes[i]).Dimensions();
                if (childDim.width) {
                    if (childDim.width > ret.width) {
                        ret.width = childDim.width;
                    }
                }
            }
        }
        if (el.style.paddingLeft) {
            ret.width += Convert.EmValueToPixelValue(el.style.paddingLeft);
        }
        if (el.style.paddingRight) {
            ret.width += Convert.EmValueToPixelValue(el.style.paddingRight);
        }
    }

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
HTMLElement.prototype.Get = function (functionOrObject, notRecursive, nodes) {
    if (nodes == null) {
        nodes = new Array();
    }
    var isFunction = Is.Function(functionOrObject);
    var that = this;
    for (var i = 0; i < that.childNodes.length; i++) {
        if (this.childNodes[i].nodeType == 1) {
            var child = this.childNodes[i];
            if (isFunction) {
                var match = functionOrObject(child);
                if (match) {
                    nodes.push(child);
                }
                if (!notRecursive) {
                    child.Get(functionOrObject, notRecursive, nodes);
                }
            } else if (functionOrObject) {
                var match = true;
                for (var prop in functionOrObject) {
                    if (child[prop] != functionOrObject[prop]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    nodes.push(child);
                }
                if (!notRecursive) {
                    child.Get(functionOrObject, notRecursive, nodes);
                }
            } else {
                if (child.nodeType == 1) {
                    nodes.push(child);
                }
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
HTMLElement.prototype.First = function (functionOrObject) {
    var isFunction = Is.Function(functionOrObject);
    var that = this;
    var children = that.childNodes;
    if (isFunction) {
        for (var i = 0; i < children.length; i++) {
            if (children[i].nodeType == 1) {
                var match = functionOrObject(children[i]);
                if (match) {
                    return children[i];
                }
            }
        }
    } else if (functionOrObject) {
        var match = true;
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeType == 1) {
                for (var prop in functionOrObject) {
                    if (child[prop] != functionOrObject[prop]) {
                        match = false;
                        break;
                    }
                }
                if (match) {
                    return child[i];
                }
            }
        }
    }
    var found = null;
    if (functionOrObject) {
        for (var i = 0; i < children.length; i++) {
            var child = children[i];
            if (child.nodeType == 1) {
                found = (child).First(functionOrObject);
                if (found) {
                    return found;
                }
            }
        }
    }
    return null;
};
//@ sourceMappingURL=HTMLElement.js.map

HTMLSelectElement.prototype.AddOptions = function (arrayOrObject, valueProperty, displayProperty, selectedValue) {
    var select = this;
    if (Is.Array(arrayOrObject)) {
        if (displayProperty && valueProperty) {
            for (var i = 0; i < this.length; i++) {
                select["options"][select.options.length] = new Option(item[displayProperty], item[valueProperty]);
                if (selectedValue && item[valueProperty] == selectedValue) {
                    select["options"][select.options.length - 1].selected = "true";
                }
            }
        } else if (this.length > 1 && Is.String(this[0])) {
            for (var i = 0; i < this.length; i++) {
                var item = this[i];
                select["options"][select.options.length] = new Option(item, item);
                if (selectedValue && item == selectedValue) {
                    select["options"][select.options.length - 1].selected = "true";
                }
            }
        }
    } else if (Is.Object(arrayOrObject)) {
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
//@ sourceMappingURL=Select.js.map

String.prototype.Update = function (parameters, success, failure, target) {
    Ajax.HttpAction("PUT", this, parameters, success, failure, target);
};
String.prototype.Delete = function (parameters, success, failure, target) {
    Ajax.HttpAction("DELETE", this, parameters, success, failure, target);
};
String.prototype.ParialUpdate = function (parameters, success, failure, target) {
    Ajax.HttpAction("PATCH", this + "/PartialUpdate", parameters, success, failure, target);
};
String.prototype.Select = function (parameters, success, failure, target) {
    Ajax.HttpAction("PATCH", this + "/Select", parameters, success, failure, target);
};
String.prototype.Insert = function (parameters, success, failure, target) {
    Ajax.HttpAction("Post", this, parameters, success, failure, target);
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
        Html: html,
        Scripts: scripts,
        LoadScripts: function () {
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
    obj.Set(objectProperties);
    return obj;
};
//@ sourceMappingURL=String.js.map

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
        return ele.getAttribute("data-loadbinding");
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
//@ sourceMappingURL=Window.js.map

/// <reference path="../Modules/Is.ts"/>
var Thing;
(function (Thing) {
    function Merge(object, into) {
        for (var prop in object) {
            var value = object[prop];
            if (value)
                ;
            {
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
    })(What.Is || (What.Is = {}));
    var Is = What.Is;
})(What || (What = {}));
//@ sourceMappingURL=Thing.js.map

var Is;
(function (Is) {
    function Property(property, inObject) {
        try {
            return typeof (inObject[property]) !== 'undefined';
        } catch (e) {
        }
        return false;
    }
    Is.Property = Property;
    function Array(value) {
        return value instanceof Array;
    }
    Is.Array = Array;
    function Boolean(value) {
        if (value.toLowerCase() == "true" || value.toLowerCase() == "false") {
            return true;
        }
    }
    Is.Boolean = Boolean;
    function ValidDate(value) {
        try {
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
        return value instanceof Object;
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
})(Is || (Is = {}));
//@ sourceMappingURL=Is.js.map

/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Modules/RegularExpression.ts"/>
/// <reference path="../Prototypes/HTMLElement.ts"/>
/// <reference path="../Prototypes/Window.ts"/>
/// <reference path="../Modules/Thing.ts"/>
var Ajax;
(function (Ajax) {
    Ajax.Host = "";
    Ajax.AutoConvert = true;
    Ajax.ProgressElement = null;
    Ajax.DisableElement = null;
    function ConvertProperties(object) {
        var keyMap = null;
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
            if (!isRaw && ret != "null") {
                ret = JSON.parse(ret);
                if (ret.d) {
                    ret = ret.d;
                }
                if (Ajax.AutoConvert) {
                    Ajax.ConvertProperties(ret);
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
        for (var _i = 0; _i < (arguments.length - 0) ; _i++) {
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
                    val = new Date(val);
                    val = new Date(val.getUTCFullYear(), val.getUTCMonth(), val.getUTCDate());
                    obj[key] = val;
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
                xmlhttp.setRequestHeader("content-type", contentType);
            }
            try {
                if (parameters) {
                    var JsonWParam = new Object();
                    for (var prop in parameters) {
                        JsonWParam[prop] = parameters[prop];
                    }
                    var json = JsonWParam == null ? "{}" : JSON.stringify(JsonWParam);
                    json = json.replace(/\\\"__type\\\"\:\\\"[\w+\.?]+\\\"\,/g, "");
                    json = json.replace(/\"__type\"\:\"[\w+\.?]+\"\,/g, "");
                    xmlhttp.send(json);
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
//@ sourceMappingURL=Ajax.js.map

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
//@ sourceMappingURL=Formatters.js.map

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
//@ sourceMappingURL=RegularExpression.js.map

/// <reference path="../Modules/Ajax.ts"/>
/// <reference path="../Modules/Is.ts"/>
var Local;
(function (Local) {
    //export var Dictionary: any[] = new any[];
    Local.Dictionary = {};

    //export function KeyPair(key: string, obj: any) {
    //    //this may not work
    //    KeyPair.Key = key;
    //    KeyPair.Object = obj;
    //}
    function CanStore() {
        try {
            return localStorage ? true : false;
        } catch (e) {
            return false;
        }
    }
    Local.CanStore = CanStore;

    function Remove(key) {
        if (Local.CanStore()) {
            localStorage.removeItem(key);

            //Local.Dictionary.Remove(function (d) { return d.Key == key; });
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
        //var found = Local.Dictionary.First(function (obj2) { return obj2.Key == key; });
        var found = Local.Dictionary[key];
        if (found) {
            //found.Object = obj;
            found[key] = obj;
        } else {
            //found = new Local.KeyPair(key, obj);
            //Local.Dictionary.Add(found);
            found = Local.Dictionary[key] = obj;
        }
        if (Local.CanStore()) {
            var json = JSON.stringify(obj);

            //localStorage.setItem(found.Key, json);
            localStorage.setItem(found[key], json);
        }
    }
    Local.Save = Save;

    function Get(key, defaultObject) {
        try {
            var temp = null;

            //var found = Local.Dictionary.First(function (obj) { return obj.Key == key; });
            var found = Local.Dictionary[key];
            if (found) {
                //temp = found.Object;
                temp = found;
            } else if (Local.CanStore()) {
                if (Is.Property(key, localStorage)) {
                    temp = localStorage.getItem(key);
                }
                if (temp != null && temp != "undefined") {
                    temp = JSON.parse(temp);
                    Ajax.ConvertProperties(temp);
                } else if (defaultObject) {
                    temp = defaultObject;
                }
            }
            if (!found && temp) {
                //found = new local.KeyPair(key, temp);
                //local.Dictionary.Add(found);
                Local.Dictionary[key] = temp;
            }
            return temp;
        } catch (e) {
            throw e;
        }
    }
    Local.Get = Get;
})(Local || (Local = {}));
//@ sourceMappingURL=Local.js.map

/// <reference path="../Modules/Ajax.ts"/>
var Session;
(function (Session) {
    Session.Dictionary = {};

    function CanStore() {
        try {
            return sessionStorage ? true : false;
        } catch (e) {
            return false;
        }
    }
    Session.CanStore = CanStore;

    function Remove(key) {
        if (Session.CanStore()) {
            sessionStorage.removeItem(key);

            //Session.Dictionary.Remove(function (d) { return d.Key == key; });
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
        //var found = Session.Dictionary.First(function (obj2) { return obj2.Key == key; });
        var found = Session.Dictionary[key];
        if (found) {
            //found.Object = obj;
            found[key] = obj;
        } else {
            //found = new session.KeyPair(key, obj);
            //session.Dictionary.Add(found);
            found = Session.Dictionary[key] = obj;
        }
        if (Session.CanStore()) {
            var json = JSON.stringify(obj);

            //sessionStorage.setItem(found.Key, json);
            sessionStorage.setItem(found[key], json);
        }
    }
    Session.Save = Save;

    function Get(key, defaultObject) {
        try {
            var temp = null;

            //var found = session.Dictionary.First(function (obj) { return obj.Key == key; });
            var found = Session.Dictionary[key];
            if (found) {
                //temp = found.Object;
                temp = found;
            } else if (Session.CanStore()) {
                if (localStorage.hasOwnProperty(key)) {
                    temp = sessionStorage.getItem(key);
                }
                if (temp != null && temp != "undefined") {
                    temp = JSON.parse(temp);
                    Ajax.ConvertProperties(temp);
                } else if (defaultObject) {
                    temp = defaultObject;
                }
            }
            if (!found && temp) {
                //found = new session.KeyPair(key, temp);
                //session.Dictionary.Add(found);
                Session.Dictionary[key] = temp;
            }
            return temp;
        } catch (e) {
            throw e;
        }
    }
    Session.Get = Get;
})(Session || (Session = {}));
//@ sourceMappingURL=Session.js.map

/// <reference path="../Prototypes/HTMLElement.ts"/>
/// <reference path="../Prototypes/String.ts"/>
/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Prototypes/Window.ts"/>
var Calendar;
(function (Calendar) {
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

    var cal = (function () {
        function cal(element, selectedDateChanged, formatCellMethod, monthChangeEvent, headerClass, rowsClass, dayOfWeekClass, dateRowClass, monthClass, yearClass, navigateClass, defaultDateClass, monthPopupClass, yearPopupClass, calendarBuiltEvent) {
            this.SelectedDate = window.ShortDate();
            this.RequestedDate = new Date();
            this.SelectedDateControl = null;
            this.PreviousDateControl = null;
            this.MonthChanged = false;
            this.CalElement = element;
            this.SelectedDateChanged = selectedDateChanged;
            this.FormatCellMethod = formatCellMethod;
            this.MonthChangeEvent = monthChangeEvent;
            this.HeaderClass = headerClass;
            this.RowsClass = rowsClass;
            this.DayOfWeekClass = dayOfWeekClass;
            this.DateRowClass = dateRowClass;
            this.MonthClass = monthClass;
            this.YearClass = yearClass;
            this.NavigateClass = navigateClass;
            this.DefaultDateClass = defaultDateClass;
            this.MonthPopupClass = monthPopupClass;
            this.YearPopupClass = yearPopupClass;
            this.CalendarBuiltEvent = calendarBuiltEvent;

            this.Build();
            if (selectedDateChanged) {
                this.SelectedDateChanged(this.SelectedDate);
            }
        }
        cal.prototype.Set = function (selectedDate) {
            var rebuild = selectedDate.getMonth() != this.SelectedDate.getMonth() || selectedDate.getFullYear() != this.SelectedDate.getFullYear();
            this.SelectedDate = selectedDate;
            if (rebuild) {
                this.Build();
            } else {
                //the first will check the entire DOM to find the correct div with the correct date.
                //should specific the calendar control
                var selectedDateControl = this.CalElement.First(function (obj) {
                    return obj.tagName.toLowerCase() == "div" && obj.Date && obj.Date.Equals(selectedDate);
                });
                if (selectedDateControl) {
                    this.SelectedDateControl = selectedDateControl;
                }
            }
            if (this.SelectedDateChanged) {
                this.SelectedDateChanged(this.SelectedDate);
            }
        };

        cal.prototype.MonthChangedCallBack = function (allow) {
            if (allow) {
                this.MonthChanged = false;
                this.Set(this.RequestedDate);
            }
        };

        cal.prototype.MonthNameClicked = function (month) {
            if (month != this.SelectedDate.getMonth()) {
                var requestmonth = month;
                var requestyear = this.SelectedDate.getFullYear();
                var testDate = new Date(requestyear, requestmonth, 1);
                this.RequestedDate = new Date(requestyear, requestmonth, this.SelectedDate.getDate());
                while (this.RequestedDate.getMonth() > testDate.getMonth()) {
                    this.RequestedDate = this.RequestedDate.AddDays(-1);
                }
                if (this.MonthChangeEvent) {
                    this.MonthChanged = true;
                    this.MonthChangeEvent(this.RequestedDate, this.MonthChangedCallBack);
                } else {
                    this.Set(this.RequestedDate);
                }
            }
        };

        cal.prototype.YearNameClicked = function (year) {
            if (year != this.SelectedDate.getFullYear()) {
                var requestyear = year;
                var requestmonth = this.SelectedDate.getMonth();
                this.RequestedDate = new Date(requestyear, requestmonth, this.SelectedDate.getDate());
                while (this.RequestedDate.getMonth() > this.SelectedDate.getMonth()) {
                    this.RequestedDate = this.RequestedDate.AddDays(-1);
                }
                if (this.MonthChangeEvent) {
                    this.MonthChanged = true;
                    this.MonthChangeEvent(this.RequestedDate, this.MonthChangedCallBack);
                } else {
                    this.Set(this.RequestedDate);
                }
            }
        };

        cal.prototype.Build = function () {
            this.CalElement.Clear();
            var header = "ul".CreateElement(Calendar.Format.Table);
            if (this.HeaderClass) {
                header.className = this.HeaderClass;
            }
            var left = "a".CreateElement({ innerHTML: "&lt;", href: "javascript:" });
            left.onclick = function () {
                var requestmonth = this.SelectedDate.getMonth();
                var requestyear = this.SelectedDate.getFullYear();
                if (requestmonth == 0) {
                    requestyear--;
                    requestmonth = 11;
                } else {
                    requestmonth--;
                }
                this.RequestedDate = new Date(requestyear, requestmonth, this.SelectedDate.getDate());
                while (this.RequestedDate.getMonth() == this.SelectedDate.getMonth()) {
                    this.RequestedDate = this.RequestedDate.AddDays(-1);
                }
                if (this.MonthChangeEvent) {
                    this.MonthChanged = true;
                    this.MonthChangeEvent(this.RequestedDate, this.MonthChangedCallBack);
                } else {
                    this.Set(this.RequestedDate);
                }
            };
            var right = "a".CreateElement({ innerHTML: "&gt;", href: "javascript:" });
            right.onclick = function () {
                var requestmonth = this.SelectedDate.getMonth();
                var requestyear = this.SelectedDate.getFullYear();
                if (requestmonth == 11) {
                    requestmonth = 0;
                    requestyear++;
                } else {
                    requestmonth++;
                }
                this.RequestedDate = new Date(requestyear, requestmonth, this.SelectedDate.getDate());
                while (this.RequestedDate.getMonth() > this.SelectedDate.getMonth() + 1) {
                    this.RequestedDate = this.RequestedDate.AddDays(-1);
                }
                if (this.MonthChangeEvent) {
                    this.MonthChanged = true;
                    this.MonthChangeEvent(this.RequestedDate, this.MonthChangedCallBack);
                } else {
                    this.Set(this.RequestedDate);
                }
            };
            if (this.NavigateClass) {
                left.className = this.NavigateClass;
                right.className = this.NavigateClass;
            }
            var month = "a".CreateElement({ innerHTML: this.SelectedDate.MonthName(), marginRight: ".25em", href: "javascript:" });
            month.onclick = function () {
                var months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
                var ulMonths = "ul".CreateElement({ id: "workoutMonthpopup", Target: month });
                if (this.MonthPopupClass) {
                    ulMonths.className = this.MonthPopupClass;
                } else {
                    ulMonths.Set(Calendar.Format.Table);
                }
                for (var i = 0; i < months.length; i++) {
                    ulMonths.appendChild(Calendar.MonthItem(months[i], i, this.MonthNameClicked));
                }
            };
            var year = "a".CreateElement({ innerHTML: this.SelectedDate.getFullYear(), marginLeft: ".25em", href: "javascript:" });
            year.onclick = function () {
                //dont move beyond current year
                //this needs to be dynamic
                //if now == current year do one thing else do something else
                var years = new Array();
                var currentyear = (new Date()).getFullYear();
                var selectedYear = this.SelectedDate.getFullYear();
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
                if (this.YearPopupClass) {
                    ulYears.className = this.YearPopupClass;
                } else {
                    ulYears.Set(Calendar.Format.Table);
                }
                for (var i = 0; i < years.length; i++) {
                    ulYears.appendChild(Calendar.YearItem(years[i], this.YearNameClicked));
                }
            };
            if (this.MonthClass) {
                month.className = this.MonthClass;
            }
            if (this.YearClass) {
                year.className = this.YearClass;
            }
            var headerRow = "li".CreateElement(Calendar.Format.Row);

            header.appendChild(headerRow);
            headerRow.AddRange(Calendar.HeaderCell(left), Calendar.HeaderCell([month, year]), Calendar.HeaderCell(right));
            this.CalElement.appendChild(header);
            var daysContainer = "ul".CreateElement(Calendar.Format.Table);
            if (this.RowsClass) {
                daysContainer.className = this.RowsClass;
            }
            this.CalElement.appendChild(daysContainer);
            var pos = 0;
            var daysInMonth = this.SelectedDate.DaysInMonth();
            var startDate = new Date(this.SelectedDate.getFullYear(), this.SelectedDate.getMonth(), 1);
            var week = "li".CreateElement(Calendar.Format.Row);
            daysContainer.appendChild(week);

            if (this.DayOfWeekClass) {
                week.className = this.DayOfWeekClass;
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
                    if (this.DateRowClass) {
                        week.className = this.DateRowClass;
                    }
                    daysContainer.appendChild(week);
                }
                var dow = startDate.getDay();
                if (dow == 6 && ((startDate.getMonth() > this.SelectedDate.getMonth() || startDate.getFullYear() > this.SelectedDate.getFullYear()) || startDate.getDate() == daysInMonth)) {
                    breakCalendar = true;
                }
                if (pos == dow) {
                    week.appendChild(Calendar.DateCell(startDate, this));
                    startDate = startDate.AddDays(1);
                }
                pos++;
                if (pos == 7) {
                    week = "li".CreateElement(Calendar.Format.Row);
                    pos = 0;
                }
            }
            if (this.CalendarBuiltEvent) {
                this.CalendarBuiltEvent();
            }
        };
        return cal;
    })();
    Calendar.cal = cal;

    function Create(element, selectedDateChanged, formatCellMethod, monthChangeEvent, headerClass, rowsClass, dayOfWeekClass, dateRowClass, monthClass, yearClass, navigateClass, defaultDateClass, monthPopupClass, yearPopupClass, calendarBuiltEvent) {
        var myCal = new cal(element, selectedDateChanged, formatCellMethod, monthChangeEvent, headerClass, rowsClass, dayOfWeekClass, dateRowClass, monthClass, yearClass, navigateClass, defaultDateClass, monthPopupClass, yearPopupClass, calendarBuiltEvent);
    }
    Calendar.Create = Create;

    function DateCell(date, calendar) {
        var div = "div".CreateElement(Calendar.Format.Cell);
        if (date != null) {
            div.title = date.format("mmmm dd, yyyy");
            var a = "a".CreateElement({ innerHTML: date.getDate(), href: "javascript:" });
            a.onclick = function () {
                if (calendar.SelectedDate.getMonth() == date.getMonth() || !calendar.MonthChangeEvent) {
                    var previousDate = calendar.SelectedDateControl;
                    calendar.Set(date);
                    if (calendar.SelectedDateControl && calendar.FormatCellMethod) {
                        var format = calendar.FormatCellMethod(date);
                        div.className = format;
                    }
                    if (previousDate && calendar.FormatCellMethod) {
                        var format = calendar.FormatCellMethod(previousDate.Date);
                        previousDate.className = format;
                    }
                    calendar.SelectedDateControl = div;
                } else {
                    calendar.RequestedDate = date;
                    calendar.MonthChanged = true;
                    calendar.MonthChangeEvent(date, calendar.MonthChangedCallBack);
                }
            };
            div.appendChild(a);
            if (date.Equals(calendar.SelectedDate)) {
                calendar.SelectedDateControl = div;
            }
            if (calendar.FormatCellMethod) {
                var format = calendar.FormatCellMethod(date);
                if (format) {
                    div.className = format;
                }
            }
        }
        return div;
    }
    Calendar.DateCell = DateCell;

    function HeaderCell(elementArrayOrString, cellProps) {
        var div = "div".CreateElement(Calendar.Format.Cell);
        div.Set(cellProps);
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

    function MonthItem(monthName, index, onclickEvent) {
        var li = "li".CreateElement({});
        var div = "div".CreateElement({});
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
        var li = "li".CreateElement({});
        var div = "div".CreateElement({});
        li.appendChild(div);
        var a = "a".CreateElement({ innerHTML: year, href: "javascript:" });
        div.appendChild(a);
        a.onclick = function () {
            onclickEvent(year);
        };
        return li;
    }
    Calendar.YearItem = YearItem;
})(Calendar || (Calendar = {}));
//@ sourceMappingURL=Calendar.js.map

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
//@ sourceMappingURL=Convert.js.map

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
//@ sourceMappingURL=Cookie.js.map

/// <reference path="../Modules/Is.ts"/>
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
//@ sourceMappingURL=KeyPress.js.map

/// <reference path="../Modules/Convert.ts"/>
/// <reference path="../Modules/Thing.ts"/>
/// <reference path="../Prototypes/String.ts"/>
/// <reference path="../Prototypes/Window.ts"/>
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
            if (this.DialogType == DialogType.Popup || this.DialogType == DialogType.Quick) {
                this.HideInterval = Dialog.DefaultHideInterval;
            } else {
                this.HideInterval = -1;
            }
        } else {
            this.HideInterval = hideInterval;
        }
        if (position != DialogPosition.Manual) {
            if (position == null && this.Target == null) {
                this.Position = DialogPosition.MiddleOfWindow;
            } else if (position == null && this.Target != null) {
                this.Position = DialogPosition.Below;
            } else {
                this.Position = position;
            }
        } else {
            this.Position = DialogPosition.Manual;
        }
    }
    return DialogProperties;
})();
var Dialog;
(function (Dialog) {
    Dialog.DefaultHideInterval = 1500;
    function Popup(elementToShow, target, position, hideInterval) {
        Show(elementToShow, DialogType.Popup, target, hideInterval, position);
    }
    Dialog.Popup = Popup;
    function Modal(elementToShow, modalClass, position, hideInterval, target) {
        Show(elementToShow, DialogType.Modal, target, hideInterval, position, modalClass);
    }
    Dialog.Modal = Modal;
    function Quick(elementToShow, target, position) {
        Show(elementToShow, DialogType.Quick, target, Dialog.DefaultHideInterval, position);
    }
    Dialog.Quick = Quick;
    function Standard(dialogProperties) {
        var elementToShow = dialogProperties.Container;
        SetPosition(elementToShow, dialogProperties);
        if (dialogProperties.DialogType == DialogType.Modal) {
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
        if (dialogProperties.HideInterval > -1) {
            elementToShow.AddListener(!Is.InternetExplorer() ? "mouseover" : "onmouseover", function () {
                dialogProperties.IsActive = true;
            });
            elementToShow.AddListener(!Is.InternetExplorer() ? "mouseout" : "onmouseout", function () {
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
        var dp = new DialogProperties(elementToShow, dialogType, target, hideInterval, position, modalClass);
        Standard(dp);
    }
    Dialog.Show = Show;
    function SetPosition(elementToShow, dialogProperties) {
        var x = 0;
        var y = 0;
        var dim = elementToShow.Dimensions();
        switch (dialogProperties.Position) {
            case DialogPosition.MiddleOfWindow:
                var winDim = window.Dimensions();
                y = (winDim.Height - dim.height) / 2;
                x = (winDim.Width - dim.width) / 2;
                break;
            case DialogPosition.Below:
                var targetDetails = dialogProperties.Target.DimAndOff();
                y = targetDetails.Top + targetDetails.Height;
                x = targetDetails.Left;
                break;
            case DialogPosition.Above:
                var targetDetails = dialogProperties.Target.DimAndOff();
                y = targetDetails.Top - dim.height;
                x = targetDetails.Left;
                break;
            case DialogPosition.Manual:
            default:
                break;
        }
        if (dialogProperties.Position != DialogPosition.Manual) {
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
            if (dp.HideInterval > -1) {
                clearInterval(dp.Interval);
            }
            if (dp.Modal) {
                dp.Modal.Remove();
            }
            ele.Remove();
        }
    }
    Dialog.Hide = Hide;
})(Dialog || (Dialog = {}));
//@ sourceMappingURL=Dialog.js.map

/// <reference path="../Modules/Ajax.ts"/>
/// <reference path="../Modules/Formatters.ts"/>
/// <reference path="../Modules/KeyPress.ts"/>
/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Modules/RegularExpression.ts"/>
/// <reference path="../Prototypes/Array.ts"/>
/// <reference path="../Prototypes/Date.ts"/>
/// <reference path="../Prototypes/HTMLElement.ts"/>
/// <reference path="../Modules/Thing.ts"/>
/// <reference path="../Prototypes/Select.ts"/>
/// <reference path="../Prototypes/String.ts"/>
/// <reference path="../Prototypes/Window.ts"/>
var Binding;
(function (Binding) {
    Binding.Attributes = {
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
        Formatting: "formatting"
    };
    var Attribute = (function () {
        function Attribute(Name, Value, EasyBindable, IsReturn) {
            this.Name = Name;
            this.Value = Value;
            this.EasyBindable = EasyBindable;
            this.IsReturn = IsReturn;
            this.InlineMatches = new Array();
        }
        Attribute.prototype.ExecuteReturn = function (element) {
            return null;
        };
        return Attribute;
    })();
    Binding.Attribute = Attribute;
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
            if (source && Is.String(source)) {
                source = JSON.parse(source);
            }
            Thing.Merge(source, this);
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

        //modified for the DataBound check
        function BoundElements(source) {
            var boundElements = source.Get(function (obj) {
                return obj.getAttribute("data-binding") || obj["DataBound"];
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
        function BoundParent(element) {
            return element.Parent(function (p) {
                return p.DataObject;
            });
        }
        Get.BoundParent = BoundParent;
        function Wrapper(element) {
            var pn = element.parentNode;
            if (pn.Wrapper) {
                return pn.Wrapper;
            } else if (element.parentNode) {
                return Binding.Get.Wrapper(pn);
            }
            return null;
        }
        Get.Wrapper = Wrapper;
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
                var att = new Binding.Attribute(attributeAndValue.Name, attributeAndValue.Value, false, false);
                var name = att.Name.toLowerCase();
                att.InlineMatches = att.Value.match(RegularExpression.StandardBindingPattern);

                if (Is.Style(att.Name)) {
                    att.EasyBindable = true;
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
                            att.Name = name;
                            att.EasyBindable = false;
                            break;
                        case "class":
                            att.Name = "className";
                            att.EasyBindable = true;
                            break;
                        case "innerhtml":
                            att.EasyBindable = true;
                            att.Name = "innerHTML";
                            break;
                        case "value":
                        case "for":
                        case "id":
                        case "onclick":
                        case "src":
                        case "href":

                        case "style":
                        default:
                            att.Name = name;
                            att.EasyBindable = true;
                            break;
                    }
                }
                att.IsReturn = att.InlineMatches != null || att.Name == Binding.Attributes.OnClick || att.Value.indexOf("return ") == 0;

                if (att.IsReturn) {
                    att.ExecuteReturn = function (element) {
                        return Binding.Get.ReturnValue(att.Value, element, att.InlineMatches);
                    };
                }
                return att;
            }
            return null;
        }
        Get.Attribute = Attribute;
    })(Binding.Get || (Binding.Get = {}));
    var Get = Binding.Get;
    (function (Set) {
        function SetBinding(element, wrapper, attributes) {
            try {
                for (var i = 0; i < attributes.length; i++) {
                    var att = attributes[i];
                    if (att.EasyBindable) {
                        Binding.Set.AttributeValue(element, att);
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
                    return att.ExecuteReturn(element);
                };
            } else if (att.Name == "onmouseover") {
                element.onmouseover = function () {
                    return att.ExecuteReturn(element);
                };
            } else if (att.Name == "onmouseout") {
                element.onmouseout = function () {
                    return att.ExecuteReturn(element);
                };
            } else if (att.Name == Binding.Attributes.OnFocus) {
                element.onfocus = function () {
                    return att.ExecuteReturn(element);
                };
            } else {
                if (att.InlineMatches && !att.IsReturn) {
                    for (var i = 0; i < att.InlineMatches.length; i++) {
                        var extProp = Binding.Get.ExtendedProperty(att.InlineMatches[i]);

                        //get the appropriate object
                        var tempObj = Binding.Get.Object(element, extProp.Extended);
                        if (tempObj != null) {
                            var value = tempObj[extProp.Target];
                            tempValue = tempValue.replace(att.InlineMatches[i], value);
                        }
                    }
                } else if (!att.IsReturn) {
                    var tempObj = Binding.Get.Object(element, att.Value.Trim());
                    var extProp = Binding.Get.ExtendedProperty(att.Value.Trim());
                    tempValue = tempObj[extProp.Target];
                } else {
                    tempValue = att.ExecuteReturn(element);
                }
                if (att.Name == "for") {
                    element.setAttribute("for", tempValue);
                } else if (Is.Property(att.Name, element)) {
                    element[att.Name] = tempValue;
                } else if (Is.Style(att.Name)) {
                    element.style[att.Name] = tempValue;
                } else if (att.Name == "classname" || att.Name == "cls") {
                    element.className = tempValue;
                }
            }
        }
        Set.AttributeValue = AttributeValue;
        function Cascade(element) {
            var parentElement = Binding.Get.BoundParent(element);
            var wrapper = Binding.Get.Wrapper(element);

            //wrapper is on the ul but here the parentElement may be a list item
            //so need to get the first with Wrapper
            Binding.subExecute(parentElement, wrapper, element);
        }
        Set.Cascade = Cascade;
        function OnChange(element, wrapper, attributes) {
            var attribute = attributes.First({ Name: Binding.Attributes.Value });
            if (!wrapper) {
                wrapper = new Binding.Wrapper();
            }
            var tempElement = element;
            if (!tempElement.onchange) {
                tempElement.onchange = function () {
                    var canChange = true;
                    var dataChanged = false;
                    var extProp = Binding.Get.ExtendedProperty(attribute.Value);
                    var tempObj = Binding.Get.Object(element, extProp.Extended);
                    var tp = attributes.First({ Name: Binding.Attributes.TargetProperty });
                    if (tp) {
                        extProp.Target = tp.Value;
                        tempObj = Binding.Get.Object(element, extProp.Target);
                    }

                    if (tempObj) {
                        var prechange = attributes.First({ Name: Binding.Attributes.Prechange });
                        if (prechange) {
                            prechange.ExecuteReturn(element);
                        }
                        if (wrapper.RequestChange) {
                            canChange = wrapper.RequestChange(tempObj, extProp.Target, tempElement.value);
                        }
                        if (canChange) {
                            dataChanged = true;
                            tempObj[extProp.Target] = tempElement.value;
                            if (wrapper.WebApi) {
                                wrapper.WebApi.Update(tempObj, function (result) {
                                    if (result && Is.Property(extProp.Target, result)) {
                                        tempElement.value = result[extProp.Target];
                                        tempObj[extProp.Target] = tempElement.value;
                                        Thing.Merge(result, tempObj);

                                        //do formatting method here
                                        var formatting = attributes.First({ Name: Binding.Attributes.Formatting });
                                        if (formatting) {
                                            var formattedValue = formatting.ExecuteReturn(element);
                                            tempElement.value = formattedValue;
                                        }
                                        if (dataChanged) {
                                            var dcMethod = attributes.First({ Name: Binding.Attributes.OnChange });
                                            if (dcMethod) {
                                                dcMethod.ExecuteReturn(element);
                                            } else {
                                                Binding.Get.DataChanged(wrapper.DataChanged, element, tempObj, extProp.Target);
                                            }
                                        }
                                        Binding.Set.Cascade(element);
                                    }
                                }, function (result) {
                                    if (wrapper.ExceptionEvent) {
                                        wrapper.ExceptionEvent(result, tempObj, extProp.Target);
                                    }
                                });
                            } else {
                                if (dataChanged) {
                                    var dcMethod = attributes.First({ Name: Binding.Attributes.OnChange });
                                    if (dcMethod) {
                                        dcMethod.ExecuteReturn(element);
                                    } else {
                                        Binding.Get.DataChanged(wrapper.DataChanged, element, tempObj, extProp.Target);
                                    }
                                }
                                Binding.Set.Cascade(element);
                            }
                        } else if (Is.Property(extProp.Target, tempObj)) {
                            tempElement.value = tempObj[extProp.Target];
                        }
                    }
                };
            }
        }
        Set.OnChange = OnChange;
        function Checked(element, wrapper, attributes) {
            var attribute = attributes.First({ Name: Binding.Attributes.Checked });
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
                    var dataChanged = false;
                    var tempObj = Binding.Get.Object(element, extProp.Extended);
                    if (input.checked) {
                        checked = true;
                    }
                    var objChecked = tempObj[extProp.Target] ? tempObj[extProp.Target] : false;
                    if (objChecked != checked) {
                        var canChange = true;
                        var prechange = attributes.First({ Name: Binding.Attributes.Prechange });
                        if (prechange) {
                            prechange.ExecuteReturn(element);
                        }
                        if (wrapper.RequestChange) {
                            canChange = wrapper.RequestChange(tempObj, extProp.Target, checked);
                        }
                        if (canChange) {
                            dataChanged = true;
                            tempObj[extProp.Target] = checked;
                            if (wrapper.WebApi) {
                                wrapper.WebApi.Update(tempObj, function (result) {
                                    if (result && Is.Property(extProp.Target, result)) {
                                        input.checked = result[extProp.Target] ? true : false;
                                        tempObj[extProp.Target] = result[extProp.Target];
                                        Thing.Merge(result, tempObj);
                                        if (dataChanged) {
                                            var dcMethod = attributes.First({ Name: Binding.Attributes.OnChange });
                                            if (dcMethod) {
                                                dcMethod.ExecuteReturn(element);
                                            } else {
                                                Binding.Get.DataChanged(wrapper.DataChanged, element, tempObj, extProp.Target);
                                            }
                                        }
                                        Binding.Set.Cascade(element);
                                    }
                                }, function (result) {
                                    if (wrapper.ExceptionEvent) {
                                        wrapper.ExceptionEvent(result, tempObj, extProp.Target);
                                    }
                                });
                            } else {
                                if (dataChanged) {
                                    var dcMethod = attributes.First({ Name: Binding.Attributes.OnChange });
                                    if (dcMethod) {
                                        dcMethod.ExecuteReturn(element);
                                    } else {
                                        Binding.Get.DataChanged(wrapper.DataChanged, element, tempObj, extProp.Target);
                                    }
                                }
                                Binding.Set.Cascade(element);
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
            var attribute = attributes.First({ Name: Binding.Attributes.Radio });
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
                        var dataChanged = false;
                        var canChange = true;
                        var tempObj = Binding.Get.Object(element, extProp.Extended);
                        if (input.checked) {
                            checked = true;
                        }
                        var prechange = attributes.First({ Name: Binding.Attributes.Prechange });
                        if (prechange) {
                            prechange.ExecuteReturn(element);
                        }
                        var objChecked = tempObj[extProp.Target] ? tempObj[extProp.Target] == input.value : false;
                        if (objChecked != checked) {
                            if (wrapper.RequestChange) {
                                canChange = wrapper.RequestChange(tempObj, extProp.Target, input.value);
                            }
                            if (canChange) {
                                dataChanged = true;
                                tempObj[extProp.Target] = input.value;
                                if (wrapper.WebApi) {
                                    wrapper.WebApi.Update(tempObj, function (result) {
                                        if (result && Is.Property(extProp.Target, result)) {
                                            tempObj[extProp.Target] = result[extProp.Target];
                                            if (tempObj[extProp.Target] != input.value) {
                                                input.checked = false;
                                            }
                                            Thing.Merge(result, tempObj);
                                        }
                                    }, function (result) {
                                        if (wrapper.ExceptionEvent) {
                                            wrapper.ExceptionEvent(result, tempObj, extProp.Target);
                                        }
                                    });
                                }
                                if (dataChanged) {
                                    var dcMethod = attributes.First({ Name: Binding.Attributes.OnChange });
                                    if (dcMethod) {
                                        dcMethod.ExecuteReturn(element);
                                    } else {
                                        Binding.Get.DataChanged(wrapper.DataChanged, element, tempObj, extProp.Target);
                                    }
                                }
                                Binding.Set.Cascade(element);
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
            var valueAttr = attributes.First({ Name: Binding.Attributes.Value });
            var extProp = Binding.Get.ExtendedProperty(valueAttr.Value);
            var obj = Binding.Get.Object(element, extProp.Extended);
            var selectedValue;
            if (Is.Property(extProp.Target, obj)) {
                selectedValue = obj[extProp.Target];
            }
            var vm, dm;
            vm = attributes.First({ Name: Binding.Attributes.ValueMember });
            dm = attributes.First({ Name: Binding.Attributes.DisplayMember });
            var select = element;
            element.Clear();
            if (attributes.First({ Name: Binding.Attributes.DataSource })) {
                var dataSource = attributes.First({ Name: Binding.Attributes.DataSource });
                var dataObject = new Function("return " + dataSource.Value + ";");

                select.AddOptions(dataObject(), vm.Value, dm.Value, selectedValue);
            } else if (attributes.First({ Name: Binding.Attributes.ObjectSource })) {
                var objectSource = attributes.First({ Name: Binding.Attributes.ObjectSource });
                var dataObject = new Function("return " + objectSource.Value + ";");
                select.AddOptionsViaObject(dataObject(), selectedValue);
            } else if (attributes.First({ Name: Binding.Attributes.DataSourceMethod })) {
                var dataSourceMethod = attributes.First({ Name: Binding.Attributes.DataSourceMethod });
                var func = new Function("obj", "return " + dataSourceMethod.Value + "(obj);");
                select.AddOptions(func(obj), vm.Value, dm.Value, selectedValue);
            }
        }
        Set.DataSource = DataSource;
    })(Binding.Set || (Binding.Set = {}));
    var Set = Binding.Set;
    function Execute(element, data) {
        element.DataObject = data;
        var wrapper;
        if (element.getAttribute("data-binding")) {
            var json = element.getAttribute("data-binding");
            element.Wrapper = new Binding.Wrapper(json);
            if (Is.String(element.Wrapper.NewRowBeingAdded)) {
                element.Wrapper.NewRowBeingAdded = new Function("obj", "return " + element.Wrapper.NewRowBeingAdded + "(obj);");
            }
            if (Is.String(element.Wrapper.RequestChange)) {
                element.Wrapper.RequestChange = new Function("obj", "target", "value", "return " + element.Wrapper.RequestChange + "(obj, target, value);");
            }
            element.removeAttribute("data-binding");
            wrapper = element.Wrapper;
        } else if (element.Wrapper) {
            wrapper = element.Wrapper;
        } else if (!element.Wrapper) {
            element.Wrapper = wrapper;
        }
        var tagName = element.tagName.toLowerCase();
        if (tagName == "ul" && !wrapper.IsForm) {
            Binding.Grid.Execute(element, data);
        } else {
            Binding.subExecute(element, wrapper);
        }
    }
    Binding.Execute = Execute;
    function subExecute(element, wrapper, ignoreElement) {
        var boundElements = Binding.Get.BoundElements(element);
        for (var i = 0; i < boundElements.length; i++) {
            var ele = boundElements[i];
            if (!ele["DataBound"]) {
                if (wrapper.BindingArray.length == i) {
                    var dataBinding = ele.getAttribute("data-binding").Trim();
                    wrapper.BindingArray.push({ Attributes: Binding.Get.Attributes(dataBinding, ele) });
                }
                ele.removeAttribute("data-binding");
            }
            if (wrapper.BindingArray.length > i) {
                var attributes = wrapper.BindingArray[i].Attributes;
                if (ele != ignoreElement) {
                    //bind it
                    Binding.Set.SetBinding(ele, wrapper, attributes);
                }
            }
            ele.DataBound = true;
        }
        if (wrapper.RowBinding) {
            Binding.Set.SetBinding(element, wrapper, wrapper.RowBinding);
        }
    }
    Binding.subExecute = subExecute;
    (function (Grid) {
        Grid.LineTypes = { Header: "Header", Footer: "Footer", Template: "Template" };
        function Add(unorderedList, data) {
            var arrayOfdata;
            if (Is.Array(data)) {
                arrayOfdata = data;
            } else {
                arrayOfdata = new Array();
                arrayOfdata.Add(data);
            }
            for (var i = 0; i < arrayOfdata.length; i++) {
                Binding.Grid.AddItem(unorderedList, arrayOfdata[i]);
            }
        }
        Grid.Add = Add;
        function AddItem(unorderedList, tempObj) {
            var wrapper = unorderedList.Wrapper;
            var found = unorderedList.First(function (ele) {
                return ele.DataObject && Thing.Concat(ele.DataObject, wrapper.PrimaryKeys) == Thing.Concat(tempObj, wrapper.PrimaryKeys);
            });
            if (found) {
                Binding.subExecute(found, wrapper);
            } else {
                var listitem = this.GetListItem(unorderedList.Template.style, unorderedList.Template.cls, unorderedList.Template.innerHTML, tempObj, wrapper);
                if (unorderedList.HasFooter) {
                    var footer = unorderedList.First({ LineType: Binding.Grid.LineTypes.Footer });
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
                        wrapper.WebApi.Insert(newObject, function (result) {
                            if (listItem["InsertPosition"] && listItem["InsertPosition"] == "top") {
                            } else {
                                unorderedList.DataObject.push(result);
                                Binding.Grid.AddItem(unorderedList, result);
                            }
                        }, function (result) {
                        });
                    };
                }
            }
        }
        Grid.HookInsertTemplate = HookInsertTemplate;
        function Execute(unorderedList, data) {
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
                    } else if (dataBindings.LineType && (dataBindings.LineType == Binding.Grid.LineTypes.Header || dataBindings.LineType == Binding.Grid.LineTypes.Footer)) {
                        lineItems[i]["LineType"] = dataBindings.LineType;
                        lineItems[i]["InsertPosition"] = dataBindings.InsertPosition;
                        Binding.Grid.HookInsertTemplate(lineItems[i], unorderedList);
                    }
                }
                if (foundTemplate) {
                    unorderedList.Template = {
                        style: foundTemplate.style ? foundTemplate.style : null,
                        cls: foundTemplate.className ? foundTemplate.className : null,
                        innerHTML: foundTemplate.innerHTML
                    };
                }
            }
            unorderedList.Clear(function (ele) {
                return !ele["LineType"];
            }, true);
            unorderedList.HasFooter = unorderedList.First(function (obj) {
                return obj.LineType && obj.LineType == Binding.Grid.LineTypes.Footer;
            }) ? true : false;
            Binding.Grid.Add(unorderedList, data);
        }
        Grid.Execute = Execute;
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
        if (Is.String(element.Wrapper.NewRowBeingAdded)) {
            element.Wrapper.NewRowBeingAdded = new Function("obj", "return " + element.Wrapper.NewRowBeingAdded + "(obj);");
        }
        element.removeAttribute("data-loadbinding");
        var wrapper = element.Wrapper;
        if (wrapper && wrapper.WebApi && wrapper.GetParameter) {
            wrapper.GetParameter = wrapper.GetParameter.Trim();
            var parameter;
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
//@ sourceMappingURL=Bind.js.map
