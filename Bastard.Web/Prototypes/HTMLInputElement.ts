interface HTMLInputElement {    
    AutoSuggest(dataSource: Array<any>,
        valueMember: string,
        displayMembers: Array<string>,
        displayJoiner: string,
        displayCount?: number);
} 
HTMLInputElement.prototype.AutoSuggest = function (dataSource: Array<any>,
    valueMember: string,
    displayMembers: Array<string>,
    displayJoiner: string,
    displayCount?: number) {
        AutoSuggest.Hook(this, dataSource, valueMember, displayMembers, displayJoiner, displayCount);
}