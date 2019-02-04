var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DeliveryRatingsSchema = new Schema({
    created: { type: Date, default: Date.now() },
    review: Number,
    deliveryid : String,
    client_name : String,
    client_address : String,
    creator: Schema.Types.ObjectId,
    delivery_id: Schema.Types.ObjectId,
    status: Number,
    contact: Boolean
});


var routes = mongoose.model('delivery_ratings', DeliveryRatingsSchema);
module.exports = routes;