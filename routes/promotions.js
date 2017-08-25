var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Promotion = require('../models/promotions');

var router = express.Router();
var verify = require('../utils/verify');

router.use(bodyParser.json());

router.route('/')
	.get(verify.verifyOrdinaryUser, function(req, res, next) {
		Promotion.find({}, function(err, promotion) {
			if (err) throw err;
			res.json(promotion);
		});
	})

	.post(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Promotion.create(req.body, function(err, promotion) {
			if (err) throw err;
			console.log('Promotion created!');
			var id = promotion._id;

			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Added the promotion with id: ' + id);
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Promotion.remove({}, function(err, promotions) {
			if (err) throw err;

			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted all the promotions');
		});
	});

router.route('/:promoId')
	.get(verify.verifyOrdinaryUser, function(req, res, next) {
		Promotion.findById(req.params.promoId, function(err, promotion) {
			if (err) throw err;
			res.json(promotion);
		});
	})

	.put(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Promotion.findByIdAndUpdate(req.params.promoId, {
			$set: req.body
		}, {
			new: true
		}, function(err, promotion) {
			if (err) throw err;
			res.json(promotion);
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Promotion.findByIdAndRemove(req.params.promoId, function(err, promotion) {
			if (err) throw err;

			var id = promotion._id;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted the promotion with id: ' + id);
		});
	});

module.exports = router;
