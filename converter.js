/**
 * Command line options: 
 *
 *  --output 		Relative path to the output directory.  Defaults to 'output/'
 *  --glob 			Pattern for matching input files.  Defaults to 'input/*.{gif,jpg,png,svg}'
 *
 * Examples:
 *
 * node converter.js --output=dest
 * 
 * The above example converts all .gif, .jpg, .png and .svg files from the ./input/
 * directory and produces an output JSON file in the ./dest/ directory.
 * 
 * node converter.js --glob=src/*.{.gif,.jpg} --output=dest
 * 
 * The above example converts all .gif and .jpg files from the ./src/
 * directory and produces an output JSON file in the ./dest/ directory.
 */

var fs = require('fs');
var mime = require('mime');
var moment = require('moment');
var Imagemin = require('imagemin');
var path = require('path');
var argv = require('yargs').argv;

/**
 * Optimises images matching the specified glob pattern.
 */
function optimiseImages(options, success) {

	// Extract options
	var error = options.error;
	var glob = options.glob || 'input/*.{gif,jpg,png,svg}'

	// Minify files
	var imagemin = new Imagemin()
		.src(glob)
		.use(Imagemin.jpegtran({progressive: true}))
		.run(function (err, files) {
			if (err) {
				if (error) {
					error(err);
					return;
				}
				throw err;
			}
			success(options, files);
		});
}

/**
 * Converts the specified vinyl file to a base64 representation
 */
function convertToBase64(file) {
	var fileMime = mime.lookup(file.path);
	var prefix = 'data:' + fileMime + ';base64,';
	return {
		name: path.basename(file.path),
		data: prefix + file.contents.toString('base64')
	};
}

/**
 * Convert an array of vinyl files to base64.
 * 
 * Outputs data in the format:
 * [
 * 		{ name: 'file1.jpg', data: '...' },
 * 		{ name: 'file2.jpg', data: '...' }
 * ]
 */
function convertFiles(options, files) {
	var buffer = [];
	files.forEach(function(file) {
		buffer.push(convertToBase64(file));
		console.log('Converted file', path.basename(file.path));
	});
	outputJsonFile(options, buffer);
}

/**
 * Outputs the specified base64 files to a JSON file.
 */
function outputJsonFile(options, convertedFiles) {

	var outputDirectory = options.output ? options.output + '/' : 'output/';

	// Generate a timestamp for the filename
	var timestamp = moment(Date.now()).format('YYYY-DD-MM-hh-mm-ss');
	
	// Generate full output path
	var file = './' + outputDirectory + 'data-' + timestamp + '.json';
	
	// Convert files to JSON string
	var contents = JSON.stringify(convertedFiles, null, 4);
	
	// Write the JSON string to the output file
	fs.writeFileSync(file, contents);
}

/**
 * Called with options to run this script and convert specified files to base64.
 */
function run(options) {
    options.error = options.error || function(err) {
		throw err;
	}
	optimiseImages(options, convertFiles);
}

/**
 * Determines if the script is being run directly from the command line
 * and calls the run function with options passed in from argv.
 */
if (require.main === module) {
	var options = {};
	options.output = argv.output ? argv.output : null;
	options.glob = argv.glob ? argv.glob : null;
	run(options);
	return;
}

module.exports = run;