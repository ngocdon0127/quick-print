var express = require('express');
var router = express.Router();
var multer = require('multer');
var uploadFiles = multer({dest: 'public/uploads'});
var fs = require('fs');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index', { title: 'Express' });
});

router.post('/', uploadFiles.array('attachments'), function (req, res, next) {
	console.log(req.files);
})

router.get('/download', function (req, res, next) {
	var data = fs.readFileSync('public/uploads/a4d795fd5e25e9309389eda7bb7fb0f9');
	// var fileReader = new FileReaderSync();
	res.status(200).json({
		data: data
	})
})

module.exports = router;
