module.exports = {
    test: {
        files: [
            {
                expand: true,
                cwd: 'test/fixtures/only_css/',
                src: ['**/*.css'],
                dest: 'tmp/only_css/'
            }
        ]
    }
};
