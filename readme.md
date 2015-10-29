[![Build Status](https://travis-ci.org/Degree53/base64-indexer.svg?branch=master)](https://travis-ci.org/Degree53/base64-indexer)

# Base64 Indexer

Converts a specified set of files to base64, outputting a JSON file that contains the result of each file.

Useful, for example, when you want to asynchronously load a set of base64 images in a single request.

# Installation

```
npm install base64-indexer
cd base64-indexer
npm install
npm test
```

# Command Line Usage

    node main.js --glob=input/*.{gif,jpg,png,svg} --output=output/

The above example converts all `.gif`, `.jpg`, `.png` and `.svg` images to `base64` and outputs a `JSON` file containing the results of the conversion to `output/`.

# Node Usage

    var indexer = require('base64-indexer');
    indexer({
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
| --outputTransformer | The transformer to use for the output format (`verbose` or `dictionary`)|
| --nameTransformer | A regex pattern used for name transformation.  The new name will be a concatenation of the capture groups. | 

# Node Options

| Option  | Description |
|---------|-------------|
| output  | Relative path to the output directory.  Defaults to 'output/' |
| glob    | Pattern for matching input files.  Defaults to 'input/*.{gif,jpg,png,svg}' |
| success | Success callback - called after a successful conversion |
| error   | Error callback - called if an error occurs during conversion |
| outputTransformer | The transformer to use for the output format.  String or object.  Available transformers: `verbose` or `dictionary`. |
| nameTransformer | A regex pattern or function used for name transformation.  If a regex pattern is provided the new name will be a concatenation of the capture groups. If a function is provided the output of the function will be used as the new name. | 

# Output Transformers

Output transformers change the way the output file is generated.  The following transformers are available:

## Verbose (Default)

The verbose transformer output data as an array of verbose objects:

```
[
    { name: 'file1.png', data: '...base 64 data...' },
    { name: 'file2.png', data: '...base 64 data...' },
    { name: 'file3.png', data: '...base 64 data...' }
}
```

## Dictionary 

The dictionary transformer outputs data as an dictionary/map:

```
{
    'file1.png': '...base 64 data...',
    'file2.png': '...base 64 data...',
    'file3.png': '...base 64 data...'
}
```