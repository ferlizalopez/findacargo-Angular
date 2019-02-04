let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let ClientExpenseSchema = new Schema({
    accountId: Schema.Types.ObjectId,
    date: Date,
    description: String,
    value: Number,
    paid: Boolean
});

let clientexpenses = mongoose.model('clientexpenses', ClientExpenseSchema);
module.exports = clientexpenses;