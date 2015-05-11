module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      jade: {
        files: ['app/views/**'],
        options: {
          livereload: true
        }
      },
      uglify: {
        files: ['public/**/*.js'],
        tasks: ['jshint'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/**', 'app/models/**/*.js', 'app/schemas/**/*.js', 'app/controllers/**/*.js', 'config/routes.js', 'app.js'],
       //tashs: ['jshint'],
        option: {
          livereload: true
        }
      }
    },
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        ignores: ['public/libs/**/*.js']
      },
      all: ['public/js/*.js', 'test/**/*.js', 'app/**/*.js']
    },
    nodemon: {
      dev: {
        option: {
          file: 'app.js',
          args: [],
          ignoreFiles: ['README.md', 'node_modules/**', '.DS_Store'],
          watchedExtensions: ['js'],
          watcheddFolders: ['./'],
          debug: true,
          delayTime: 1,
          env: {
            PORT: 3003
          },
          cwd: __dirname
        }
      }
    },
    concurrent: {
      tasks: ['nodemon', 'watch', 'jshint'],
      options: {
        logConcurrentOutput: true
      }
    },
    mochaTest: {
      options: {
        reporter: 'spec',
      },
      src: ['test/**/*.js']
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');
  grunt.loadNpmTasks('grunt-mocha-test');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-jshint');

  grunt.option('force', true);
  grunt.registerTask('default', ['concurrent']);
  grunt.registerTask('test', ['mochaTest']);
};