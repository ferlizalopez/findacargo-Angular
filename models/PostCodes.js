let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let PostalCode = new Schema({
    COUNTRY_CODE: {
        type: String,
        required: true
    },
    AREA: {
        type: String,
        required: true
    },
    ZONE: {
        type: Number,
        required: true
    },
    ZIP: {
        type: Number,
        required: true
    },
    CITY: {
        type: String,
        required: true
    },
    STREET: {
        type: String
    },
    Land: {
        type: String
    }
});

module.exports = mongoose.model('post_codes', PostalCode);