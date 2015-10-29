/**
 * Command line options:
 *
 *  --output        Relative path to the output directory.  Defaults to 'output/'
 *  --glob            Pattern for matching input files.  Defaults to 'input/*.{gif,jpg,png,svg}'
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
var silent = false;

function log() {
    if (silent) {
        return;
    }
    console.log.apply(console, Array.prototype.slice.call(arguments));
}

/**
 * Optimises images matching the specified glob pattern.
 */
function optimiseImages(options, success) {

    // Extract options
    var error = options.error;
    var glob = options.glob || 'input/*.{gif,jpg,png,svg}';

    // Minify files
    new Imagemin()
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
 * Convert an array of vinyl files to base64.
 *
 * Outputs data in the format:
 * [
 *        { name: 'file1.jpg', data: '...' },
 *        { name: 'file2.jpg', data: '...' }
 * ]
 */
function convertFiles(options, files) {
    var buffer = options.transformer.createBuffer();
    files.forEach(function (file) {
        var transformedItem = options.transformer.transform(file);
        options.transformer.updateBuffer(buffer, transformedItem);
        log('Converted file', path.basename(file.path));
    });
    var file = outputJsonFile(options, buffer);
    !options.success || options.success(file);
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

    return file;
}

//----------------------------------------------------------------------------------------------------------------------
// Transformers
//----------------------------------------------------------------------------------------------------------------------

/**
 * Verbose transformer
 * Transforms data to a verbose format:
 * [
 *      { name: 'file1.png', data: '...base 64 data...' },
 *      { name: 'file2.png', data: '...base 64 data...' },
 *      { name: 'file3.png', data: '...base 64 data...' }
 * }
 */

var verboseTransformer = {
    createBuffer: function() {
        return [];
    },
    updateBuffer: function(buffer, item) {
        buffer.push(item);
    },
    /**
     * Converts the specified vinyl file to a base64 representation
     */
    transform: function(file) {
        var fileMime = mime.lookup(file.path);
        var prefix = 'data:' + fileMime + ';base64,';
        return {
            name: path.basename(file.path),
            data: prefix + file.contents.toString('base64')
        };
    }
};

/**
 * Dictionary transformer
 * Transforms data to a dictionary format:
 * {
 *     'file1.png': '...base 64 data...',
 *     'file2.png': '...base 64 data...',
 *     'file3.png': '...base 64 data...'
 * }
 */

var dictionaryTransformer = Object.create(verboseTransformer);
dictionaryTransformer.createBuffer = function() {
    return {};
};
dictionaryTransformer.updateBuffer = function(buffer, item) {
    buffer[item.name] = item.data;
};

var transformerFactory = function(key) {
    var map = {
        'default': verboseTransformer,
        'verbose': verboseTransformer,
        'dictionary': dictionaryTransformer
    };
    if (!map.hasOwnProperty(key)) {
        throw new Error('Unknown transformer "' + key  + '" specified');
    }
    return map[key];
};

//----------------------------------------------------------------------------------------------------------------------
// Running
//----------------------------------------------------------------------------------------------------------------------

/**
 * Called with options to run this script and convert specified files to base64.
 */
function run(options) {
    silent = options.silent;
    options.transformer = options.transformer ? options.transformer : transformerFactory('default');
    if (typeof options.transformer === 'string') {
        options.transformer = transformerFactory(options.transformer);
    }
    options.error = options.error || function (err) {
        throw err;
    };
    optimiseImages(options, convertFiles);
}

/**
 * Determines if the script is being run directly from the command line
 * and calls the run function with options passed in from argv.
 */
if (require.main === module) {
    var options = {};
    options.transformer = argv.transformer ? transformerFactory(argv.transformer) : null;
    options.output = argv.output ? argv.output : null;
    options.glob = argv.glob ? argv.glob : null;
    run(options);
    return;
}

module.exports = run;