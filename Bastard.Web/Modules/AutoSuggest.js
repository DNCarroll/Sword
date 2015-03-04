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
        }
        else if (e) {
            key = e.which;
            sender = e.srcElement;
            shiftKey = e.shiftKey;
        }
        sender["hidelist"] = false;
        var value = sender.value ? sender.value : "";
        if (key != 8) {
            value += String.fromCharCode(key);
        }
        else {
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
        }
        else {
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
            }
            else if (e) {
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
                        }
                        else {
                            return; // false;
                        }
                        return;
                    }
                    else if (key == 38) {
                        if (list.selectedIndex > 0) {
                            list.options[list.selectedIndex - 1].selected = "selected";
                        }
                        else {
                            list.options[0].selected = "selected";
                        }
                    }
                    else if (key == 40) {
                        if (list.selectedIndex < list.options.length - 1) {
                            list.options[list.selectedIndex + 1].selected = "selected";
                        }
                        else {
                            list.options[0].selected = "selected";
                        }
                    }
                    else if (key == 8) {
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
