var Minimize = require('minimize');
var chalk = require('chalk');
var util = require('./lib/util.js');

// Plugin to minimise CSS inline.
function minifyCss(node, next) {
    if (node.type === 'style') {
        // Breaking out Regex because Polymer is too fancy for clean-css or something simple...
        var css = node.children[0].data;
        var minCss = util.minifyCss(css);
        node.children[0].data = minCss;
    }

    next();
}

// Plugin to minimise JS inline.
// All credits to https://github.com/mishoo/UglifyJS2 for this function.
function uglifyJs(node, next) {
    if (node.type === 'script') {
        var js = node.children[0].data;
        var minJs = util.minifyJs(js);
        node.children[0].data = minJs;
    }

    next();
}

// TODO: Add a 'minifyPolymerCss' task
module.exports = function (grunt) {
    grunt.registerMultiTask('minifyPolymer',
        'Minify Polymer HTML with inline CSS and JS',
        function () {
        var done = this.async();
        var options = this.options({
            empty: true,
            spare: true,
            quotes: true,
            plugins: [
                { id: 'css', element: minifyCss },
                { id: 'js', element: uglifyJs }
            ]
        });
        var filesToMinify = this.files.length;
        var createdFiles = 0;

        this.files.forEach(function (file) {
            var minimize = new Minimize(options);
            var src = file.src.filter(function (filepath) {
                // Filter non-existing files.
                if (!grunt.file.exists(filepath)) {
                    grunt.log.warn('Source file ' + filepath + ' not found.');
                    filesToMinify--;

                    return false;
                }
                else {
                    return true;
                }
            });

            // Warn on empty files.
            if (src.length === 0) {
                grunt.log.warn('Destination ' + chalk.cyan(file.dest) +
                    ' not written because src files were empty.');
                filesToMinify--;

                return;
            }

            var data = grunt.file.read(src);
            minimize.parse(data, function (err, min) {
                if (err) {
                    grunt.log.warn(err);
                    filesToMinify--;

                    return;
                }

                grunt.file.write(file.dest, min);

                if (++createdFiles === filesToMinify) {
                    if (createdFiles > 0) {
                        grunt.log.ok(createdFiles + ' ' +
                            grunt.util.pluralize(createdFiles, 'file/files') + ' created.');
                    }
                    else {
                        grunt.log.warn('No files created.');
                    }

                    done();
                }
            });
        });
    });
};
