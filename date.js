
module.exports = getDate
getDate = function(){var todate = new Date();
    var today = todate.getDay();
    var options = {
        weekday:"long",
        day:"numeric",
        month:"long"
    }
    var day = todate.toLocaleDateString("en-US", options);
    return day;
}