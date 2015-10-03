var Minimize = require('minimize');
var chalk = require('chalk');
var util = require('./lib/util.js');

module.exports = function (grunt) {
    grunt.registerMultiTask('minifyPolymer',
        'Minify Polymer HTML with inline CSS and JS',
        function () {
        var done = this.async();
        var options = this.options({
            empty: true,
            spare: true,
            quotes: true,
            jsCompress: {
                warnings: false
            },
            jsMangle: true,
            plugins: [
                {
                    id: 'css',
                    element: function (node, next) {
                        // On <style> tags, run util.minifyCss on their inner data.
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
                        // On <script> tags, run util.minifyJs on their inner data.
                        if (node.type === 'script') {
                            try {
                                if (node.children.length > 0) {
                                    var js = node.children[0].data;
                                    var minJs = util.minifyJs(js, options);
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

            // Warn on empty files.
            if (data.length === 0) {
                grunt.log.warn('Destination ' + chalk.cyan(file.dest) +
                    ' not written because src files were empty.');
                filesToMinify--;

                return;
            }

            // Minimize will minify HTML, with the plugins above handling
            //  inline <style> and <script> tags.
            minimize.parse(data, function (err, min) {
                // Handle files failing to be minified.
                if (err) {
                    grunt.log.warn('Failed to minify ' + chalk.cyan(src) + ': ' + err);
                    filesToMinify--;

                    return;
                }

                grunt.file.write(file.dest, min);

                // Increment file count.
                // As the task is asynchronous, need to check if this is the last file
                //  to process; if true, then log and complete grunt task.
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

        // In the event of all files being non-existant or empty,
        // foreach loop will have reduced filesToMinify to 0.
        if (filesToMinify === 0) {
            grunt.log.warn('No files created.');
            done();
        }
    });
};
