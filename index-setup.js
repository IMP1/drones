Date.prototype.isLeapYear = function() {
    var year = this.getFullYear();
    if((year & 3) != 0) return false;
    return ((year % 100) != 0 || (year % 400) == 0);
};

// Get Day of Year
Date.prototype.getDOY = function() {
    var dayCount = [0, 31, 59, 90, 120, 151, 181, 212, 243, 273, 304, 334];
    var mn = this.getMonth();
    var dn = this.getDate();
    var dayOfYear = dayCount[mn] + dn;
    if(mn > 1 && this.isLeapYear()) dayOfYear++;
    return dayOfYear;
};

$.ajax({
    type: "GET",
    url: "http://api.dronestre.am/data",
    dataType: "jsonp",
    success: function(data) {

        var firstDate          = null;
        var lastDate           = null;
        var orderedStrikes     = null;
        var minimumDeathCount  = 0;
        var maximumDeathCount  = 0;
        var civilianDeathCount = 0;
        var years = {};

        $.each(data.strike, function(i, item) {
            var itemDate = new Date(item.date);

            // Add to the year it happened in.
            var year = itemDate.getFullYear();
            if (!(year in years)) {
                years[year] = $('<svg id="year-' + year + '"class="year"></svg>');
            }
            $(years[year]).append('<circle cx="' + (100 * itemDate.getDOY() / (itemDate.isLeapYear() ? 366 : 365)) + '%" cy="50%" r="100"/>');

            // Update first and last dates.
            if (firstDate == null || itemDate < firstDate) {
                firstDate = itemDate;
            }
            if (lastDate == null || itemDate > lastDate) {
                lastDate = itemDate;
            }

            // Aggregate total deaths.
            minimumDeathCount  += Number(item.deaths_min);
            maximumDeathCount  += Number(item.deaths_max);
            civilianDeathCount += Number(item.civilians);
        });

        for (var i = firstDate.getFullYear(); i <= lastDate.getFullYear(); i ++) {
            $('#timeline').append(years[i]);
        }

        $('#timeline').show();

        $('#strike-count').innerHTML = strikeData.length;

        $('#min-deaths').innerHTML = minimumDeathCount;
        $('#max-deaths').innerHTML = maximumDeathCount;
        $('#civ-deaths').innerHTML = civilianDeathCount;
        $('#minor-stats').show();
    }
});
