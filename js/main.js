var data;  // for holding data
var markers;
var brooklyn;


/* =====================
Leaflet Configuration
===================== */

var mapOpts = {
    center: [40.700468, -73.947944],
    zoom: 12
};
var map = L.map('map', mapOpts);

// Another options object
var tileOpts = {
attribution: 'Map tiles by <a href="http://stamen.com">Stamen Design</a>, <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a> &mdash; Map data &copy; <a href="http://www.openstreetmap.org/copyright">OpenStreetMap</a>',
subdomains: 'abcd',
minZoom: 0,
maxZoom: 20,
ext: 'png'
};
var Stamen_TonerLite = L.tileLayer('http://{s}.basemaps.cartocdn.com/light_all/{z}/{x}/{y}.png', tileOpts).addTo(map);
/* ===================== */

var dataset = 'https://data.cityofnewyork.us/api/geospatial/a9we-mtpn?method=export&format=GeoJSON';
// var featureGroup;
// var parsedData;

//var data = $.ajax('https://data.cityofnewyork.us/api/geospatial/a9we-mtpn?method=export&format=GeoJSON')

var slide1 = {
    title: 'NYC-Wide Coverage', 
    text: 'These are all the publicly available WiFi hotspots in New York City. There are 3,319 of them.',
    filterField: null, 
    filterValue: null,
    bbox: [
        [
            40.58684239087908,
            -74.1851806640625
          
        ],
        [
            40.85848657915526,
            -73.79104614257812
        ]
      ]
    };
var slide2 = {
    title: 'Free Hotspots', 
    text: 'Most hotspots are available free of charge. Of the 3,319 total hotspots, 2,736 are free (82%)', 
    filterField: 'type',
    filterValue: 'Free',
    bbox: [
        [
            40.58684239087908,
            -74.1851806640625
          
        ],
        [
            40.85848657915526,
            -73.79104614257812
        ]
      ]
    };
var slide3 = {
    title: 'Manhattan Hotspots', 
    text: 'Manhattan has the most hotspots of any of the 5 boroughs, with 1,672 - more than half of all the hotspots in the entire city. ', 
    filterField: 'boroname',
    filterValue: 'Manhattan',
    bbox: [
        [40.704586878965245, -74.0152359008789],
        [40.82342259737748, -73.93489837646484]
    ]
    };
var slide4 = {
    title: 'Bronx Hotspots', 
    text: "The Bronx, by contrast, has only 316 hotspots. The Bronx is twice the land area of Manhattan and has a population of 1.4 million as compared to Mahattan's 1.6 million.", 
    filterField: 'boroname',
    filterValue: 'Bronx',
    bbox: [
        [
            40.91013965733431,
            -73.90914916992188 
        ],
        [
            40.80211542040426,
            -73.87138366699219
        ]
      ]
    };
var slide5 = {
    title: 'Staten Island Hotspots', 
    text: "Staten Island, New York City's smallest borough by population (476k), has only 100 hotspots ", 
    filterField: 'boroname',
    filterValue: 'Staten Island',
    bbox: [
        [
            40.49839773992187, -74.25006866455078
        ],
        [
            40.647824541622086, -74.07909393310547          
        ]
      ]
    };

var slides = [slide1, slide2, slide3, slide4, slide5]

var currentPage = 0;

var nextPage = function() {
    // move the slide forward
    tearDown()
    var nextPage = currentPage + 1
    currentPage = nextPage
    buildPage(slides[nextPage])
    
}

var prevPage = function() {
    tearDown()
    var prevPage = currentPage - 1
    currentPage = prevPage
    buildPage(slides[prevPage])
    
}

var buildPage = function(pageDefinition) {
    if (pageDefinition.filterField === null) {
        displayData = data
    }
    else {
    displayData = _.filter(data, function(item) { 
        // figuring out this syntax took 10 mins :(
        return item['properties'][pageDefinition['filterField']] === pageDefinition['filterValue']})
    }

    var myIcon = L.icon({
        iconUrl: 'https://png.pngtree.com/png-vector/20190223/ourmid/pngtree-wifi-vector-icon-png-image_696445.jpg',
        //shadowUrl: 'images/marker-shadow.png',
        iconSize: [20,20],
        //shadowSize: [30,15],
        iconAnchor:   [22, 94], // point of the icon which will correspond to marker's location
        //shadowAnchor: [4, 62],  // the same for the shadow
        popupAnchor:  [-3, -76]
      });

    markers = displayData.map(function(hotspot) {
        return L.marker([hotspot.properties.lat, hotspot.properties.lon], {icon: myIcon}).bindPopup('Provider: ' + hotspot.properties.provider + '<br>Address: ' + hotspot.properties.location)
    })
    markers.forEach(function(marker) { marker.addTo(map)})
    
    $('#title').text(pageDefinition.title)
    $('#text').text(pageDefinition.text)
    map.flyToBounds(pageDefinition.bbox)
    if (currentPage === 0) {
        $('#prev').prop('disabled', true)
    } else {
        $('#prev').prop('disabled', false)
    }

    if (currentPage === slides.length - 1) {
        $('#next').prop('disabled', true)
    } else {
        $('#next').prop('disabled', false)
    }
}

var tearDown = function(){
    markers.forEach(function(marker) {map.removeLayer(marker)})
}

$.ajax(dataset).done(function(json) {
    //Don't need to parse bc it's already a JS object
    data = json.features.map(function(datum) {
        datum.properties.lat = Number(datum.properties.lat)
        datum.properties.lon = Number(datum.properties.lon)
        return datum
    })
    // Only do BK for now bc all of NYC was causing browser to crash 
    manhattan = _.filter(data, function(item) { return item.properties.boroname == 'Bronx'})

    console.log(manhattan)

    buildPage(slides[currentPage])
})

$('#next').click(nextPage)
$('#prev').click(prevPage)