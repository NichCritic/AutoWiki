/* global module: false */
module.exports = function(grunt) {
  "use strict";

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      options: {
        jshintrc: true
      },
      files: ['Gruntfile.js', 'lib/pen-master/src/**/*.js', 'src/**/*.js']
    },

    uglify: {
      options: {
        hoist_funs:true
      },
      build: {
        files: {
          'build/autowiki-<%= pkg.version %>.min.js': ['lib/pen-master/src/**/*.js', 'src/scripts/*.js', 'src/autowiki.js']
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>'],
      tasks: ['jshint']
    },

    copy: {
      build: {
        files: [
          {expand: true, flatten:true, src: ['lib/pen-master/src/font/*'], dest: 'build/font/', filter: 'isFile'},
          {expand: true, flatten:true, src: ['lib/pen-master/src/*.css'], dest: 'build/', filter: 'isFile'},
          {expand: true, flatten:true, src: ['src/*.css'], dest: 'build/', filter: 'isFile'},
          {expand: false, src: ['index.html', '404.html', 'privacy.html'], dest: 'build/', filter: 'isFile'},
        ]
      }
    },
    gcs: {
      options: {
        keyFilename: 'keyfile.json',
        project: 'natural-broker-285114',
        bucket: 'autowiki.naelick.com',
        gzip: false,
        headers: {
        },
        metadata: {
        }
      },
      dist: {
        cwd: 'build',
        src: '**'
      },
    }
  });

  // Plugins
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-google-cloud');

  // Default task(s).
  grunt.registerTask('default', ['jshint', 'uglify', 'copy', 'gcs']);

};
