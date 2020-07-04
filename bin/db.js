const
    mongoose = require('../config/mongoose'),
    mongodb = require('../config/mongodb')();

module.exports = mongoose.connect(mongodb.connection, mongodb.options, err => {
    if (err) throw err;
});