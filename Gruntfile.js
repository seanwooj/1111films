var globalConfig = {
  images: 'images',
  css: 'css',
  sass: 'sass',
  fonts: 'fonts',
  scripts: 'js',
  bower_path: 'bower_components'
};

module.exports = function(grunt){

  grunt.initConfig({
    globalConfig: globalConfig,

    pkg: grunt.file.readJSON('package.json'),

    bower: grunt.file.readJSON('./.bowerrc'),

    concat: {
      options: {
        seperator: ';'
      },

      dist: {
        src: ['js/development/**/*.js', 'js/vendor/**/*.js'],
        dest: 'js/<%= pkg.name %>.js'
      }
    },

    copy: {
      main: {
        files: [
          {
            expand: true,
            flatten: true,
            src: '<%= globalConfig.bower_path %>/jquery/dist/jquery.js',
            dest: '<%= globalConfig.scripts %>/vendor/',
            filter: 'isFile'
          },

          {
            expand: true,
            flatten: true,
            src: '<%= globalConfig.bower_path %>/underscore/underscore.js',
            dest: '<%= globalConfig.scripts %>/vendor/',
            filter: 'isFile'
          },

          {
            expand: true,
            flatten: true,
            src: '<%= globalConfig.bower_path %>/skeleton/css/skeleton.css',
            dest: '<%= globalConfig.sass %>/vendor/',
            ext: '.scss',
            filter: 'isFile'
          }
        ]
      }
    },

    uglify: {
      options: {
        banner: '/*! <%= pkg.name %> <%= grunt.template.today("dd-mm-yyyy") %> */\n'
      }
    },

    dist: {
      files: { 'dist/<%= pkg.name %>.min.js': ['<%= concat.dist.dest %>'] }
    },

    jshint: {
      files: [
        'Gruntfile.js',
        'js/development/**/*.js',
        'test/**/*.js'
      ],
      options: {
        globals: {
          jQuery: true,
          console: true,
          module: true
        }
      }
    },

    watch: {
      files: ['<%= jshint.files %>', 'haml/**/*.haml', 'sass/**/*.scss'],
      tasks: ['jshint', 'haml', 'concat', 'sass']
    },

    haml: {
      options: {
        language: 'ruby'
      },
      compile: {
        files: [
          {
            expand: true,
            cwd: 'haml/',
            src: ['**/*.haml'],
            dest: '',
            ext: '.html',
            extDot: 'first'
          }
        ]
      }
    },

    sass: {
      dist: {
        files: {
          '<%= globalConfig.css %>/1111.css' : '<%= globalConfig.sass %>/main.scss'
        }
      }
    },

    connect: {
      server: {
        options: {
          port: 8000,
          hostname: '*',
          keepalive: true
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-haml');
  grunt.loadNpmTasks('grunt-contrib-copy');
  grunt.loadNpmTasks('grunt-contrib-sass');
  grunt.loadNpmTasks('grunt-contrib-connect');

  grunt.registerTask('default', ['jshint', 'copy', 'concat', 'uglify']);

};
