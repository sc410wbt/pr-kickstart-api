let mongoose = require('mongoose');

// make a connection
mongoose.connect('mongodb://localhost:27017/pr_kickstart', {
    useNewUrlParser: true, useUnifiedTopology: true
});

module.exports = mongoose.connection;