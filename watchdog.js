var lt = 37.777807; //37.317710;
var lon = -122.389624;//-122.028933;

var config = {
    apiKey: "AIzaSyDjmaq2SZIPapnleYQiBRwe18-agzYdcW0",
    authDomain: "distress-b9829.firebaseapp.com",
    databaseURL: "https://distress-b9829.firebaseio.com",
    storageBucket: "distress-b9829.appspot.com",
  };

$(document).ready(function() {
  firebase.initializeApp(config);

  $(".submit").click(function() {
    var name = $("#first_name").val() + " " + $("#last_name").val();
    navigator.geolocation.getCurrentPosition(function(position) {
      lt = position.coords.latitude;
      lon = position.coords.longitude;
    });
    firebase.database().ref('savior/' + name).set({
      lat: lt,
      long: lon,
      name: name,
      requested: false
    });
    $("#first_name").val('');
    $("#last_name").val('');
    $("#code").val('');
    $(".input-field").hide();
    $(".btn").hide();
    $(".text").hide();
    $(".ty").show();
  });
});
