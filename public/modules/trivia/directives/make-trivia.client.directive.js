'use strict';

angular.module('trivia').directive('makeTrivia', [
	function() {
		return {
			template: '<div></div>',
			restrict: 'E',
			link: function postLink(scope, element, attrs) {
				// Make trivia directive logic
				// ...

				element.text('this is the makeTrivia directive');
			}
		};
	}
]);