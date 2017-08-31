var express = require('express');
var passport = require('passport');
var router = express.Router();

var User = require('../models/users');
var verify = require('../utils/verify');

/* GET users listing. */
router.get('/', verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
	User.find({}, function(err, users) {
		if (err) next(err);
		res.json(users);
	});
});

router.post('/register', function(req, res) {
	User.register(new User({
			username: req.body.username,
			firstName: req.body.firstname,
			lastName: req.body.lastname
		}),
		req.body.password,
		function(err, user) {
			if (err) {
				return res.status(500).json({
					err: err
				});
			}

			if (req.body.age) {
				user.age = req.body.age;
			}
			if (req.body.gender) {
				user.gender = req.body.gender;
			}

			user.save(function(err, user) {
				passport.authenticate('local')(req, res, function() {
					return res.status(200).json({
						status: 'Registration Successful!'
					});
				});
			});
		});
});

router.post('/login', function(req, res, next) {
	passport.authenticate('local', function(err, user, info) {
		if (err) {
			return next(err);
		}
		if (!user) {
			return res.status(401).json({
				err: info
			});
		}
		req.logIn(user, function(err) {
			if (err) {
				return res.status(500).json({
					err: 'Could not log in user'
				});
			}

			var token = verify.getToken(user);
			res.status(200).json({
				status: 'Login successful!',
				success: true,
				token: token
			});
		});
	})(req, res, next);
});

router.get('/logout', function(req, res) {
	req.logout();
	res.status(200).json({
		status: 'Logout successful!'
	});
});

module.exports = router;
