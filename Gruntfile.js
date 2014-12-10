'use strict';

module.exports = function(grunt) {
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-jscs');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-karma');

  grunt.initConfig({
    jshint: {
      all: ['app/**/*.js', 'test/**/*.js', '*.js', 'lib/**/*.js', '!/build/**/*.js', '!test/test_bundle.js', '!test/angular_testbundle.js'],
      options: {
        jshintrc: true
      }
    },

    jscs: {
      all: {
        src: ['app/**/*.js', '*.js', 'test/**/*.js', 'lib/**/*.js', '!/build/**/*.js', '!app/bundle.js', '!test/test_bundle.js', '!test/angular_testbundle.js'],
        options: {
            config: '.jscsrc'
        }
      }
    },

    simplemocha: {
      src: ['test/api/**/*.js']
    },

    clean: {
      src: ['build/']
    },

    copy: {
      dev: {
        cwd: 'app/',
        expand: true,
        src: ['**/*.html'],
        dest: 'build/'
      }
    },

    browserify: {
      dev: {
        src: ['app/js/**/*.js'],
        dest: 'build/client_bundle.js',
        options: {
          transform: ['debowerify']
        }
      },

      test: {
        src: ['test/client/**/*.js'],
        dest: 'test/angular_testbundle.js',
        options: {
          transform: ['debowerify']
        }
      }
    },

    karma: {
      unit: {
        configFile: 'karma.config.js'
      },
      continuous: {
        configFile: 'karma.config.js',
        singleRun: true,
        browsers: ['PhantomJS']
      }
    }
  });

  grunt.registerTask('lint', ['jshint', 'jscs']);
  grunt.registerTask('test:server', ['simplemocha']);
  grunt.registerTask('test:client', ['browserify:test', 'karma:unit']);
  grunt.registerTask('test', ['lint', 'test:server', 'test:client']);
  grunt.registerTask('build', ['jshint', 'clean', 'browserify', 'copy:dev']);
  grunt.registerTask('default', ['test', 'build']);
};
