interface Array<T> {
    GroupBy(...groupBy: string[]): any[];
    Insert(obj, position: number);
    Sum(field: string): number;
    Max(field: string): number;
    Min(field: string): number;
    ToArray(property: string): any[];
    Take(count: number): any[];
    Add(obj: any);
    IndexOf(obj: any): Number;

    First(func?: (obj: T) => boolean): T;
    Last(func: (obj: T) => boolean): T;
    Remove(func: (obj: T) => boolean): T[];
    Where(func: (obj: T) => boolean): T[];
    Add(obj: T[]);
    Add(obj: T);
    Select<U>(keySelector: (element: T) => U): Array<U>;
    Ascend(keySelector: (element: T) => any): T[];
    Descend(keySelector: (element: T) => any): T[];
}
Array.prototype.Select = function (keySelector: (element: any) => any): Array<any> {
    var ret = new Array<any>();
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        var newObj = keySelector(obj);
        ret.push(newObj);
    }
    return ret;
};
Array.prototype.Ascend = function (keySelector: (element: any) => any): Array<any> {
    return this.sort((a, b) => {
        return keySelector(a) < keySelector(b) ? -1 :
            keySelector(a) > keySelector(b) ? 1 : 0;
    });
};
Array.prototype.Descend = function (keySelector: (element: any) => any): Array<any> {
    return this.sort((a, b) => {
        return keySelector(a) < keySelector(b) ? 1 :
            keySelector(a) > keySelector(b) ? -1 : 0;
    });
};
Array.prototype.First = function (func?: (obj) => boolean) {
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
    }
    else if(this.length>0){
        return this[0];
    }
    return null;
};
Array.prototype.Last = function (func?: (obj) => boolean): any {
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
    }
    else {
        if (this.length > 0) {
            return this[this.length - 1];
        }
    }
    return null;
};
Array.prototype.Remove = function (func: (obj) => boolean): Array<any> {
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
Array.prototype.Where = function (func: (obj) => boolean):Array<any> {
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
Array.prototype.Min = function (field: string): number {
    var ret = null;
    for (var i = 0; i < this.length; i++) {
        var obj = this[i];
        if (obj[field]) {
            if (ret == null) {
                ret = obj[field]
            }
            else if (ret > obj[field]) {
                ret = obj[field];
            }
        }
    }
    return ret;
}
Array.prototype.Max = function (field: string): number {
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
}
Array.prototype.Take = function (count: number): Array<any> {
    var ret = new Array();
    for (var i = 0; i < count; i++) {
        if (this.length > i) {
            ret.push(this[i]);
        }
        else {
            break;
        }
    }
    return ret;
}
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
Array.prototype.GroupBy = function (...groupBy: string[]) {
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
        }
        else {
            found["Grouping"].push(that);
        }
    }
    return ret;
}
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
    }
    else {
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
Array.prototype.Insert = function (obj, position: number) {
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
Array.prototype.Sum = function (field: string): number {
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
Array.prototype.ToArray = function (property: string) {
    var ret = new Array();
    for (var i = 0; i < this.length; i++) {
        var item = this[i];
        if (item[property]) {
            ret.push(item[property]);
        }
    }
    return ret;
};