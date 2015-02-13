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
