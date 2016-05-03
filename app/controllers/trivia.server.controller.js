'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	errorHandler = require('./errors.server.controller'),
	Trivium = mongoose.model('Trivium'),
	_ = require('lodash');

/**
 * Create a Trivium
 */
exports.create = function(req, res) {
	var trivium = new Trivium(req.body);
	trivium.user = req.user;

	trivium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trivium);
		}
	});
};

/**
 * Show the current Trivium
 */
exports.read = function(req, res) {
	res.jsonp(req.trivium);
};

/**
 * Update a Trivium
 */
exports.update = function(req, res) {
	var trivium = req.trivium ;

	trivium = _.extend(trivium , req.body);

	trivium.save(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trivium);
		}
	});
};

/**
 * Delete an Trivium
 */
exports.delete = function(req, res) {
	var trivium = req.trivium ;

	trivium.remove(function(err) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trivium);
		}
	});
};

/**
 * List of Trivia
 */
exports.list = function(req, res) { 
	Trivium.find().sort('-created').populate('user', 'displayName').exec(function(err, trivia) {
		if (err) {
			return res.status(400).send({
				message: errorHandler.getErrorMessage(err)
			});
		} else {
			res.jsonp(trivia);
		}
	});
};

/**
 * Trivium middleware
 */
exports.triviumByID = function(req, res, next, id) { 
	Trivium.findById(id).populate('user', 'displayName').exec(function(err, trivium) {
		if (err) return next(err);
		if (! trivium) return next(new Error('Failed to load Trivium ' + id));
		req.trivium = trivium ;
		next();
	});
};

/**
 * Trivium authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.trivium.user.id !== req.user.id) {
		return res.status(403).send('User is not authorized');
	}
	next();
};
