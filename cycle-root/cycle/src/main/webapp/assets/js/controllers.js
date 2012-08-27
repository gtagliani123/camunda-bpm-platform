'use strict';


angular.module('cycle.controllers', []);

function DefaultController($scope, $http) {
  
  // TODO: get from cookie
  $scope.currentUser = null;
  
  $http.get('../../../currentUser').success(function(data) {
    $scope.currentUser = data;
  });
  
  $scope.$on("cycle.userChanged", function(event, user) {
    $scope.currentUser = user;
  });
};

function RoundtripDetailsController($scope, $routeParams, Roundtrip) {

  $scope.roundtrip = Roundtrip.get({id: $routeParams.roundtripId });
  
  $scope.edit = function() {
    
  };
};

function CreateNewRoundtripController($scope, $q, $http, $location, Roundtrip) {

  $scope.name = '';
  
  $scope.errorClass = function(form) {
    return form.$valid || !form.$dirty ? '' : 'error';
  };
  
  $scope.$watch('name', function(newValue) {
    isNameValid(newValue).then(function() {
      $scope.newRoundtripForm.name.$setValidity("occupied", true);
    }, function() {
      $scope.newRoundtripForm.name.$setValidity("occupied", false);
    });
  });
  
  $scope.cancel = function() {
    $("#create-roundtrip-dialog").modal('hide'); 
  };
  
  $scope.save = function() {
    if (!$scope.newRoundtripForm.$valid) {
      return;
    }
    
    var roundtrip = new Roundtrip({ name: $scope.name });
    roundtrip.$save(function() {

      $location.path("/roundtrip/" + roundtrip.id);
      $scope.$emit("roundtrip-added", roundtrip);
      $scope.name = '';
    });

    $("#create-roundtrip-dialog").modal('hide');
  };
  
  function isNameValid(name) {
    var deferred = $q.defer();
    
    $http.get("../../resources/roundtrip/isNameValid?name=" + name).success(function(data) {
      if (data == "true") {
        deferred.resolve();
      } else {
        deferred.reject();
      }
    });
    
    return deferred.promise;
  }
};

function ListRoundtripsController($scope, $route, $routeParams, Roundtrip) {
  $scope.roundtrips = Roundtrip.query();
  
  var selectedRoundtripId = -1; // $routeParams.roundtripId;
  
  $scope.$watch(function() { return $routeParams.roundtripId; }, function(newValue, oldValue) {
    selectedRoundtripId = parseInt(newValue);
  });
  
  $scope.createNew = function() {
    $("#create-roundtrip-dialog").modal(); 
  };
  
  $scope.activeClass = function(roundtrip) {
    return (roundtrip.id == selectedRoundtripId ? 'active' : '');
  };
  
  $scope.$on("roundtrip-added", function(event, roundtrip) {
    $scope.roundtrips.push(roundtrip);
  });
};