module.exports = {
    'default': {
        description: 'Lint and run all tests',
        tasks: [
            'jshint',
            'jscs',
            'test'
        ]
    },
    'test': {
        description: 'Clean working directory and run task and test result',
        tasks: [
            'clean',
            'minifyPolymer',
            'minifyPolymerCSS',
            'nodeunit'
        ]
    }
};
