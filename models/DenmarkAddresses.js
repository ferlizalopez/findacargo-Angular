let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let denmarkAddress = new Schema({
    dm_id: {
        type: String,
        required: true
    },
    status: {
        type: Number,
    },
    vejkode: {
        type: String,
    },
    vejnavn: {
        type: String,
        required: true
    },
    adresseringsvejnavn: {
        type: String,
        required: true
    },
    husnr: {
        type: String,
        required: true
    },
    supplerendebynavn: {
        type: String
    },
    postnr: {
        type: String
    },
    postnrnavn: {
        type: String
    },
    kommunekode: {
        type: String,
    },
    x: {
        type: String,
        required: true
    },
    y: {
        type: String,
        required: true
    }
});

module.exports = mongoose.model('denmark_addresses', denmarkAddress);