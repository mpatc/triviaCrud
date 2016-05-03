'use strict';

//Trivia service used to communicate Trivia REST endpoints
angular.module('trivia').factory('Trivia', ['$resource',
	function($resource) {
		return $resource('trivia/:triviumId', { triviumId: '@_id'
		}, {
			update: {
				method: 'PUT'
			}
		});
	}
]);