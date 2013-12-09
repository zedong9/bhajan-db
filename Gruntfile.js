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
        }
    });

    // Load our tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-release');

    // Register our tasks.
    grunt.registerTask('lint', 'jshint:default');
};
