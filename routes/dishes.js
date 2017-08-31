var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Dish = require('../models/dishes');
var verify = require('../utils/verify');

var router = express.Router();

router.use(bodyParser.json());

router.route('/')
	.get(function(req, res, next) {
		Dish.find(req.query)
			.populate('comments.postedBy')
			.exec(function(err, dish) {
				if (err) next(err);
				res.json(dish);
			});
	})

	.post(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.create(req.body, function(err, dish) {
			if (err) next(err);
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
			if (err) next(err);
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted all the dishes');
		});
	});

router.route('/:dishId')
	.get(function(req, res, next) {
		Dish.findById(req.params.dishId)
			.populate('comments.postedBy')
			.exec(function(err, dish) {
				if (err) next(err);
				res.json(dish);
			});
	})

	.put(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.findByIdAndUpdate(req.params.dishId, {
			$set: req.body
		}, {
			new: true
		}, function(err, dish) {
			if (err) next(err);
			res.json(dish);
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.findByIdAndRemove(req.params.dishId, function(err, dish) {
			if (err) next(err);

			var id = dish._id;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted the dish with id: ' + id);
		});
	});

router.route('/:dishId/comments')
	.get(function(req, res, next) {
		Dish.findById(req.params.dishId)
			.populate('comments.postedBy')
			.exec(function(err, dish) {
				if (err) next(err);
				res.json(dish.comments);
			});
	})

	.post(verify.verifyOrdinaryUser, function(req, res, next) {
		Dish.findById(req.params.dishId, function(err, dish) {
			if (err) next(err);
			req.body.postedBy = req.decoded._doc._id;
			dish.comments.push(req.body);
			dish.save(function(err, dish) {
				if (err) next(err);
				console.log('Updated comments of the dish with id: ' + dish._id);
				res.json(dish);
			});
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Dish.findById(req.params.dishId, function(err, dish) {
			if (err) next(err);
			for (var i = (dish.comments.length - 1); i >= 0; i--) {
				dish.comments.id(dish.comments[i]._id).remove();
			}
			dish.save(function(err, dish) {
				if (err) next(err);

				var id = dish._id;
				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('Successfully deleted the dish with id: ' + id);
			});
		});
	});

router.route('/:dishId/comments/:commentId')
	.get(function(req, res, next) {
		Dish.findById(req.params.dishId)
			.populate('comments.postedBy')
			.exec(function(err, dish) {
				if (err) next(err);
				res.json(dish.comments.id(req.params.commentId));
			});
	})

	.put(verify.verifyOrdinaryUser, function(req, res, next) {
		// We delete the existing commment and insert the updated
		// comment as a new comment
		Dish.findById(req.params.dishId, function(err, dish) {
			if (err) next(err);
			if (dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
				var authErr = new Error("You are not authorized to perform this operation!");
				authErr.status = 403;
				return next(authErr);
			}

			dish.comments.id(req.params.commentId).remove();
			req.body.postedBy = req.decoded._doc._id;
			dish.comments.push(req.body);
			dish.save(function(err, dish) {
				if (err) next(err);
				console.log('Updated Comment!');
				res.json(dish);
			});
		});
	})

	.delete(verify.verifyOrdinaryUser, function(req, res, next) {
		Dish.findById(req.params.dishId, function(err, dish) {
			if (dish.comments.id(req.params.commentId).postedBy != req.decoded._doc._id) {
				var authErr = new Error("You are not authorized to perform this operation!");
				authErr.status = 403;
				return next(authErr);
			}
			dish.comments.id(req.params.commentId).remove();
			dish.save(function(err, dish) {
				if (err) next(err);

				res.writeHead(200, {
					'Content-Type': 'text/plain'
				});
				res.end('Successfully deleted the comment with id: ' + req.params.commentId);
			});
		});
	});

module.exports = router;
