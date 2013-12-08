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
    });

    // Load our tasks.
    grunt.loadNpmTasks('grunt-contrib-jshint');

    // Register our tasks.
    grunt.registerTask('lint', 'jshint:default');
};
