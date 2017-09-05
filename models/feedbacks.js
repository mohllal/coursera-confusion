var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var feedbackSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	tel: {
		type: Object,
		required: true
	},
	email: {
		type: String,
		required: true
	},
	agree: {
		type: Boolean,
		required: true,
		default: false
	},
	myChannel: {
		type: String,
		default: ''
	},
	comments: {
		type: String,
		required: true
	}
}, {
	timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Feedbacks = mongoose.model('Feedback', feedbackSchema);

module.exports = Feedbacks;
