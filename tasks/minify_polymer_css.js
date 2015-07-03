var chalk = require('chalk');
var util = require('./lib/util.js');

module.exports = function (grunt) {
    grunt.registerMultiTask('minifyPolymerCSS', 'Minify Polymer CSS', function () {
        var filesToMinify = this.files.length;
        var createdFiles = 0;

        this.files.forEach(function (file) {
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

            // Minify data and write to output.
            var min = util.minifyCss(data);
            grunt.file.write(file.dest, min);
            createdFiles++;
        });

        // Exit task
        if (createdFiles > 0) {
            grunt.log.ok(createdFiles + ' ' +
                grunt.util.pluralize(createdFiles, 'file/files') + ' created.');
        }
        else {
            grunt.log.warn('No files created.');
        }
    });
};
