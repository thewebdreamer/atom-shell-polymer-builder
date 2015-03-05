module.exports = function(grunt) {
  'use strict';

  grunt.initConfig({
    'build-atom-shell': {
      tag: 'v0.21.2',
      buildDir: './../../../tmp/release/atom-shell',
      targetDir: './../../../dist/release',
      projectName: 'mycoolapp',
      productName: 'MyCoolApp',
      config: 'Release'
    }
  });
  grunt.loadNpmTasks('grunt-build-atom-shell');
};