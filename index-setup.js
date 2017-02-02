
$.ajax({
    type: "GET",
    url: "http://api.dronestre.am/data",
    dataType: "jsonp",
    success: function(data) {

        var firstDate          = null;
        var lastDate           = null;
        var minimumDeathCount  = 0;
        var maximumDeathCount  = 0;
        var civilianDeathCount = 0;

        $.each(data.strike, function(i, item) {
            var itemDate = new Date(item.date);
            if (firstDate == null || itemDate < firstDate) {
                firstDate = itemDate;
            }
            if (lastDate == null || itemDate > lastDate) {
                lastDate = itemDate;
            }
            minimumDeathCount  += Number(item.deaths_min);
            maximumDeathCount  += Number(item.deaths_max);
            civilianDeathCount += Number(item.civilians);
        });

        $('#strike-count').innerHTML = strikeData.length;

        $('#min-deaths').innerHTML = minimumDeathCount;
        $('#max-deaths').innerHTML = maximumDeathCount;
        $('#civ-deaths').innerHTML = civilianDeathCount;
        $('#minor-stats').show();
    }
});
