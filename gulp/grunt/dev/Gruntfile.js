module.exports = function registerBuildConfig(grunt) {
    'use strict';
    var fullPath = require('path').join(__dirname, './buildOptions.json'),
        buildOptions = JSON.parse(require('fs').readFileSync(fullPath));

    grunt.initConfig({ 'build-atom-shell': buildOptions });
    grunt.loadNpmTasks('grunt-build-atom-shell');
};