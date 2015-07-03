var fs = require('fs');
var path = require('path');

exports.testDirectory = function (test, dir, callback) {
    fs.readdir(path.join('test/fixtures/', dir), function (err, files) {
        test.expect(files.length);

        for (var i = 0; i < files.length; i++) {
            var actual = fs.readFileSync(path.join('tmp/', dir, files[i]),
                { encoding: 'utf-8' });
            var expected = fs.readFileSync(path.join('test/expected/', dir, files[i]),
                { encoding: 'utf-8' });
            test.equal(actual, expected, 'should describe ' + files[i] + ' minified.');
        }

        callback();
    });
};
