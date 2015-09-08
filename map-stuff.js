var currentStrikeID;
var strikeData;

/* 
    Converts dronestream latitude and longitude to openlayers coordinates. 
*/
var degrees2meters = function(lon, lat) {
    var x = Number(lon) * 20037508.34 / 180;
    var y = Math.log(Math.tan((90 + Number(lat)) * Math.PI / 360)) / (Math.PI / 180);
    y = y * 20037508.34 / 180;
    return [x, y];
};

/*
    Removes the information being shown.
*/
var hideInfo = function() {
    // Remove Info
    document.getElementById("strikeLink").href = "";
    document.getElementById("strikeLink").innerHTML = "";
    document.getElementById("strikeBody").innerHTML = "Click on a Strike to see more info.";
    document.getElementById("strikeTitle").innerHTML = "";
};

/*
    Shows information about a strike.
*/
var showInfo = function(strikeID) {
    // Get Info
    var strike = strikeData[strikeID];
    if (currentStrikeID != strikeID) {
        // Highlight Strike
        // if (vectorLayer) {
        //     if (icons[strikeID].e.a) {
        //         console.log(icons[strikeID].e.a.Qa.src.Se.f);
        //     }
        //     icons[currentStrikeID].setStyle(iconStyle);
        //     icons[strikeID].setStyle(selectionStyle);
        //     vectorLayer.redraw();
        // }
        // if (map) {
        //     map.render();
        // }
        currentStrikeID = strikeID;
        updateLine();
    }
    // Fill Info
    document.getElementById("strikeLink").href = strike.bij_link;
    document.getElementById("strikeLink").innerHTML = "The Bureau of Investigative Journalism Article";
    document.getElementById("strikeBody").innerHTML = strike.bij_summary_short;
    document.getElementById("strikeTitle").innerHTML = (strike.town ? strike.town + ", " : "") + strike.country + "<br>" + strike.date.split("T")[0];
    document.getElementById("line").innerHTML = strike.date.split("T")[0];
};

/*
    Shows the next (chronological) strike.
*/
var showNextStrike = function() {
    if (currentStrikeID < strikeData.length - 1) {
        showInfo(currentStrikeID + 1);
    }
};

/*
    Shows the previous (chronological) strike.
*/
var showPreviousStrike = function() {
    if (currentStrikeID > 0) {
        showInfo(currentStrikeID - 1);
    }
};

/*
    Shows how far (chronologically) the current strike is throughout the USs covert drone strike career.
*/
var updateLine = function() {
    document.getElementById("line").style.width = (100 * currentStrikeID / strikeData.length) + "%";
};

document.getElementById("timeline").onclick = function(e) {
    var id = Math.floor(strikeData.length * e.offsetX / document.getElementById("timeline").offsetWidth);
    showInfo(id);
}

// Style for the icons
var iconStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 1.0],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 0.75,
        src: 'http://i.imgur.com/DXMPEMV.png'
    }))
});

var selectionStyle = new ol.style.Style({
    image: new ol.style.Icon(/** @type {olx.style.IconOptions} */ ({
        anchor: [0.5, 1.0],
        anchorXUnits: 'fraction',
        anchorYUnits: 'fraction',
        opacity: 0.75,
        src: 'http://i.imgur.com/qCR9u9R.png'
    }))
});

$.getJSON('http://whateverorigin.org/get?url=' + encodeURIComponent('http://api.dronestre.am/data') + '&callback=?',
    function (data) {
        strikeData = $.parseJSON(data.contents).strike;
        loadStrikeData();
    });

var icons = [];
var vectorLayer;
var map;

function loadStrikeData() {
    var icon;
    var minDeaths = 0;
    var maxDeaths = 0;
    var civDeaths = 0;

    // All the icons
    for (var i = 0; i < strikeData.length; i++ ) {
        // console.log(strikeData[i].deaths_min, parseInt(strikeData[i].deaths_min), minDeaths);
        minDeaths += (parseInt(strikeData[i].deaths_min) || 0);
        maxDeaths += (parseInt(strikeData[i].deaths_max) || 0);
        civDeaths += (parseInt(strikeData[i].civilians) || 0);
        icon = new ol.Feature({
            geometry: new ol.geom.Point( degrees2meters(strikeData[i].lon, strikeData[i].lat) ),
            strikeID: i,
        });
        icon.setStyle(iconStyle);
        icons.push(icon);
    }

    showInfo(0);

    var vectorSource = new ol.source.Vector({
        features: icons,
        attributions: [
            new ol.Attribution({
                html: 'Drone Strike Data from <a href="dronestre.am">Dronestream</a>'
            })
        ]
    });
    vectorLayer = new ol.layer.Vector({
        source: vectorSource,
    });
    var baseLayer = new ol.layer.Tile({
        source: new ol.source.MapQuest({layer: 'osm'})
    });

    document.getElementById("map").innerHTML = "";

    map = new ol.Map({
        target: 'map',
        layers: [
            baseLayer,
            vectorLayer
        ],
        view: new ol.View({
            center: ol.proj.transform([10, 12], 'EPSG:4326', 'EPSG:3857'),
            zoom: 2
        }),
        controls: ol.control.defaults({ attribution: false })
    });

    map.on('click', function(evt) {
        var feature = map.forEachFeatureAtPixel(evt.pixel,
            function(feature, layer) {
                return feature;
            });
        if (feature) {
            showInfo(feature.get("strikeID"));
        } else {
            hideInfo();
        }
    });

    var earliest = strikeData[0].date.split("T")[0];
    var latest = strikeData[strikeData.length-1].date.split("T")[0];

    document.getElementById("strike-count").innerHTML = strikeData.length;
    document.getElementById("min-deaths").innerHTML = minDeaths;
    document.getElementById("max-deaths").innerHTML = maxDeaths;
    document.getElementById("civ-deaths").innerHTML = civDeaths;
    document.getElementById("firstDate").innerHTML = earliest;
    document.getElementById("lastDate").innerHTML = latest;
}
