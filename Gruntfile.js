// Generated on 2014-03-11 using generator-angular 0.7.1
'use strict';
/*jshint camelcase:false */

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);
    var rewriteModule = require('http-rewrite-middleware');

    // Time how long tasks take. Can help when optimizing build times
    require('time-grunt')(grunt);

    var process = require('process');

    // Define the configuration for all the tasks
    grunt.initConfig({

        // Project settings
        yeoman: {
            // configurable paths
            app: require('./bower.json').appPath || 'app',
            dist: 'dist'
        },

        // Watches files for changes and runs tasks based on the changed files
        watch: {
            js: {
                files: ['<%= yeoman.app %>/scripts/**/*.js'],
                tasks: ['newer:jshint:all'],
                options: {
                    livereload: true
                }
            },
            jsTest: {
                files: ['test/spec/**/*.js'],
                tasks: ['newer:jshint:test', 'karma']
            },
            styles: {
                files: ['<%= yeoman.app %>/styles/**/*.css'],
                tasks: ['newer:copy:styles', 'autoprefixer']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            md: {
                files: ['*.md', 'docs/**/*.md'],
                tasks: ['markdown'],
                options: {
                    spawn : false
                }
            },
            livereload_md: {
                files: ['.tmp/mdcompiled/**/*.html'],
                options: {
                    livereload: 35730,
                    spawn: false
                }
            },
            livereload: {
                options: {
                    livereload: '<%= connect.options.livereload %>'
                },
                files: [
                    '<%= yeoman.app %>/**/*.html',
                    '.tmp/styles/**/*.css',
                    '<%= yeoman.app %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}'
                ]
            }
        },

        // The actual grunt server settings
        connect: {
            options: {
                port: 9000,
                // Change this to '0.0.0.0' to access the server from outside.
                hostname: 'localhost',
                livereload: 35729
            },
            livereload: {
                options: {
                    open: true,
                    base: [
                        '.tmp',
                        '<%= yeoman.app %>'
                    ],
                    // Define rewrite rules -  so that /* gets sent to index.html
                    // https://github.com/viart/http-rewrite-middleware
                    middleware: function (connect, options) {
                        var middlewares = [];

                        // RewriteRules support
                        middlewares.push(rewriteModule.getMiddleware([
                            // list multiple rules here
                            {from: '^/[^/.]*$', to: '/index.html'}
                        ], {verbose: false}));

                        if (!Array.isArray(options.base)) {
                            options.base = [options.base];
                        }

                        var directory = options.directory || options.base[options.base.length - 1];
                        options.base.forEach(function (base) {
                            // Serve static files.
                            middlewares.push(connect.static(base));
                        });

                        // Make directory browse-able.
                        middlewares.push(connect.directory(directory));

                        return middlewares;
                    }
                }
            },
            livereload_md: {
                options: {
                    open: true,
                    base: ['.tmp/mdcompiled'],
                    port: 9001,
                    livereload: 35730,
                }
            },
            test: {
                options: {
                    port: 9001,
                    base: [
                        '.tmp',
                        'test',
                        '<%= yeoman.app %>'
                    ]
                }
            },
            dist: {
                options: {
                    base: '<%= yeoman.dist %>'
                }
            }
        },

        // Make sure code styles are up to par and there are no obvious mistakes
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            all: [
                'Gruntfile.js',
                '<%= yeoman.app %>/scripts/**/*.js',
                '!<%= yeoman.app %>/scripts/vend_mod/**/*.js'
            ],
            test: {
                options: {
                    jshintrc: 'test/.jshintrc'
                },
                src: ['test/spec/**/*.js']
            }
        },

        // Empties folders to start fresh
        clean: {
            dist: {
                files: [
                    {
                        dot: true,
                        src: [
                            '.tmp',
                            '<%= yeoman.dist %>/*',
                            '!<%= yeoman.dist %>/.git*'
                        ]
                    }
                ]
            },
            server: '.tmp'
        },

        // Add vendor prefixed styles
        autoprefixer: {
            options: {
                browsers: ['last 1 version']
            },
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/styles/',
                        src: '**/*.css',
                        dest: '.tmp/styles/'
                    }
                ]
            }
        },

        // Automatically inject Bower components into the app
        'bower-install': {
            app: {
                html: '<%= yeoman.app %>/index.html',
                ignorePath: '<%= yeoman.app %>/'
            }
        },


        // Renames files for browser caching purposes
        rev: {
            dist: {
                files: {
                    src: [
                        '<%= yeoman.dist %>/scripts/**/*.js',
                        '<%= yeoman.dist %>/styles/**/*.css',
                        '<%= yeoman.dist %>/images/**/*.{png,jpg,jpeg,gif,webp,svg}',
                        '<%= yeoman.dist %>/styles/fonts/*'
                    ]
                }
            }
        },

        // Reads HTML for usemin blocks to enable smart builds that automatically
        // concat, minify and revision files. Creates configurations in memory so
        // additional tasks can operate on them
        // RR: Note - the flow step and uglify configuration below enable the creation of a sourceMap, if needed. (currently off)
        useminPrepare: {
            html: '<%= yeoman.app %>/index.html',
            options: {
                dest: '<%= yeoman.dist %>',
                flow: { steps: { 'js': ['uglifyjs'], 'css': ['concat', 'cssmin']}, post: {}}
            }
        },

        uglify: {
            options: {
                sourceMap: false,
                sourceMapIncludeSources: true
            }
        },

        // Performs rewrites based on rev and the useminPrepare configuration
        usemin: {
            html: ['<%= yeoman.dist %>/**/*.html'],
            css: ['<%= yeoman.dist %>/styles/**/*.css'],
            options: {
                assetsDirs: ['<%= yeoman.dist %>']
            }
        },

        // The following *-min tasks produce minified files in the dist folder
        imagemin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.{png,jpg,jpeg,gif}',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        svgmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.app %>/images',
                        src: '**/*.svg',
                        dest: '<%= yeoman.dist %>/images'
                    }
                ]
            }
        },
        htmlmin: {
            dist: {
                options: {
                    collapseWhitespace: true,
                    collapseBooleanAttributes: true,
                    removeCommentsFromCDATA: true,
                    removeOptionalTags: true
                },
                files: [
                    {
                        expand: true,
                        cwd: '<%= yeoman.dist %>',
                        src: ['*.html', 'views/**/*.html'],
                        dest: '<%= yeoman.dist %>'
                    }
                ]
            }
        },

        // Allow the use of non-minsafe AngularJS files. Automatically makes it
        // minsafe compatible so Uglify does not destroy the ng references
        ngmin: {
            dist: {
                files: [
                    {
                        expand: true,
                        cwd: '.tmp/concat/scripts',
                        src: '*.js',
                        dest: '.tmp/concat/scripts'
                    }
                ]
            }
        },

        // Replace Google CDN references
        cdnify: {
            dist: {
                html: ['<%= yeoman.dist %>/*.html']
            }
        },

        // Copies remaining files to places other tasks can use
        copy: {
            dist: {
                files: [
                    {
                        expand: true,
                        dot: true,
                        cwd: '<%= yeoman.app %>',
                        dest: '<%= yeoman.dist %>',
                        src: [
                            '*.{ico,png,txt}',
                            '.htaccess',
                            '*.html',
                            'views/**/*.html',
                            'bower_components/**/*',
                            'images/**/*.{webp}',
                            'fonts/*'
                        ]
                    },
                    {
                        expand: true,
                        cwd: '.tmp/images',
                        dest: '<%= yeoman.dist %>/images',
                        src: ['generated/*']
                    }
                ]
            },
            styles: {
                expand: true,
                cwd: '<%= yeoman.app %>/styles',
                dest: '.tmp/styles/',
                src: '**/*.css'
            }
        },

        // Run some tasks in parallel to speed up the build process
        concurrent: {
            server: [
                'copy:styles'
            ],
            test: [
                'copy:styles'
            ],
            dist: [
                'copy:styles',
                'imagemin',
                'svgmin'
            ]
        },

        // By default, your `index.html`'s <!-- Usemin block --> will take care of
        // minification. These next options are pre-configured if you do not wish
        // to use the Usemin blocks.
        // cssmin: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/styles/main.css': [
        //         '.tmp/styles/**/*.css',
        //         '<%= yeoman.app %>/styles/**/*.css'
        //       ]
        //     }
        //   }
        // },
        // uglify: {
        //   dist: {
        //     files: {
        //       '<%= yeoman.dist %>/scripts/scripts.js': [
        //         '<%= yeoman.dist %>/scripts/scripts.js'
        //       ]
        //     }
        //   }
        // },
        // concat: {
        //   dist: {}
        // },


        // Test settings
        karma: {
            unit: {
                configFile: 'karma.conf.js',
                singleRun: true
            }
        },

        // Rsync for deployment - https://www.npmjs.org/package/grunt-rsync
        rsync: {
            options: {
                args: ['-izha', '--stats'],
                exclude: ['.git*', '*.scss', 'node_modules'],
                recursive: true,
                ssh: true,
                privateKey: process.env.SSH_PRIVATE_KEY,
                dryRun: false,
            },
            stage_site: {
                options: {
                    exclude: ['robots.txt'],
                    src: 'dist/',
                    dest: '/var/www/hnstage.k2company.com',
                    host: process.env.SSH_USER + '@hnstage.k2company.com',
                    syncDest: true
                }
            },
            stage_apache: {
                options: {
                    src: 'apache_config/*',
                    dest: '/etc/apache2/sites-available',
                    host: process.env.SSH_USER + '@hnstage.k2company.com',
                    exclude: [],
                    syncDest: false,
                    recursive: false
                }
            }
        },
        markdown: {
            all: {
                files: [
                    {
                        expand: true,
                        src: ['*.md', 'docs/**/*.md'],
                        dest: '.tmp/mdcompiled',
                        ext: '.html'
                    }
                ]
            }
        }
    })
    ;

    grunt.registerTask('pushto', function (target) {
        if (target === 'stage') {
            return grunt.task.run(['rsync:stage_site', 'rsync:stage_apache']);
        }
    });

    grunt.registerTask('serve', function (target) {
        if (target === 'dist') {
            return grunt.task.run(['build', 'connect:dist:keepalive']);
        }

        if (target === 'md') {
            grunt.task.run([
                'markdown', // Initialize
                'connect:livereload_md',
                'watch'
            ]);
        }

        grunt.task.run([
            'clean:server',
            'bower-install',
            'concurrent:server',
            'autoprefixer',
            'connect:livereload',
            'watch'
        ]);
    });


    grunt.registerTask('server', function () {
        grunt.log.warn('The `server` task has been deprecated. Use `grunt serve` to start a server.');
        grunt.task.run(['serve']);
    });

    grunt.registerTask('test', [
        'clean:server',
        'concurrent:test',
        'autoprefixer',
        'connect:test',
        'karma'
    ]);

    grunt.registerTask('build', [
        'clean:dist',
        'bower-install',
        'useminPrepare',
        'concurrent:dist',
        'autoprefixer',
        'concat',
        'ngmin',
        'copy:dist',
        //'cdnify',  // Not actually using (prefer manual selection) and causing problems.
        'cssmin',
        'uglify',
        'rev',
        'usemin',
        'htmlmin'
    ]);

    grunt.registerTask('default', [
        'newer:jshint',
        'test',
        'build'
    ]);


}
;

// TODO: It does not appear that this properly installs karma.  I manually installed karma-jasmine and karma-chrome-launcher, but it's missing a lot per this: https://github.com/yeoman/generator-karma/issues/44  ; But generator-karma and generator-angular are currently at incompatible versions!  SO, keep an eye on it and if I start having karma problems, look here first.  Uggh.