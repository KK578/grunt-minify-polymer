/*
 * grunt-minify-polymer
 *
 *
 * Copyright (c) 2015 Kevin Kwan
 * Licensed under the MIT license.
 */

'use strict';
module.exports = function (grunt) {
    // load all npm grunt tasks
    require('load-grunt-tasks')(grunt);

    // Project configuration.
    grunt.initConfig({
        jscs: {
            options: {
                config: '.jscsrc'
            },
            all: '<%= jshint.all %>'
        },
        jshint: {
            all: [
                'Gruntfile.js',
                'tasks/**/*.js',
                '<%= nodeunit.tests %>'
            ],
            options: {
                jshintrc: '.jshintrc'
            }
        },
        // Before generating any new files, remove any previously-created files.
        clean: {
            tests: ['tmp/']
        },
        // Configuration to be run (and then tested).
        minifyPolymer: {
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
        },
        // Unit tests.
        nodeunit: {
            tests: ['test/*_test.js']
        }

    });
    // Actually load this plugin's task(s).
    grunt.loadTasks('tasks');

    // Whenever the "test" task is run, first clean the "tmp" dir, then run this
    // plugin's task(s), then test the result.
    grunt.registerTask('test', ['clean', 'minifyPolymer', 'nodeunit']);

    // By default, lint and run all tests.
    grunt.registerTask('default', ['jshint', 'jscs', 'test']);
};
