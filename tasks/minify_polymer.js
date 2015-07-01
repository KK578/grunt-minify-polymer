var Minimize = require('minimize');
var chalk = require('chalk');

// TODO: Move function to a util.js to allow reuse for a minifyPolymerCss task
// Plugin to minimise CSS inline.
function minifyCss(node, next) {
    if (node.type === 'style') {
        // Breaking out Regex because Polymer is too fancy for clean-css or something simple...
        var css = node.children[0].data;

        // Remove /* ... */ Comments
        var minCss = css.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*\/+/gm, '');
        // Remove whitespace at start and end of each line.
        minCss = minCss.replace(/\s*(\r\n|\n)\s*/gm, '');
        // Remove spaces before and after any of the following characters:
        //  :,>{}()
        // Use loads of silly regex as lookahead/lookbehind isn't supported. :/
        minCss = minCss.replace(/\s*\:\s*/gm, ':');
        // Resolve ::content selectors requiring a space.
        minCss = minCss.replace(/::/gm, ' ::');
        minCss = minCss.replace(/\s*\,\s*/gm, ',');
        minCss = minCss.replace(/\s*\>\s*/gm, '>');
        minCss = minCss.replace(/\s*\{\s*/gm, '{');
        minCss = minCss.replace(/\s*\}\s*/gm, '}');
        // minCss = minCss.replace(/\s*\(\s*/gm, '(');
        // minCss = minCss.replace(/\s*\)\s*/gm, ')');
        // Replace any remaining occurances of multiple spaces with a single space.
        minCss = minCss.replace(/  +/gm, ' ');

        node.children[0].data = minCss;
    }

    next();
}

// TODO: Move function to a util.js
// Plugin to minimise JS inline.
// All credits to https://github.com/mishoo/UglifyJS2 for this function.
function uglifyJs(node, next) {
    if (node.type === 'script') {
        var js = node.children[0].data;
        var uglify = require('uglify-js');

        var topLevelAst = uglify.parse(js);
        topLevelAst.figure_out_scope();

        var compressor = uglify.Compressor();
        var compressedAst = topLevelAst.transform(compressor);
        compressedAst.figure_out_scope();
        compressedAst.compute_char_frequency();
        compressedAst.mangle_names();

        var stream = uglify.OutputStream();
        compressedAst.print(stream);

        node.children[0].data = stream.toString();
    }

    next();
}

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
