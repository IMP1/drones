
var DISTANCE = 10;
var map;
var features;
var strikeLayer;
var strikeData;

$.ajax({
    type: "GET",
    url: "http://api.dronestre.am/data",
    dataType: "jsonp",
    success: function(data) {

        var firstDate = null;
        var lastDate  = null;
        strikeData = data.strike;

        features = [];
        $.each(strikeData, function(i, item) {
            var lonLat = [Number(item.lon), Number(item.lat)]
            var coordinates = ol.proj.fromLonLat(lonLat);

            var validPosition = (Number(item.lon) != 0 || Number(item.lat) != 0);

            if (validPosition) {
                var feature = new ol.Feature({
                    geometry: new ol.geom.Point(coordinates)
                });
                features.push(feature);
            }

            var itemDate = new Date(item.date);
            if (firstDate == null || itemDate < firstDate) {
                firstDate = itemDate;
            }
            if (lastDate == null || itemDate > lastDate) {
                lastDate = itemDate;
            }
        });

        document.getElementById("strike-count").innerHTML = strikeData.length;
        document.title = document.title + " (" + strikeData.length + ")";

        strikeLayer = new ol.source.Vector({
            features: features
        });

        var clusterSource = new ol.source.Cluster({
            distance: DISTANCE,
            source: strikeLayer
        });

        var styleCache = {};
        var clusters = new ol.layer.Vector({
            source: clusterSource,
            style: function(feature) {
                var size = feature.get('features').length;
                var style = styleCache[size];
                if (!style) {
                    style = new ol.style.Style({
                        image: new ol.style.Circle({
                            radius: 10,
                            stroke: new ol.style.Stroke({
                                color: '#fff'
                            }),
                            fill: new ol.style.Fill({
                                color: '#3399CC'
                            })
                        }),
                        text: new ol.style.Text({
                            text: size.toString(),
                            fill: new ol.style.Fill({
                                color: '#fff'
                            })
                        })
                    });
                    styleCache[size] = style;
                }
                return style;
            }
        });

        var raster = new ol.layer.Tile({
            source: new ol.source.OSM()
        });

        $('#map-loading-spinner').remove();

        map = new ol.Map({
            layers: [raster, clusters],
            target: 'map',
            view: new ol.View({
                center: [0, 0],
                zoom: 3
            })
        });
    }
});

/*

function filterStrikes() {
    var dateFrom = $('#filterDateFrom').value;
    var dateTo   = $('#filterDateTo').value;
    var features = strikeLayer.features;
    for (var i = 0; i < features.length; i++) {
        features[i].renderIntent = "delete"; 
        if(features[i].attributes.name === search_name) {
            features[i].renderIntent = "default" 
        }
    }
    strikeLayer.redraw();
}

$( function() {
    $("#timeline").slider({
        range: true,
        min: 0,
        max: Math.round(Math.abs(one - another) / 8.64e7),
        values: [ 75, 300 ],
        slide: function( event, ui ) {

            $( "#amount" ).val( "$" + ui.values[ 0 ] + " - $" + ui.values[ 1 ] );
        }
    });
} );

*/