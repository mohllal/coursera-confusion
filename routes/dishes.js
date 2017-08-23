var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dish = require('../models/dishes');
var verify = require('../utils/verify');

var router = express.Router();

router.use(bodyParser.json());

router.route('/')
	.get(verify.verifyOrdinaryUser, function(req, res, next) {
		Dish.find({})
			.populate('comments.postedBy')
			.exec(function(err, dish) {
				if (err) throw err;
				res.json(dish);
			});
	})

	.post(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.create(req.body, function(err, dish) {
			if (err) throw err;
			console.log('Dish created!');

			var id = dish._id;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully added the dish with id: ' + id);
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.remove({}, function(err, resp) {
			if (err) throw err;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted all the dishes');
		});
	});

module.exports = router;
