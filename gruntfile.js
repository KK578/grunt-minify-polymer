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

    var time = require('time-grunt');
    time(grunt);

    var jit = require('jit-grunt');
    jit(grunt, {
        minifyPolymer: 'tasks/minify_polymer.js'
    });

    var config = require('load-grunt-config');
    config(grunt, {
        loadGruntTasks: false
    });
};
