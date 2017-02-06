
var PIE_RADIUS = 64;


$.ajax({
    type: "GET",
    url: "http://api.dronestre.am/data",
    dataType: "jsonp",
    success: function(data) {

        var country_deaths = {};

        $.each(data.strike, function(i, item) {
            var country = item.country;
            if (!(country in country_deaths)) {
                country_deaths[country] = {min: 0, max: 0, civ: 0};
            }
            var min = Number(item.deaths_min);
            var max = Number(item.deaths_max);
            var civ = Number(item.deaths_civ);
            country_deaths[country].min += isNaN(min) ? 0 : min;
            country_deaths[country].max += isNaN(max) ? 0 : max;
            country_deaths[country].civ += isNaN(civ) ? 0 : civ;
        });

        console.log(country_deaths);

    }
});