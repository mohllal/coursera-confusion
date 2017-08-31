var express = require('express');
var bodyParser = require('body-parser');
var mongoose = require('mongoose');

var Leader = require('../models/leader');

var router = express.Router();
var verify = require('../utils/verify');

router.use(bodyParser.json());

router.route('/')
	.get(function(req, res, next) {
		Leader.find(req.query, function(err, leader) {
			if (err) next(err);
			res.json(leader);
		});
	})

	.post(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Leader.create(req.body, function(err, leader) {
			if (err) next(err);
			console.log('Leader created!');
			var id = leader._id;

			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Added the leader with id: ' + id);
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Leader.remove({}, function(err, leaders) {
			if (err) next(err);
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted all the leaders');
		});
	});

router.route('/:leaderId')
	.get(function(req, res, next) {
		Leader.findById(req.params.leaderId, function(err, leader) {
			if (err) next(err);
			res.json(leader);
		});
	})

	.put(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Leader.findByIdAndUpdate(req.params.leaderId, {
			$set: req.body
		}, {
			new: true
		}, function(err, leader) {
			if (err) next(err);
			res.json(leader);
		});
	})

	.delete(verify.verifyOrdinaryUser, verify.verifyAdmin, function(req, res, next) {
		Leader.findByIdAndRemove(req.params.leaderId, function(err, leader) {
			if (err) next(err);

			var id = leader._id;
			res.writeHead(200, {
				'Content-Type': 'text/plain'
			});
			res.end('Successfully deleted the leader with id: ' + id);
		});
	});

module.exports = router;
