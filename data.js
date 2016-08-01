var app = angular.module('app', []);
app.controller('ctrl', function($scope) {
  $scope.compile = function() {
    var alerts = firebase.database().ref("alerts");
    alerts.once('value').then(function(snapshot) {
      snapshot.forEach(function(alert) {
        $scope.data.push(alert.val());
      })
    });
  }
});

var config = {
    apiKey: "AIzaSyDjmaq2SZIPapnleYQiBRwe18-agzYdcW0",
    authDomain: "distress-b9829.firebaseapp.com",
    databaseURL: "https://distress-b9829.firebaseio.com",
    storageBucket: "distress-b9829.appspot.com",
  };

$(document).ready(function() {
  firebase.initializeApp(config);
});
