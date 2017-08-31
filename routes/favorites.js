var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Favorite = require('../models/favorites');

var verify = require('../utils/verify');

var router = express.Router();

router.use(bodyParser.json());

router.route('/')
	.all(verify.verifyOrdinaryUser)
	.get(function(req, res, next) {
		Favorite.find({
				'postedBy': req.decoded._doc._id
			})
			.populate('postedBy')
			.populate('dishes')
			.exec(function(err, favorites) {
				if (err) next(err);
				res.json(favorites);
			});
	})

	.post(function(req, res, next) {
		Favorite.findOne({
			'postedBy': req.decoded._doc._id
		}, function(err, favorite) {
			if (err) next(err);
			if (!favorite) {
				Favorite.create(req.body, function(err, favorite) {
					if (err) throw err;
					console.log('Favorite created!');
					favorite.postedBy = req.decoded._doc._id;
					favorite.dishes.push(req.body._id);
					favorite.save(function(err, favorite) {
						if (err) next(err);
						res.json(favorite);
					});
				});
			} else {
				var dish = req.body._id;

				if (favorite.dishes.indexOf(dish) == -1) {
					favorite.dishes.push(dish);
				}
				favorite.save(function(err, favorite) {
					if (err) next(err);
					res.json(favorite);
				});
			}
		});
	})

	.delete(function(req, res, next) {
		Favorite.remove({
			'postedBy': req.decoded._doc._id
		}, function(err, favorites) {
			if (err) next(err);
			res.json(favorites);
		});
	});

router.route('/:dishId')
	.delete(verify.verifyOrdinaryUser, function(req, res, next) {
		Favorite.findOneAndUpdate({
			'postedBy': req.decoded._doc._id
		}, {
			$pull: {
				dishes: req.params.dishId
			}
		}, function(err, favorite) {
			if (err) next(err);
			Favorite.findOne({
				'postedBy': req.decoded._doc._id
			}, function(err, favorite) {
				res.json(favorite);
			});
		});
	});

module.exports = router;
