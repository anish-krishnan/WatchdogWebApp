
var lt = 37.777807; //37.317710;
var lon = -122.389624; //-122.028933;

var map;

var lt2 = 37.7771;
var lon2 = -129.38980;

var config = {
    apiKey: "AIzaSyDjmaq2SZIPapnleYQiBRwe18-agzYdcW0",
    authDomain: "distress-b9829.firebaseapp.com",
    databaseURL: "https://distress-b9829.firebaseio.com",
    storageBucket: "distress-b9829.appspot.com",
  };

$(document).ready(function() {
  firebase.initializeApp(config);

  $(".alert").click(function() {
    var d = new Date();
    firebase.database().ref("alerts").push({
      lon: lon,
      lat: lt,
      time: d.getHours() + ":" + d.getMinutes(),
      date: d.getMonth() + "/" + d.getDate() + "/" + d.getFullYear()
    });
    Materialize.toast("Alert was sent", 4000);
  });

  $(".req").click(function() {
    var dest = $("#loc").val();
    $("#loc").val("");
    $(".request").click();

    var t = 0;
    var savRef = firebase.database().ref("savior");
    savRef.once("value").then(function (snapshot){
      var saviors = snapshot.val();
      var short = 100000.00;
      var name;
      snapshot.forEach(function (sav) {
        var longitude = parseFloat(sav.child("long").val());
        var latitude = parseFloat(sav.child("lat").val());
        if(longitude != null && latitude != null) {
          var x = Math.abs(longitude - lon);
          var y = Math.abs(latitude - lt);
          d = Math.sqrt(Math.pow(x, 2) + Math.pow(y, 2));
          if(short > d) {
            short = d;
            name = sav.child("name").val();
          }
        }
      });
      t = Math.ceil(short * 1380);
      Materialize.toast('A savior is headed to your location. will arrive in approximately ' + t + ' minutes.', 4000);
      firebase.database().ref("savior/" + name + "/requested").set(true);
    });

  });
});

function initMap() {
  // Create a map object and specify the DOM element for display.
  var alertPts = [];


  firebase.database().ref("alerts").once("value").then(function(snapshot) {
    snapshot.forEach(function(alert) {
      var lo = alert.child("lon").val();
      var la = alert.child("lat").val();
      alertPts.push(new google.maps.LatLng(la, lo));
    });
  });

  navigator.geolocation.getCurrentPosition(function(position) {
    lt = position.coords.latitude;
    lon = position.coords.longitude;
  });
  map = new google.maps.Map(document.getElementById('map'), {
    center: {lat: lt, lng: lon},
    scrollwheel: false,
    zoom: 15
  });

  var savRef = firebase.database().ref("savior");
  savRef.once("value").then(function (snapshot){
    var saviors = snapshot.val();
    snapshot.forEach(function (sav) {
      var longitude = parseFloat(sav.child("long").val());
      var latitude = parseFloat(sav.child("lat").val());
      if(longitude != null && latitude != null) {
        var myLatLng = {lat: latitude, lng: longitude};
        var myLatLng2 = {lat: latitude - 0.001, lng: longitude - 0.009};
        var marker = new google.maps.Marker({
          map: map,
          position: myLatLng,
          title: sav.child("name").val()
        });
        var marker2 = new google.maps.Marker({
          map: map,
          position: myLatLng2,
          title: sav.child("name").val()
        });
      }
    });
  });

  var heatmap = new google.maps.visualization.HeatmapLayer({
    data: alertPts
  });
  heatmap.setMap(map);
  var styles = [
    {
        "featureType": "water",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#e9e9e9"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "landscape",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 17
            }
        ]
    },
    {
        "featureType": "road.highway",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 29
            },
            {
                "weight": 0.2
            }
        ]
    },
    {
        "featureType": "road.arterial",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 18
            }
        ]
    },
    {
        "featureType": "road.local",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "featureType": "poi",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f5f5f5"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "featureType": "poi.park",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#dedede"
            },
            {
                "lightness": 21
            }
        ]
    },
    {
        "elementType": "labels.text.stroke",
        "stylers": [
            {
                "visibility": "on"
            },
            {
                "color": "#ffffff"
            },
            {
                "lightness": 16
            }
        ]
    },
    {
        "elementType": "labels.text.fill",
        "stylers": [
            {
                "saturation": 36
            },
            {
                "color": "#333333"
            },
            {
                "lightness": 40
            }
        ]
    },
    {
        "elementType": "labels.icon",
        "stylers": [
            {
                "visibility": "off"
            }
        ]
    },
    {
        "featureType": "transit",
        "elementType": "geometry",
        "stylers": [
            {
                "color": "#f2f2f2"
            },
            {
                "lightness": 19
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.fill",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 20
            }
        ]
    },
    {
        "featureType": "administrative",
        "elementType": "geometry.stroke",
        "stylers": [
            {
                "color": "#fefefe"
            },
            {
                "lightness": 17
            },
            {
                "weight": 1.2
            }
        ]
    }
]

map.set('styles', styles);
}
