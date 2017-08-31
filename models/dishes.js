var mongoose = require('mongoose');
var Schema = mongoose.Schema;

require('mongoose-currency').loadType(mongoose);
var Currency = mongoose.Types.Currency;

// create comment schema
var commentSchema = new Schema({
	rating: {
		type: Number,
		min: 1,
		max: 5,
		required: true
	},
	comment: {
		type: String,
		required: true
	},
	postedBy: {
		type: mongoose.Schema.Types.ObjectId,
		ref: 'User'
	}
}, {
	timestamps: true
});

// create dish schema
var dishSchema = new Schema({
	name: {
		type: String,
		required: true,
		unique: true
	},
	image: {
		type: String,
		required: true,
		unique: true
	},
	category: {
		type: String,
		required: true,
		enum: ['Main', 'Appetizer', 'Dessert']
	},
	label: {
		type: String,
		required: false,
		default: ''
	},
	price: {
		type: Currency,
		required: true,
		min: 1,
		max: 50000
	},
	description: {
		type: String,
		required: true
	},
	featured: {
		type: Boolean,
		default: false
	},
	comments: [commentSchema]
}, {
	timestamps: true
});

// the schema is useless so far
// we need to create a model using it
var Dishes = mongoose.model('Dish', dishSchema);

// make this available to our Node applications
module.exports = Dishes;
