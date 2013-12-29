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
            default: {
                options: {create: false, branch: '<%= branch %>'}
            }
        },
        gitpush: {
            default: {
                options: {tags: true, branch: '<%= branch %>'},
            }
        },
        gitmerge: {
            default: {
                options: {ffOnly: true, branch: '<%= branch %>'}
            }
        },
        clean: {
            hooks: ['.git/hooks']
        },
        githooks: {
            all: {'pre-commit': 'jshint'}
        },
        mochacli: {
            all: ['test/*.js'],
            options: {
                reporter: 'spec'
            }
        },
        watch: {
            files: ['**/*.js', '!node_modules/**/*'],
            tasks: ['jshint'],
        },
        curl: {
            'public/db-backup.json': 'http://localhost:3000/api/bhajan'
        }
    });

    // Load our tasks.
    grunt.loadNpmTasks('grunt-contrib-clean');
    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-watch');
    grunt.loadNpmTasks('grunt-curl');
    grunt.loadNpmTasks('grunt-git');
    grunt.loadNpmTasks('grunt-githooks');
    grunt.loadNpmTasks('grunt-mocha-cli');
    grunt.loadNpmTasks('grunt-npm-install');
    grunt.loadNpmTasks('grunt-release');

    // Register our basic tasks.
    grunt.registerTask('default', 'build');
    grunt.registerTask('test', 'mochacli');

    grunt.registerTask('build', 'Lints and tests specified branch. If no branch is specified, current branch is used.', function (branch) {
        if (branch) {
            grunt.task.run(['checkout:' + branch, 'jshint:default', 'test']);
        } else {
            grunt.task.run(['jshint:default', 'test']);
        }
    });

    grunt.registerTask('checkout', 'Checks out specified git branch.', function (branch) {
        if (branch) {
            grunt.config.set('branch', branch);
            grunt.task.run('gitcheckout');
        } else {
            grunt.warn('Branch must be specified (checkout:branch).');
        }
    });

    grunt.registerTask('merge', 'Merges first git branch into second.', function (source) {
        if (source) {
            grunt.config.set('branch', source);
            grunt.task.run('gitmerge');
        } else {
            grunt.warn('Source branch must be specified (merge:source).');
        }
    });

    grunt.registerTask('push', 'Pushes specified git branch.', function (branch) {
        if (branch) {
            grunt.config.set('branch', branch);
            grunt.task.run('gitpush');
        } else {
            grunt.warn('Branch must be specified (push:branch).');
        }
    });

    grunt.registerTask('init', 'Build and configure the project for the first time.', ['npm-install', 'clean:hooks', 'githooks']);

    grunt.registerTask('backup', 'Takes a snapshot of the data in the database and downloads it as JSON.', 'curl');

    // Build deployment tasks.
    grunt.registerTask('deploy', ['checkout:production', 'merge:master', 'push:production', 'checkout:master', 'push:master']);

    grunt.registerTask('production', ['build:master', 'release', 'deploy']);
    grunt.registerTask('production:minor', ['build:master', 'release:minor', 'deploy']);
};
