module.exports = {
    options: {
        jsMangle: false
    },
    test: {
        files: [
            {
                expand: true,
                cwd: 'test/fixtures/',
                src: ['**/*.html', '!only_css/**/*'],
                dest: 'tmp/'
            }
        ]
    }
};
