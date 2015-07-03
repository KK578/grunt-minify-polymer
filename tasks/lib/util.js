var uglify = require('uglify-js');

exports.minifyCss = function (css) {
    // TODO: Resolve /**********/
    // Remove /* ... */ Comments
    var minCss = css.replace(/\/\*([^*]|[\r\n]|(\*+([^*\/]|[\r\n])))*\*\/+/gm, '');
    // Remove whitespace and line feeds at start and end of each line.
    minCss = minCss.replace(/\s*(\r\n|\n)\s*/gm, '');

    // Remove spaces before and after any of the following characters: :,>{}
    // Use loads of silly regex as lookahead/lookbehind isn't supported. :/
    minCss = minCss.replace(/\s*\:\s*/gm, ':');
    minCss = minCss.replace(/\s*\,\s*/gm, ',');
    minCss = minCss.replace(/\s*\>\s*/gm, '>');
    minCss = minCss.replace(/\s*\{\s*/gm, '{');
    minCss = minCss.replace(/\s*\}\s*/gm, '}');
    // Do not remove spaces by parantheses as they may destroy structure
    //  e.g. :host([mode="cover"]) #mainContainer
    // minCss = minCss.replace(/\s*\(\s*/gm, '(');
    // minCss = minCss.replace(/\s*\)\s*/gm, ')');

    // Resolve ::content selectors requiring a space.
    minCss = minCss.replace(/::/gm, ' ::');

    // Replace any remaining occurances of multiple spaces with a single space.
    minCss = minCss.replace(/  +/gm, ' ');

    return minCss;
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
