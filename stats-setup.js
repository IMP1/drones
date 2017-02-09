
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

        var dataset = [];

        Object.keys(country_deaths).forEach(function(key, value) {
            dataset.push( {label: key, count: country_deaths[key].min } )
        });

        var color  = d3.scaleOrdinal(d3.schemeCategory20b);
        var width  = 360;
        var height = 360;
        var radius = Math.min(width, height) / 2;

        var svg = d3.select('#country-pie-chart')
            .append('svg')
            .attr('width', width)
            .attr('height', height)
            .append('g')
            .attr('transform', 'translate(' + (width / 2) + ',' + (height / 2) + ')');

        var arc = d3.arc()
            .innerRadius(0)
            .outerRadius(radius);

        var pie = d3.pie()
            .value(function(d) { return d.count; })
            .sort(null);

        var path = svg.selectAll('path')
            .data(pie(dataset))
            .enter()
            .append('path')
            .attr('d', arc)
            .attr('fill', function(d) {
                return color(d.data.label);
            });

    }
});