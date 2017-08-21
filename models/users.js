var mongoose = require('mongoose');
var Schema = mongoose.Schema;
var passportLocalMongoose = require('passport-local-mongoose');

var userSchema = new Schema({
	firstName: {
		type: String,
		required: true
	},
	lastName: {
		type: String,
		required: true
	},
	age: {
		type: Number,
		min: 10,
		max: 90
	},
	gender: {
		type: String,
		enum: ['Male', 'Female']
	},
	admin: {
		type: Boolean,
		default: false
	}
});

userSchema.methods.getName = function() {
	return (this.firstName + ' ' + this.lastName);
};

userSchema.plugin(passportLocalMongoose);

var Users = mongoose.model('User', userSchema);
module.exports = Users;
