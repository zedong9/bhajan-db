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
    grunt.registerTask('production', ['lint-master', 'release', 'gitpush']);
    grunt.registerTask('production-minor', ['lint-master', 'release:minor', 'gitpush']);
};
