module.exports = {
    options: {
        jsMangle: false
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
