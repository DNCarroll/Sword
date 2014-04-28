/// <reference path="../Modules/Is.ts"/>
/// <reference path="../Modules/Convert.ts"/>
/// <reference path="../Modules/Bind.ts"/>
/// <reference path="../Modules/Dialog.ts"/>

interface HTMLElement extends Element {    
    Get(func: (ele: HTMLElement) => boolean, notRecursive?: boolean, nodes?: Array<HTMLElement>): HTMLElement[]
    Remove();    
    First(func: (ele: HTMLElement) => boolean): HTMLElement;
    SetClass(className: string);
    Parent(predicate: (x: any) => boolean): HTMLElement;
    OffSet(): { top: number; left: number; };
    Dimensions(): { width: number; height: number; };
    DimAndOff(): { Height: number; Width: number; Top: number; Left: number; };
    Delete(predicate: (x: any) => boolean);
    AddRange(...elements: HTMLElement[]): HTMLElement;
    Clear(predicate?: (x: any) => boolean, notRecursive?: boolean);
    AddListener(eventName, method);
    Set(objectProperties): HTMLElement;
    Bind(data?, appendData?: boolean);
    DataObject: any;
    Wrapper: Binding.Wrapper;
    SelectedElement: HTMLElement;
    BindingAttributes: Array<Binding.Attribute>;
    SetSelected(obj);
}
HTMLElement.prototype.SetSelected = function (obj) {
    if (this.tagName == "UL" && this.DataObject) {
        var selectedListItem = this.First(function (ele) {
            return ele.tagName == "LI" && ele.DataObject == obj;
        });
        if (selectedListItem) {
            Binding.Grid.SetSelected(<HTMLUListElement>this, obj, selectedListItem);
        }
    }
}
HTMLElement.prototype.Bind = function (data?, appendData?: boolean) {
    if (data)
    {
        Bind(this, data, appendData);
    }
    else {
        Binding.Load(this);
    }
}
HTMLElement.prototype.Set = function (objectProperties) {
    var that = <HTMLElement>this;
    if (objectProperties) {
        for (var prop in objectProperties) {
            var tempPropName = prop;

            if (tempPropName != "cls" && tempPropName != "className") {
                var isStyleProp = Is.Style(tempPropName);
                if (isStyleProp) {
                    that.style[tempPropName] = objectProperties[prop];
                }
                else if (prop == "style") {
                    if (objectProperties.style.cssText) {
                        that.style.cssText = objectProperties.style.cssText;
                    }
                }
                else {
                    that[tempPropName] = objectProperties[prop];
                }
            }
            else {
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
    }
    else {
        this.attachEvent(eventName, method);
    }
};
///clears all matching descendants from the predicate 
///predicate returns bool accepts one arg (element)
HTMLElement.prototype.Clear = function (predicate?: (x: any) => boolean, notRecursive?: boolean) {
    var that = <HTMLElement>this;
    var children = that.childNodes;
    if (!predicate) {
        while (children.length > 0)
        {
            that.removeChild(children[0]);
        }
    }
    else {
        var pos = children.length - 1;
        while (pos > 0)
        {
            if (children[pos].nodeType == 1) {
                var child = <HTMLElement>children[pos];
                if (predicate(child)) {
                    that.removeChild(child);
                }
                else if (!notRecursive && child.Clear) {
                    child.Clear(predicate, notRecursive);
                }
            }
            else
            {
                that.removeChild(children[pos]);
            }
            pos--;
        }
    }
};
///predicate is bool return function that operates with a Parameter of element
///assumes First element found is only one to delete
HTMLElement.prototype.Delete = function (predicate: (x: any) => boolean) {
    var that = <HTMLElement>this;
    var found = that.First(predicate);
    if (found) {
        found.Remove();
    }
};
///add range of elements to Element
HTMLElement.prototype.AddRange = function (...elements: HTMLElement[]): HTMLElement {
    var that = <HTMLElement>this;
    for (var i = 0; i < elements.length; i++) {
        var child = elements[i];
        that.appendChild(child);
    }
    return that;
};
HTMLElement.prototype.DimAndOff = function (): { Height: number; Width: number; Top: number; Left: number; } {
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
HTMLElement.prototype.Dimensions = function (): { width: number; height: number; } {    
    var ret = { width: 0, height: 0 };
    ret.width = this.offsetWidth;
    ret.height = this.offsetHeight;
    return ret;
};
///return { top: number; left: number; } for Element
HTMLElement.prototype.OffSet = function (): { top: number; left: number; } {
    var _x = 0;
    var _y = 0;
    var el = <HTMLElement>this;
    while (el && !isNaN(el.offsetLeft) && !isNaN(el.offsetTop)) {
        _x += el.offsetLeft - el.scrollLeft;
        _y += el.offsetTop - el.scrollTop;
        //may not work
        el = <HTMLElement>el.offsetParent;
    }
    return { top: _y, left: _x };
};
///returns first parent ancestor that produces true from the predicate function
//predicate returns bool and takes one arg
HTMLElement.prototype.Parent = function (predicate: (x: any) => boolean): HTMLElement {
    if (predicate(this.parentNode)) {
        return this.parentNode;
    }
    else {
        return this.parentNode.Parent(predicate);
    }
    return null;
};
///clears and sets class on Element
HTMLElement.prototype.SetClass = function (className: string) {
    this.className = null;
    this.className = className;
};
///functionOrObject - function or object used to find matching child elements of the Element
///notRecursive - default false, if true will only go one child deep otherwise dives all descendants,  
///dont supply nodes, its used for recursive additions on descendants
HTMLElement.prototype.Get = function (func: (ele: HTMLElement) => boolean, notRecursive?: boolean, nodes?:Array<HTMLElement>): HTMLElement[] {
    if (nodes == null) {
        nodes = new Array<HTMLElement>();
    }
    var that = <HTMLElement>this;
    for (var i = 0; i < that.childNodes.length; i++) {
        if (this.childNodes[i].nodeType == 1) {
            var child = <HTMLElement>this.childNodes[i]
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
HTMLElement.prototype.First = function (func: (ele: HTMLElement) => boolean): HTMLElement {
    var that = <HTMLElement>this;
    var children = that.childNodes;
    for (var i = 0; i < children.length; i++) {        
        if (children[i].nodeType == 1) {
            var child = <HTMLElement>children[i];            
            if (func(child)) {
                return child;
            }
        }
    }
    var found = null;
    for (var i = 0; i < children.length; i++) {
        if (children[i].nodeType == 1) {
            var c = <HTMLElement>children[i];
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