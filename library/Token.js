const mongoose = require('mongoose');

// define Schema
let TokenSchema = mongoose.Schema({
    email: {
        type: String,
        require: true
    }
});

TokenSchema.path('email').validate(email => {
    let emailRegex = /^([\w-\.]+@([\w-]+\.)+[\w-]{2,4})?$/;
    return emailRegex.test(email);
}, 'invalid email', 'invalid')

// compile schema to model
let TokenClass = mongoose.model('Token', TokenSchema, 'tokens');

module.exports = TokenClass;