var config = require('../config'); // include config variables

exports.index = function(req, res){
    res.render('index', config);
};
