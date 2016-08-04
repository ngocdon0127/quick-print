var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Print = mongoose.model('Print');
var bcrypt = require('bcrypt-nodejs');
var CryptoJS = require('crypto-js');
var request = require('request');
var path = require('path');

var STR_SEPERATOR = require('../config/consts.js').STR_SEPERATOR;

router.get('/recent', function (req, res, next) {
	Print.findOne().sort('-created_at').exec(function (err, print) {
		if (err){
			console.log(err);
			return res.status(500).json({
				status: 'error'
			})
		}

		request('http://' + req.headers.host + '/api/download/' + print.id, function (err, response, body) {
			if (err){
				console.log(err);
				return res.status(500).json({
					status: 'error'
				})
			}
			if (response.statusCode == 200){
				return res.status(200).json(JSON.parse(body))
			}
			else{
				return res.status(200).json({
					statusCode: response.statusCode
				})
			}
		});
	})
})

router.get('/download/:id', function (req, res, next) {
	Print.findById(req.params.id, function (err, print) {
		if (err){
			return res.status(500).json({
				status: 'error',
				error: 'Invalid id'
			})
		}
		try {
			var data = fs.readFileSync(path.join('public/uploads', print.fileOnServer)).toString().split(STR_SEPERATOR);
		}
		catch (e){
			return res.status(400).json({
				status: 'error',
				error: 'File not found'
			})
		}
		var filenames = print.originalFileNames;
		var files = [];
		for (var i = 0; i < filenames.length; i++) {
			files.push({filename: filenames[i], dataURL: data[i]});
		}
		return res.status(200).json({
			status: 'success',
			files: files
		})
	})
})

// router.get('/all', function (req, res, next) {
// 	Print.find({}, null, {sort: {created_at: -1}}, function (err, prints) {
// 		if (err){
// 			return res.status(400).json({
// 				status: 'error',
// 				error: 'Error while reading database'
// 			})
// 		}
// 		var results = [];
// 		for (var i = 0; i < prints.length; i++) {
// 			var print = prints[i];
// 			var r = JSON.parse(JSON.stringify(print));
// 			delete r.fileOnServer;
// 			delete r.__v;
// 			results.push(r);
// 		}
// 		results.sort(function (a, b) {
// 			return -(new Date(a.created_at)).getTime() + (new Date(b.created_at)).getTime();
// 		})
// 		return res.status(200).json({
// 			status: 'success',
// 			prints: results
// 		})
// 	})
// })

module.exports = router;
