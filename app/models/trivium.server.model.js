'use strict';

/**
 * Module dependencies.
 */
var mongoose = require('mongoose'),
	Schema = mongoose.Schema;

/**
 * Trivium Schema
 */
var TriviumSchema = new Schema({
	name: {
		type: String,
		default: '',
		required: 'Please fill Trivium name',
		trim: true
	},
	created: {
		type: Date,
		default: Date.now
	},
	user: {
		type: Schema.ObjectId,
		ref: 'User'
	}
});

mongoose.model('Trivium', TriviumSchema);