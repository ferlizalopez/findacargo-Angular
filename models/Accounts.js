/**
 * Created by jeton on 6/20/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var AccountSchema = new Schema({
    id: {
        type: String
    },
    name: String,
    email: {
        type: String,
        index: true,
        unique: true
    },
    password: String,
    ccode: String,
    codeISO: String,
    phone: String,
    category: String,
    buyer: String,
    freightForwarder: Boolean,
    carrier: Boolean,
    manager : Boolean,
    approved : Boolean,
    monthlyInvoice: Number,
    carrierActive: Boolean,
    date: {type: Date, default: Date.now()},
    groupId: String,
    cpr: String,
    companyDetails: {
        companyName: String,
        taxId: String,
        companyAddress: String
    },
    isAdmin: Boolean,
    apikey: String,
    status: Boolean,
    resetpasswordtoken: String,
    scheduledClient: String
});


var accounts = mongoose.model('accounts', AccountSchema);
module.exports = accounts;