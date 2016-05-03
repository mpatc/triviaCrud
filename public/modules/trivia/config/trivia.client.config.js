'use strict';

// Configuring the Articles module
angular.module('trivia').run(['Menus',
	function(Menus) {
		// Set top bar menu items
		Menus.addMenuItem('topbar', 'Trivia', 'trivia', 'dropdown', '/trivia(/create)?');
		Menus.addSubMenuItem('topbar', 'trivia', 'List Trivia', 'trivia');
		Menus.addSubMenuItem('topbar', 'trivia', 'New Trivium', 'trivia/create');
	}
]);