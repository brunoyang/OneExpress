module.exports = function(grunt) {

  grunt.initConfig({
    watch: {
      jade: {
        files: ['app/views/**'],
        options: {
          livereload: true
        }
      },
      js: {
        files: ['public/**', 'app/models/**/*.js', 'app/schemas/**/*.js', 'app/controller/**/*.js', 'config/routes.js', 'app.js'],
       //tashs: ['jshint'],
        option: {
          livereload: true
        }
      }
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
      tasks: ['nodemon', 'watch'],
      options: {
        logConcurrentOutput: true
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-nodemon');
  grunt.loadNpmTasks('grunt-concurrent');

  grunt.option('force', true);
  grunt.registerTask('default', ['concurrent']);
};