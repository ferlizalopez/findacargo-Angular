let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ClientPaymentSchema = new Schema({
    accountId: Schema.Types.ObjectId,
    date: Date,
    description: String,
    value: Number
});

let clientpayments = mongoose.model('clientpayments', ClientPaymentSchema);
module.exports = clientpayments;