var express = require('express');
var router = express.Router();
var fs = require('fs');
var mongoose = require('mongoose');
var Print = mongoose.model('Print');
var bcrypt = require('bcrypt-nodejs');
var CryptoJS = require('crypto-js');
var request = require('request');

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
	fs.writeFileSync(__dirname + '/../public/uploads/' + serverFileName, data);
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

module.exports = router;
