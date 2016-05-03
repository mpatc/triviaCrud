'use strict';

module.exports = function(app) {
	var users = require('../../app/controllers/users.server.controller');
	var trivia = require('../../app/controllers/trivia.server.controller');

	// Trivia Routes
	app.route('/trivia')
		.get(trivia.list)
		.post(users.requiresLogin, trivia.create);

	app.route('/trivia/:triviumId')
		.get(trivia.read)
		.put(users.requiresLogin, trivia.hasAuthorization, trivia.update)
		.delete(users.requiresLogin, trivia.hasAuthorization, trivia.delete);

	// Finish by binding the Trivium middleware
	app.param('triviumId', trivia.triviumByID);
};
