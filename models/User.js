var mongoose = require('mongoose');
// User Schema:
var userSchema = mongoose.Schema({
	username: {
		type: String,
		index: true,
		unique: true
	},
	password: {
		type: String
	},
	email: {
		type: String,
		unique: true
	},
	name: {
		type: String
	}
});

let User = mongoose.model('User', userSchema);
module.exports = User;
