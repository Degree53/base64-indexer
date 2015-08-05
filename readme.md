# Image to Base64 JSON file

Converts a specified set of images to base64, outputting a JSON file that contains the result of each image.

Useful when you want to asynchronously load a set of base64 images in a single request.

# Command line Usage

    node main.js --glob=input/*.{gif,jpg,png,svg} --output=output/

The above example converts all `.gif`, `.jpg`, `.png` and `.svg` images to `base64` and outputs a `JSON` file containing the results of the conversion to `output/`.

# Node Usage

    var imageToBase64 = require('base64-image-bulk');
    imageToBase64({
	    glob: 'input/*.{gif,jpg,png,svg}',
	    output: 'output/',
	    success: function() {
	        console.log('Conversion finished');
	    },
	    error: function(err) {
	        console.log('Conversion error:', err.message);
	    }
    });

The above example converts all `.gif`, `.jpg`, `.png` and `.svg` images to `base64` and outputs a `JSON` file containing the results of the conversion to `output/`.

When the process successfully completes the `success` callback is called and "Conversion finished" is logged to the console.

If the process fails for any reason the `error` callback will be called instead and the exception message will be logged to the console.

# Command Line Options

| Option   | Description |
|----------|-------------|
| --output | Relative path to the output directory.  Defaults to 'output/' |
| --glob   | Pattern for matching input files.  Defaults to 'input/*.{gif,jpg,png,svg}' |

# Node options

| Option  | Description |
|---------|-------------|
| output  | Relative path to the output directory.  Defaults to 'output/' |
| glob    | Pattern for matching input files.  Defaults to 'input/*.{gif,jpg,png,svg}' |
| success | Success callback - called after a successful conversion |
| error   | Error callback - called if an error occurs during conversion