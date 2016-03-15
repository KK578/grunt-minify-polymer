var CleanCss = require('clean-css');
var uglify = require('uglify-js');

exports.minifyCss = function (css) {
    return new CleanCss({ advanced: true }).minify(css).styles;
};

// All credits to https://github.com/mishoo/UglifyJS2 for this function.
exports.minifyJs = function (js, options) {
    var topLevelAst = uglify.parse(js);
    topLevelAst.figure_out_scope();

    var compressor = uglify.Compressor(options.jsCompress);
    var compressedAst = topLevelAst.transform(compressor);

    if (options.jsMangle) {
        compressedAst.figure_out_scope();
        compressedAst.compute_char_frequency();
        compressedAst.mangle_names();
    }

    var stream = uglify.OutputStream();
    compressedAst.print(stream);

    return stream.toString();
};
