//Store the APi endpoint inside queryUrl
var queryUrl ="https://earthquake.usgs.gov/earthquakes/feed/v1.0/summary/4.5_month.geojson"
//Perform a Get request to the query Url
d3.json(queryUrl, function(data) {
  createFeatures(data.features);
});
  //create function to color select the marker color based on magnitude
  function colorMarker(mag) {
    switch(true) {
      case mag > 5 : 
        return "red";
      case mag > 4 :
        return "orange";
      case mag > 3 :
        return "lightsalmon";
      case mag > 2 :
        return "gold";
      case mag > 1 :
        return "lightcyan";
      case mag > 0 :
        return "lavender";
      default:
        return "#000"
    }
};
// create function to assign the marker radius
function radiusMarker(mag) {
  return mag * 20000;
};
//Define a function to run once for each feature in the feature array
function createFeatures(earthquakeData){
    var earthquakes = L.geoJSON(earthquakeData, {
//Give each feature a popup describing the place and time of the quake  
onEachFeature : function (feature, layer) {

    layer.bindPopup("<h3>" + feature.properties.place +
      "</h3><hr><p>" + new Date(feature.properties.time) + "</p>" + "<p> Magnitude: " +  feature.properties.mag + "</p>")
    },     pointToLayer: function (feature, latlng) {
      return new L.circle(latlng,
        { radius: radiusMarker(feature.properties.mag),
            fillColor: colorMarker(feature.properties.mag),
            weight: 0.75,
            fillOpacity: 0.9,
            stroke: false
    })
   }
  });
//Pass earthquake layer to createMap function
  createMap(earthquakes);
}
function createMap(earthquakes) {
//Define satellitemap, streetmap n darkmap layers
var satellitemap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.satellite",
    accessToken: API_KEY
  });
var streetmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.streets",
    accessToken: API_KEY
  });
var lightmap = L.tileLayer("https://api.tiles.mapbox.com/v4/{id}/{z}/{x}/{y}.png?access_token={accessToken}", {
    attribution: "Map data &copy; <a href=\"https://www.openstreetmap.org/\">OpenStreetMap</a> contributors, <a href=\"https://creativecommons.org/licenses/by-sa/2.0/\">CC-BY-SA</a>, Imagery © <a href=\"https://www.mapbox.com/\">Mapbox</a>",
    maxZoom: 18,
    id: "mapbox.light",
    accessToken: API_KEY
  });
//Define a baseMaps object to hold the base layers
  var baseMaps = {
    "Satelite Map": satellitemap,
    "Street Map": streetmap,
    "Light Map": lightmap
  };
 //Create overlay object to hold the overlay layers
 var overlayMaps = {
    "Earthquakes": earthquakes
  };
 //Create map with satellitemap and earthquake n plates layers displayed 
 var map = L.map("map", {
    center: [37.09, -95.71],
    zoom: 5,
    layers: [satellitemap, earthquakes]
});
//Create layer control, pass in the baseMaps n overlayMaps, add the layer to the map
L.control.layers(baseMaps, overlayMaps, {
    collapsed: false
}).addTo(map);
// create legend to display magnitude info on map
var legend = L.control({
    position: "topright"
});
 //loop thru legend
legend.onAdd = function () {
  
    var div = L.DomUtil.create('div', 'info legend'),
        intensity = [0, 1, 2, 3, 4, 5];

    for (var i = 0; i < intensity.length; i++) {
        div.innerHTML +=
            '<i style="background:' + colorMarker(intensity[i] + 1) + '"></i> ' + 
    + intensity[i] + (intensity[i + 1] ? ' - ' + intensity[i + 1] + '<br>' : ' + ');
    }

    return div;
};

legend.addTo(map);

    }