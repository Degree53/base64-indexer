var must = require('must');
var indexer = require('./../main.js');
var fs = require('fs');
var mime = require('mime');

describe('base64 indexer', function () {

    it('must generate an output file containing valid base64 output', function (done) {
        var testFilePath = 'test/assets/input/degree53.png';

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
            output: 'test/assets/output/',
            success: checkOutput,
            silent: true
        });

    })
});
