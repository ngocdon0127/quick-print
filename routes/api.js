var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Print = mongoose.model('Print');
var bcrypt = require('bcrypt-nodejs');
var CryptoJS = require('crypto-js');
var request = require('request');

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
				status: 'error'
			})
		}
		var data = fs.readFileSync(__dirname + '/../public/uploads/' + print.fileOnServer).toString().split(STR_SEPERATOR);
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

module.exports = router;
