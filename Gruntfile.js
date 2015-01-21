module.exports = function (grunt) {

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),
        jsFolder: 'static/js/',
        jsFiles: [
            '<%= jsFolder %>' + 'src/BoundedTileLayer.js',
            '<%= jsFolder %>' + 'src/BoundsGenerator.js',
            '<%= jsFolder %>' + 'templates/notifierTemplate.js',
            '<%= jsFolder %>' + 'src/Notifier.js',
            '<%= jsFolder %>' + 'templates/downloaderTemplate.js',
            '<%= jsFolder %>' + 'src/Downloader.js',
            '<%= jsFolder %>' + 'templates/dataFormTemplate.js',
            '<%= jsFolder %>' + 'src/DataForm.js',
            '<%= jsFolder %>' + 'templates/projectChooserTemplate.js',
            '<%= jsFolder %>' + 'src/ProjectChooser.js',
            '<%= jsFolder %>' + 'templates/tileDownloaderTemplate.js',
            '<%= jsFolder %>' + 'src/TileDownloader.js',
            '<%= jsFolder %>' + 'src/TileGenerateGui.js'
        ],
        react: {
            dynamic_mappings: {
                files: [
                    {
                        expand: true,
                        cwd: '<%= jsFolder %>' + 'react',
                        src: ['**/*.jsx'],
                        dest: '<%= jsFolder %>' + 'templates',
                        ext: '.js'
                    }
                ]
            }
        },
        concat: {
            options: {
                separator: '\n'
            },
            dist: {
                src: '<%= jsFiles %>',
                dest: '<%= jsFolder %>' + 'dist/built.js'
            }
        },
        watch: {
            scripts: {
                files: ['**/*.js', '**/*.jsx'],
                tasks: ['default'],
                options: {
                    spawn: false,
                },
            },
        }
    });

    grunt.loadNpmTasks('grunt-contrib-concat');
    grunt.loadNpmTasks('grunt-react');
    grunt.loadNpmTasks('grunt-contrib-watch');

    // Default task(s).
    grunt.registerTask('default', ['react', 'concat']);



};