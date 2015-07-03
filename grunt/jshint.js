module.exports = {
    all: [
        'Gruntfile.js',
        'grunt/*.js',
        'tasks/**/*.js',
        '<%= nodeunit.tests %>'
    ],
    options: {
        jshintrc: '.jshintrc'
    }
};
