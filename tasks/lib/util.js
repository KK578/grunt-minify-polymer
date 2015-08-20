var uglify = require('uglify-js');

exports.minifyCss = function (css) {
    /**
     * Remove line feeds and directly surrounding whitespace.
     *  1) Whitespace or Tab
     *  2) Line Feed
     *  3) Whitespace or Tab
     **/
    var minCss = css.replace(/[ \t]*[\r\n]+[ \t]*/gm, '');

    /**
     * Remove comments.
     * As all line feeds have been removed, including those within comments,
     * no line feeds need to be handled here.
     *  1) Match comment open
     *  2) Match any character non-greedily
     *     - Non-greedy ensures that the first comment close encountered will stop the string.
     *  3) Match comment close
     */
    minCss = minCss.replace(/\/\*.*?\*\//g, '');

    /**
     * Remove 'styling' spaces after the following characters: :;,>{}
     * Would be preferable to use lookahead/lookbehind to allow for matching all
     *  characters without including in the matched string, but JS.
     *
     * Do not remove spaces by parantheses as they may destroy structure
     *  e.g. :host([mode="cover"]) #mainContainer
     *                            ^
     */
    minCss = minCss.replace(/\s*\:\s*/g, ':');
    minCss = minCss.replace(/\s*\;\s*/g, ';');
    minCss = minCss.replace(/\s*\,\s*/g, ',');
    minCss = minCss.replace(/\s*\>\s*/g, '>');
    minCss = minCss.replace(/\s*\{\s*/g, '{');
    minCss = minCss.replace(/\s*\}\s*/g, '}');

    // Resolve ::content selectors requiring a space.
    minCss = minCss.replace(/::content/gm, ' ::content');

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
