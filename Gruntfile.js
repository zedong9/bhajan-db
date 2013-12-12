module.exports = function (grunt) {
    grunt.initConfig({
        jshint: {
            default: {
                src: ['**/*.js', '!node_modules/**/*']
            },
            single: {
                src: grunt.option('file')
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

    // Register our tasks.
    grunt.registerTask('lint', 'jshint:default');
    grunt.registerTask('lint-master', ['gitcheckout:master', 'lint']);

    grunt.registerTask('update-production', ['gitcheckout:production', 'gitmerge:master']);
    grunt.registerTask('push-master-production', ['gitpush:master', 'gitpush:production']);

    grunt.registerTask('production', ['lint-master', 'test', 'release', 'update-production', 'push-master-production']);
    grunt.registerTask('production-minor', ['lint-master', 'test', 'release:minor', 'update-production', 'push-master-production']);

    grunt.registerTask('test', 'mochacli');
};
