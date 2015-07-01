'use strict';

var grunt = require('grunt');

/*
  ======== A Handy Little Nodeunit Reference ========
  https://github.com/caolan/nodeunit

  Test methods:
    test.expect(numAssertions)
    test.done()
  Test assertions:
    test.ok(value, [message])
    test.equal(actual, expected, [message])
    test.notEqual(actual, expected, [message])
    test.deepEqual(actual, expected, [message])
    test.notDeepEqual(actual, expected, [message])
    test.strictEqual(actual, expected, [message])
    test.notStrictEqual(actual, expected, [message])
    test.throws(block, [error], [message])
    test.doesNotThrow(block, [error], [message])
    test.ifError(value)
*/

exports.minifyPolymer = {
    setUp: function (done) {
        // setup here if necessary
        done();
    },
    // TODO: Possibly edit to not test script tags are equal.
    html_css_js: function (test) {
        var files = [
            'paper-header-panel.html',
            'paper-material.html'
        ];
        test.expect(files.length);

        for (var i = 0; i < files.length; i++) {
            var actual = grunt.file.read('tmp/' + files[i]);
            var expected = grunt.file.read('test/expected/' + files[i]);
            test.equal(actual, expected, 'should describe ' + files[i] +
                ' minified. Results may be unreliable due to UglifyJS.');
        }

        test.done();
    },
    // TODO: Make more tests to test general CSS.
    html_css: function (test) {
        var files = [
            'color.html',
            'default-theme.html',
            'demo-pages.html',
            'paper-styles.html',
            'shadow.html'
        ];
        test.expect(files.length);

        for (var i = 0; i < files.length; i++) {
            var actual = grunt.file.read('tmp/' + files[i]);
            var expected = grunt.file.read('test/expected/' + files[i]);
            test.equal(actual, expected, 'should describe ' + files[i] + ' minified.');
        }

        test.done();
    }
};
