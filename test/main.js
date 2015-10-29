//noinspection JSUnusedGlobalSymbols
var must = require('must');
var indexer = require('./../main.js');
var fs = require('fs');
var mime = require('mime');

describe('base64 indexer', function () {

    it('must generate an output file containing valid base64 output', function (done) {
        var testFilePath = 'test/assets/input/degree53.png';
        var outputFilePath = 'test/assets/output/';

        // Called after indexer has generated the output file
        var checkOutput = function (outputFilePath) {
            // Read the input file manually
            var testFileContents = fs.readFileSync(testFilePath);

            // Determine the expected output
            var testFileMime = mime.lookup(testFilePath);
            var prefix = 'data:' + testFileMime + ';base64,';
            var expectedBase64 = prefix + testFileContents.toString('base64');

            // Read the actual output
            var outputFileContents = fs.readFileSync(outputFilePath);
            var outputArray = JSON.parse(outputFileContents);

            // Delete the output file now we're finished
            fs.unlink(outputFilePath);

            // Make sure the output matches our expectations
            outputArray.pop().data.must.equal(expectedBase64);

            done();

        };

        // Start indexing the specified files
        indexer({
            glob: testFilePath,
            output: outputFilePath,
            success: checkOutput,
            silent: true
        });

    });

    describe('name transformer', function () {

        it('must transform a name by regex string', function (done) {
            var testFilePath = 'test/assets/input/degree53.png';
            var outputFilePath = 'test/assets/output/';
            var expectedFileName = 'degree53';

            // Called after indexer has generated the output file
            var checkOutput = function (outputFilePath) {
                var outputFileContents = fs.readFileSync(outputFilePath);
                var output = JSON.parse(outputFileContents);

                // Delete the output file now we're finished
                fs.unlink(outputFilePath);

                // Make sure the output matches our expectations
                output.must.be.object();
                output.must.have.property(expectedFileName);

                done();

            };

            // Start indexing the specified files
            indexer({
                glob: testFilePath,
                output: outputFilePath,
                success: checkOutput,
                outputTransformer: 'dictionary',
                nameTransformer: '(.*?)\\.[^.]+',
                silent: true
            });

        });

        it('must transform a name by lambda function', function (done) {
            var testFilePath = 'test/assets/input/degree53.png';
            var outputFilePath = 'test/assets/output/';
            var expectedFileName = 'hello world';

            // Called after indexer has generated the output file
            var checkOutput = function (outputFilePath) {
                var outputFileContents = fs.readFileSync(outputFilePath);
                var output = JSON.parse(outputFileContents);

                // Delete the output file now we're finished
                fs.unlink(outputFilePath);

                // Make sure the output matches our expectations
                output.must.be.object();
                output.must.have.property(expectedFileName);

                done();

            };

            // Start indexing the specified files
            indexer({
                glob: testFilePath,
                output: outputFilePath,
                success: checkOutput,
                outputTransformer: 'dictionary',
                nameTransformer: function() {
                    return expectedFileName;
                },
                silent: true
            });

        });

    });

    describe('output transformers', function () {

        it('must generate a verbose output for the verbose transformer', function (done) {
            var testFileName = 'degree53.png';
            var testFilePath = 'test/assets/input/' + testFileName;
            var outputFilePath = 'test/assets/output/';

            // Called after indexer has generated the output file
            var checkOutput = function (outputFilePath) {
                var outputFileContents = fs.readFileSync(outputFilePath);
                var output = JSON.parse(outputFileContents);

                // Delete the output file now we're finished
                fs.unlink(outputFilePath);

                // Make sure the output matches our expectations
                output.must.be.array();
                output.must.have.length(1);
                output[0].must.have.property('name', testFileName);
                output[0].must.have.property('data');

                done();

            };

            // Start indexing the specified files
            indexer({
                glob: testFilePath,
                output: outputFilePath,
                success: checkOutput,
                outputTransformer: 'verbose',
                silent: true
            });

        });

        it('must generate a dictionary output for the dictionary transformer', function (done) {
            var testFileName = 'degree53.png';
            var testFilePath = 'test/assets/input/' + testFileName;
            var outputFilePath = 'test/assets/output/';

            // Called after indexer has generated the output file
            var checkOutput = function (outputFilePath) {
                var outputFileContents = fs.readFileSync(outputFilePath);
                var output = JSON.parse(outputFileContents);

                // Delete the output file now we're finished
                fs.unlink(outputFilePath);

                // Make sure the output matches our expectations
                output.must.be.object();
                output.must.have.property(testFileName);

                done();

            };

            // Start indexing the specified files
            indexer({
                glob: testFilePath,
                output: outputFilePath,
                success: checkOutput,
                outputTransformer: 'dictionary',
                name: function(input) {
                    return input;
                },
                silent: true
            });

        });

    });

});