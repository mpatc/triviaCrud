'use strict';

//Setting up route
angular.module('trivia').config(['$stateProvider',
	function($stateProvider) {
		// Trivia state routing
		$stateProvider.
		state('make-trivia', {
			url: '/make-trivia',
			templateUrl: 'modules/trivia/views/make-trivia.client.view.html'
		}).
		state('trivia', {
			url: '/trivia',
			templateUrl: 'modules/trivia/views/maketrivia.client.view.html'
		}).
		state('listTrivia', {
			url: '/trivia',
			templateUrl: 'modules/trivia/views/list-trivia.client.view.html'
		}).
		state('createTrivium', {
			url: '/trivia/create',
			templateUrl: 'modules/trivia/views/create-trivium.client.view.html'
		}).
		state('viewTrivium', {
			url: '/trivia/:triviumId',
			templateUrl: 'modules/trivia/views/view-trivium.client.view.html'
		}).
		state('editTrivium', {
			url: '/trivia/:triviumId/edit',
			templateUrl: 'modules/trivia/views/edit-trivium.client.view.html'
		});
	}
]);