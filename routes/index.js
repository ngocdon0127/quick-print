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

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/',  function (req, res, next) {
	var files = JSON.parse(req.body.files);
	var serverFileName = CryptoJS.MD5(bcrypt.genSaltSync(10) + ((new Date()).getTime() + '')).toString();
	var data = '';
	var originalFileNames = [];
	for (var i = 0; i < files.length; i++) {
		var file = files[i];
		data += file.dataURL + STR_SEPERATOR;
		originalFileNames.push(file.filename);
	};
	data.substring(0, data.length - STR_SEPERATOR.length);
	fs.writeFileSync(path.join('public/uploads', serverFileName), data);
	var newPrint = new Print();
	newPrint.title = req.body.title;
	newPrint.originalFileNames = originalFileNames;
	newPrint.fileOnServer = serverFileName;
	newPrint.created_at = new Date();
	newPrint.save(function (err) {
		if (err){
			console.log(err);
			return res.status(500).json({
				status: 'error'
			})
		}
		else{
			return res.status(200).json({
				status: 'success'
			})
		}
	})
})

router.get('/recent', function (req, res, next) {
	res.render('download', {id: 'recent', url: 'http://' + req.headers.host + '/api/recent'});
})

router.get('/download/:id', function (req, res, next) {
	res.render('download', {id: req.params.id, url: 'http://' + req.headers.host + '/api/download/' + req.params.id});
})

router.get('/all', function (req, res, next) {
	Print.find({}, null, {sort: {created_at: -1}}, function (err, prints) {
		if (err){
			return res.status(400).json({
				status: 'error',
				error: 'Error while reading database'
			})
		}
		var results = [];
		for (var i = 0; i < prints.length; i++) {
			var print = prints[i];
			var r = JSON.parse(JSON.stringify(print));
			delete r.fileOnServer;
			delete r.__v;
			results.push(r);
		}
		res.render('all', {prints: results});
	})
})

module.exports = router;
