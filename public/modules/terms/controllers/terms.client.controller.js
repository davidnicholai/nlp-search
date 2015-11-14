'use strict';

// Terms controller
angular.module('terms').controller('TermsController', ['$scope', '$stateParams', '$location', 'Authentication', '$http',
  function($scope, $stateParams, $location, Authentication, $http) {
    $scope.authentication = Authentication;

    $scope.initializePagination = function() {
      $scope.success = $scope.error = null;
      $scope.selectedPage = 1;
      $scope.maxSize = 10;
      $scope.cannotReset = true;
      $scope.query = '';
      $scope.searchResults = null;

      $http.get('/totalTerms').success(function(response) {
        $scope.success = true;
        $scope.totalItems = response.total;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };

    $scope.getSpecifiedPageContent = function() {
      $scope.success = $scope.error = null;
      $scope.cannotReset = true;

      $http.get('/terms/' + $scope.selectedPage).success(function(response) {
        $scope.success = true;
        $scope.terms = response;
      }).error(function(response) {
        $scope.error = response.message;
      });
    };



    function sortResults(results) {
      var temp;
      for (var i = 0; i < results.length; i++) {
        for (var j = 0; j < results.length; j++) {
          if (results[i].score > results[j].score) {
            temp = results[i];
            results[i] = results[j];
            results[j] = temp;
          }
        }
      }

      console.log(JSON.stringify(results));

      return results;
    }

    $scope.performSearch = function() {
      $scope.success = $scope.error = null;
      $scope.cannotReset = false;
      $scope.searchResults = null;

      var searchQuery = {
        query: $scope.query
      };

      $http.post('/terms', searchQuery).success(function(response) {
        $scope.success = true;
        $scope.searchResults = sortResults(response);
      }).error(function(response) {
        $scope.error = response.message;
      });
    };
  }
]);