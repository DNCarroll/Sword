/// <reference path="../Modules/Is.ts"/>
interface HTMLSelectElement {
    AddOptions(arrayOrObject, valueProperty?: string, displayProperty?: string, selectedValue?): HTMLSelectElement;
    AddOptionsViaObject(obj, selectedValue?, orderedAsIs?);
}
HTMLSelectElement.prototype.AddOptions= function(arrayOrObject, valueProperty ? : string, displayProperty?: string, selectedValue?): HTMLSelectElement {
    var select = <HTMLSelectElement>this;
    if (Is.Array(arrayOrObject)) {
        var tempArray = <Array<any>>arrayOrObject;
        if (displayProperty && valueProperty) {            
            for (var i = 0; i < tempArray.length; i++) {
                var item = tempArray[i];
                select["options"][select.options.length] = new Option(item[displayProperty], item[valueProperty]);
                if (selectedValue &&
                item[valueProperty] == selectedValue) {
                    select["options"][select.options.length - 1].selected = "true";
                }
            }
        }
        else if (tempArray.length > 1 && Is.String(tempArray[0])) {
            for (var i = 0; i < tempArray.length; i++) {
                var item = tempArray[i];
                select["options"][select.options.length] = new Option(item, item);
                if (selectedValue &&
                    item == selectedValue) {
                    select["options"][select.options.length - 1].selected = "true";
                }
            }
        }
    }
    else if (arrayOrObject) {
        //if its a object prop
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
HTMLSelectElement.prototype.AddOptionsViaObject = function (obj, selectedValue?, orderedAsIs?) {
    var select = <HTMLSelectElement>this;
    if (orderedAsIs) {
        for (var prop in obj) {
            select["options"][select.options.length] = new Option(prop, obj[prop]);
            if (selectedValue && selectedValue == obj[prop]) {
                select["options"][select.options.length - 1].selected = "selected";
            }
        }
    }
    else {
        var tempArray = new Array();
        for (var prop in obj) {
            if (Is.Numeric(obj[prop]))
            {
                tempArray.push(prop);
            }
        }
        tempArray = tempArray.sort();
        for (var i = 0; i < tempArray.length; i++) {
            var prop = tempArray[i]
            select["options"][select.options.length] = new Option(prop, obj[prop]);
            if (selectedValue != undefined && selectedValue == obj[prop]) {
                select["options"][select.options.length - 1].selected = "selected";
            }
        }
    }
};
