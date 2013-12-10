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
                commitMessage: 'Bump to <%= version %>.',
                github: {
                    repo: 'sgunturi/bhajan-db'
                }
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
            options: {
                tags: true
            },
            master: {
                options: {branch: 'master'}
            },
            production: {
                options: {branch: 'production'}
            }
        },
        gitmerge: {
            'master ff': {
                options: {branch: 'master', ffOnly: true}
            }
        }
    });

    // Load our tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-release');
    grunt.loadNpmTasks('grunt-git');

    // Register our tasks.
    grunt.registerTask('lint', 'jshint:default');
    grunt.registerTask('lint-master', ['gitcheckout:master', 'lint']);

    grunt.registerTask('update production', ['gitcheckout:production', 'gitmerge:master ff']);
    grunt.registerTask('push master and production', ['gitpush:master', 'gitpush:production']);

    grunt.registerTask('production', ['lint-master', 'release', 'update production', 'push master and production']);
    grunt.registerTask('production-minor', ['lint-master', 'release:minor', 'update production', 'push master and production']);
};
