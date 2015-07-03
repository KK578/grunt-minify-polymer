module.exports = {
    options: {
        js: {
            mangle: false
        }
    },
    test: {
        files: [
            {
                expand: true,
                cwd: 'test/fixtures/',
                src: ['**/*.html'],
                dest: 'tmp/'
            }
        ]
    }
};
