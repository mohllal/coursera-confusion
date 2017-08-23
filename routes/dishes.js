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

router.route('/:dishId')
	.get(verify.verifyOrdinaryUser, function(req, res, next) {
		Dish.findById(req.params.dishId)
			.populate('comments.postedBy')
			.exec(function(err, dish) {
				if (err) throw err;
				res.json(dish);
			});
	})

	.put(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.findByIdAndUpdate(req.params.dishId, {
			$set: req.body
		}, {
			new: true
		}, function(err, dish) {
			if (err) throw err;
			res.json(dish);
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.findByIdAndRemove(req.params.dishId, function(err, dish) {
			if (err) throw err;

			var id = dish._id;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted the dish with id: ' + id);
		});
	});

router.route('/:dishId/comments')
	.get(verify.verifyOrdinaryUser, function(req, res, next) {
		Dish.findById(req.params.dishId)
			.populate('comments.postedBy')
			.exec(function(err, dish) {
				if (err) throw err;
				res.json(dish.comments);
			});
	})

	.post(verify.verifyOrdinaryUser, function(req, res, next) {
		Dish.findById(req.params.dishId, function(err, dish) {
			if (err) throw err;
			req.body.postedBy = req.decoded._doc._id;
			dish.comments.push(req.body);
			dish.save(function(err, dish) {
				if (err) throw err;
				console.log('Updated comments of the dish with id: ' + dish._id);
				res.json(dish);
			});
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.findById(req.params.dishId, function(err, dish) {
			if (err) throw err;
			for (var i = (dish.comments.length - 1); i >= 0; i--) {
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save(function(err, dish) {
				if (err) throw err;

				var id = dish._id;
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('Successfully deleted the dish with id: ' + id);
			});
		});
	});

module.exports = router;
