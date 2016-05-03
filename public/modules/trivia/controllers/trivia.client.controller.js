'use strict';

// Trivia controller
angular.module('trivia').controller('TriviaController', ['$scope', '$stateParams', '$location', 'Authentication', 'Trivia',
	function($scope, $stateParams, $location, Authentication, Trivia) {
		$scope.authentication = Authentication;

		// Create new Trivium
		$scope.create = function() {
			// Create new Trivium object
			var trivium = new Trivia ({
				name: this.name
			});

			// Redirect after save
			trivium.$save(function(response) {
				$location.path('trivia/' + response._id);

				// Clear form fields
				$scope.name = '';
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Remove existing Trivium
		$scope.remove = function(trivium) {
			if ( trivium ) { 
				trivium.$remove();

				for (var i in $scope.trivia) {
					if ($scope.trivia [i] === trivium) {
						$scope.trivia.splice(i, 1);
					}
				}
			} else {
				$scope.trivium.$remove(function() {
					$location.path('trivia');
				});
			}
		};

		// Update existing Trivium
		$scope.update = function() {
			var trivium = $scope.trivium;

			trivium.$update(function() {
				$location.path('trivia/' + trivium._id);
			}, function(errorResponse) {
				$scope.error = errorResponse.data.message;
			});
		};

		// Find a list of Trivia
		$scope.find = function() {
			$scope.trivia = Trivia.query();
		};

		// Find existing Trivium
		$scope.findOne = function() {
			$scope.trivium = Trivia.get({ 
				triviumId: $stateParams.triviumId
			});
		};
	}
]);