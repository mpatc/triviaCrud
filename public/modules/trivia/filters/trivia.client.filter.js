'use strict';

angular.module('trivia').filter('trivia', [
	function() {
		return function(input) {
			// Trivia directive logic
			// ...

			return 'trivia filter: ' + input;
		};
	}
]);