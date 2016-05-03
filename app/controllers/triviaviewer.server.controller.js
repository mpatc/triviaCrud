'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
Article = mongoose.model('Article'),
    _ = require('lodash');

/**
 * Create a Triviaviewer
 */
exports.create = function(req, res) {

};

/**
 * Show the current Triviaviewer
 */
exports.read = function(req, res) {

};

/**
 * Update a Triviaviewer
 */
exports.update = function(req, res) {

};

/**
 * Delete an Triviaviewer
 */
exports.delete = function(req, res) {

};

/**
 * List of Triviaviewers
 */
exports.list = function(req, res) {
  exports.list = function(req, res) {
  	Article.find().sort('-created').populate('user', 'displayName').exec(function(err, articles) {
  		if (err) {
  			return res.status(400).send({
  				message: errorHandler.getErrorMessage(err)
  			});
  		} else {
  			res.json(articles);
  		}
  	});
  };
};
exports.articleByID = function(req, res, next, id) {
	Article.findById(id).populate('user', 'displayName').exec(function(err, article) {
		if (err) return next(err);
		if (!article) return next(new Error('Failed to load article ' + id));
		req.article = article;
		next();
	});
};

/**
 * Article authorization middleware
 */
exports.hasAuthorization = function(req, res, next) {
	if (req.article.user.id !== req.user.id) {
		return res.status(403).send({
			message: 'User is not authorized'
		});
	}
	next();
};
