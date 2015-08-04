var fs = require('fs');
var mime = require('mime');
var moment = require('moment');
var Imagemin = require('imagemin');

// Configuration
var INPUT_DIRECTORY = 'input/';
var OUTPUT_DIRECTORY = 'output/';
var OPTIMISED_DIRECTORY = INPUT_DIRECTORY + 'optimised/';

function optimiseImages(cb) {
	var imagemin = new Imagemin()
		.src(INPUT_DIRECTORY + '*.{gif,jpg,png,svg}')
		.dest(OPTIMISED_DIRECTORY)
		.use(Imagemin.jpegtran({progressive: true}));

	imagemin.run(function (err, files) {
		if (err) {
			throw err;
		}
		cb();
	});
}

function convertFiles() {
	var buffer = [];
	var files = fs.readdirSync('./' + INPUT_DIRECTORY);

	files.forEach(function(file) {
		var filePath = './' + OPTIMISED_DIRECTORY + file
		if (!fs.existsSync(filePath)) {
			return;
		}
		if (fs.lstatSync(filePath).isDirectory()) {
			return;
		}
		var img = fs.readFileSync(filePath);
		var fileMime = mime.lookup(filePath);
		var prefix = 'data:' + fileMime + ';base64,';
		buffer.push({
			name: file,
			data: prefix + img.toString('base64')
		});
		console.log('Converted file', filePath);
	});

	var timestamp = moment(Date.now()).format('YYYY-DD-MM-hh-mm-ss');

	fs.writeFileSync('./' + OUTPUT_DIRECTORY + 'data-' + timestamp + '.json', JSON.stringify(buffer, null, 4));
}

optimiseImages(convertFiles);