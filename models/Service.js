/**
 * Created by jeton on 8/25/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var ServiceSchema = new Schema({
    id: {
        type: String
    },
    name: String,
    description: String,
    enabled: {
        type: Boolean,
        default: false
    },
});

var services = mongoose.model('services', ServiceSchema);
module.exports = services;