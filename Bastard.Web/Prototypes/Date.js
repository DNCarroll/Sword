/// <reference path="../Modules/Formatters.ts"/>
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
