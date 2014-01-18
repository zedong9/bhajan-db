var chalk = require('chalk');

module.exports = require('tracer').console({
    format: [
        '{{prefix}} {{message}}',
        {error: '{{prefix}} {{message}} (in {{file}}:{{line}})'}
    ],
    dateformat: 'longTime',
    preprocess: function (data) {
        var color;
        switch (data.title) {
            case 'error':
                color = chalk.red.bold;
                break;
            case 'info':
                color = chalk.green;
                break;
            case 'debug':
                color = chalk.cyan;
                break;
            case 'trace':
                color = chalk.magenta;
                break;
            case 'warn':
                color = chalk.yellow;
                break;
        }
        data.title = data.title.toUpperCase();
        data.prefix = color(data.timestamp + ' [' + data.title + ']');
    },

    // Set output level: 'error', 'warn', 'info', 'debug', 'trace'
    // (in ascending order of output.)
    level: 'info'
});
