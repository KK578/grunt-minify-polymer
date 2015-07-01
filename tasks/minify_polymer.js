var Minimize = require('minimize');
var chalk = require('chalk');
var util = require('./lib/util.js');

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
                {
                    id: 'css',
                    element: function (node, next) {
                        if (node.type === 'style') {
                            try {
                                if (node.children.length > 0) {
                                    var css = node.children[0].data;
                                    var minCss = util.minifyCss(css);
                                    node.children[0].data = minCss;
                                }
                            }
                            catch (err) {
                                grunt.log.warn('Error while minifying CSS: ' + err);
                            }
                        }

                        next();
                    }
                },
                {
                    id: 'js',
                    element: function (node, next) {
                        if (node.type === 'script') {
                            try {
                                if (node.children.length > 0) {
                                    var js = node.children[0].data;
                                    var minJs = util.minifyJs(js);
                                    node.children[0].data = minJs;
                                }
                            }
                            catch (err) {
                                grunt.log.warn('Error while minifying JS: ' + err);
                            }
                        }

                        next();
                    }
                }
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
            var data = grunt.file.read(src);

            // TODO: Make test with empty html file.
            // Warn on empty files.
            if (data.length === 0) {
                grunt.log.warn('Destination ' + chalk.cyan(file.dest) +
                    ' not written because src files were empty.');
                filesToMinify--;

                return;
            }

            minimize.parse(data, function (err, min) {
                if (err) {
                    grunt.log.warn('Failed to minify ' + chalk.cyan(src) + ': ' + err);
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

        // TODO: With empty html file, test this is run?
        if (filesToMinify === 0) {
            grunt.log.warn('No files created.');
        }
    });
};
