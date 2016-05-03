'use strict';

angular.module('trivia').controller('MaketriviaController', ['$scope',
	function($scope) {
		// Controller Logic
		// ...
		$scope.open = function() {
  $scope.showModal = true;
};

$scope.ok = function() {
  $scope.showModal = false;
};

$scope.cancel = function() {
  $scope.showModal = false;
};
	}
]);
