var _ = require('underscore');

module.exports = function () {
    var quotes = [
        'love all, serve all.',
        'help ever, hurt never.',
        'service to man is service to god.'
    ];
    return _.shuffle(quotes).pop();
};
