'use strict';

var should = require('should'),
	request = require('supertest'),
	app = require('../../server'),
	mongoose = require('mongoose'),
	User = mongoose.model('User'),
	Trivium = mongoose.model('Trivium'),
	agent = request.agent(app);

/**
 * Globals
 */
var credentials, user, trivium;

/**
 * Trivium routes tests
 */
describe('Trivium CRUD tests', function() {
	beforeEach(function(done) {
		// Create user credentials
		credentials = {
			username: 'username',
			password: 'password'
		};

		// Create a new user
		user = new User({
			firstName: 'Full',
			lastName: 'Name',
			displayName: 'Full Name',
			email: 'test@test.com',
			username: credentials.username,
			password: credentials.password,
			provider: 'local'
		});

		// Save a user to the test db and create new Trivium
		user.save(function() {
			trivium = {
				name: 'Trivium Name'
			};

			done();
		});
	});

	it('should be able to save Trivium instance if logged in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trivium
				agent.post('/trivia')
					.send(trivium)
					.expect(200)
					.end(function(triviumSaveErr, triviumSaveRes) {
						// Handle Trivium save error
						if (triviumSaveErr) done(triviumSaveErr);

						// Get a list of Trivia
						agent.get('/trivia')
							.end(function(triviaGetErr, triviaGetRes) {
								// Handle Trivium save error
								if (triviaGetErr) done(triviaGetErr);

								// Get Trivia list
								var trivia = triviaGetRes.body;

								// Set assertions
								(trivia[0].user._id).should.equal(userId);
								(trivia[0].name).should.match('Trivium Name');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to save Trivium instance if not logged in', function(done) {
		agent.post('/trivia')
			.send(trivium)
			.expect(401)
			.end(function(triviumSaveErr, triviumSaveRes) {
				// Call the assertion callback
				done(triviumSaveErr);
			});
	});

	it('should not be able to save Trivium instance if no name is provided', function(done) {
		// Invalidate name field
		trivium.name = '';

		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trivium
				agent.post('/trivia')
					.send(trivium)
					.expect(400)
					.end(function(triviumSaveErr, triviumSaveRes) {
						// Set message assertion
						(triviumSaveRes.body.message).should.match('Please fill Trivium name');
						
						// Handle Trivium save error
						done(triviumSaveErr);
					});
			});
	});

	it('should be able to update Trivium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trivium
				agent.post('/trivia')
					.send(trivium)
					.expect(200)
					.end(function(triviumSaveErr, triviumSaveRes) {
						// Handle Trivium save error
						if (triviumSaveErr) done(triviumSaveErr);

						// Update Trivium name
						trivium.name = 'WHY YOU GOTTA BE SO MEAN?';

						// Update existing Trivium
						agent.put('/trivia/' + triviumSaveRes.body._id)
							.send(trivium)
							.expect(200)
							.end(function(triviumUpdateErr, triviumUpdateRes) {
								// Handle Trivium update error
								if (triviumUpdateErr) done(triviumUpdateErr);

								// Set assertions
								(triviumUpdateRes.body._id).should.equal(triviumSaveRes.body._id);
								(triviumUpdateRes.body.name).should.match('WHY YOU GOTTA BE SO MEAN?');

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should be able to get a list of Trivia if not signed in', function(done) {
		// Create new Trivium model instance
		var triviumObj = new Trivium(trivium);

		// Save the Trivium
		triviumObj.save(function() {
			// Request Trivia
			request(app).get('/trivia')
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Array.with.lengthOf(1);

					// Call the assertion callback
					done();
				});

		});
	});


	it('should be able to get a single Trivium if not signed in', function(done) {
		// Create new Trivium model instance
		var triviumObj = new Trivium(trivium);

		// Save the Trivium
		triviumObj.save(function() {
			request(app).get('/trivia/' + triviumObj._id)
				.end(function(req, res) {
					// Set assertion
					res.body.should.be.an.Object.with.property('name', trivium.name);

					// Call the assertion callback
					done();
				});
		});
	});

	it('should be able to delete Trivium instance if signed in', function(done) {
		agent.post('/auth/signin')
			.send(credentials)
			.expect(200)
			.end(function(signinErr, signinRes) {
				// Handle signin error
				if (signinErr) done(signinErr);

				// Get the userId
				var userId = user.id;

				// Save a new Trivium
				agent.post('/trivia')
					.send(trivium)
					.expect(200)
					.end(function(triviumSaveErr, triviumSaveRes) {
						// Handle Trivium save error
						if (triviumSaveErr) done(triviumSaveErr);

						// Delete existing Trivium
						agent.delete('/trivia/' + triviumSaveRes.body._id)
							.send(trivium)
							.expect(200)
							.end(function(triviumDeleteErr, triviumDeleteRes) {
								// Handle Trivium error error
								if (triviumDeleteErr) done(triviumDeleteErr);

								// Set assertions
								(triviumDeleteRes.body._id).should.equal(triviumSaveRes.body._id);

								// Call the assertion callback
								done();
							});
					});
			});
	});

	it('should not be able to delete Trivium instance if not signed in', function(done) {
		// Set Trivium user 
		trivium.user = user;

		// Create new Trivium model instance
		var triviumObj = new Trivium(trivium);

		// Save the Trivium
		triviumObj.save(function() {
			// Try deleting Trivium
			request(app).delete('/trivia/' + triviumObj._id)
			.expect(401)
			.end(function(triviumDeleteErr, triviumDeleteRes) {
				// Set message assertion
				(triviumDeleteRes.body.message).should.match('User is not logged in');

				// Handle Trivium error error
				done(triviumDeleteErr);
			});

		});
	});

	afterEach(function(done) {
		User.remove().exec();
		Trivium.remove().exec();
		done();
	});
});