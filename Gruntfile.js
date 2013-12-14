module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            default: {
                src: ['**/*.js', '!node_modules/**/*']
            }
        },
        release: {
            options: {
                npm: false,
                push: false,
                pushTags: false,
                commitMessage: 'Bump to <%= version %>.'
            }
        },
        gitcheckout: {
            production: {
                options: {branch: 'production', create: false}
            },
            master: {
                options: {branch: 'master', create: false}
            }
        },
        gitpush: {
            options: {tags: true},
            master: {
                options: {branch: 'master'}
            },
            production: {
                options: {branch: 'production'}
            }
        },
        gitmerge: {
            master: {
                options: {branch: 'master', ffOnly: true}
            }
        },
        mochacli: {
            all: ['test/*.js'],
            options: {
                reporter: 'spec'
            }
        }
    });

    // Load our tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-mocha-cli');

    // Register our basic tasks.
    grunt.registerTask('default', 'build');
    grunt.registerTask('test', 'mochacli');

    grunt.registerTask('build', ['jshint:default', 'test']);
    grunt.registerTask('build:master', ['gitcheckout:master', 'build']);

    // Build deployment tasks.
    grunt.registerTask('deploy', ['gitcheckout:production', 'gitmerge:master', 'gitpush:master', 'gitpush:production', 'gitcheckout:master']);

    grunt.registerTask('production', ['build:master', 'release', 'deploy']);
    grunt.registerTask('production:minor', ['build:master', 'release:minor', 'deploy']);

};
