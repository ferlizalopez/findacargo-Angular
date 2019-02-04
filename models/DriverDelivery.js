var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DriverDelivery = new Schema({
    carrier_id: String,
    delivery_id: String
});

module.exports = mongoose.model('driver_delivery', DriverDelivery, 'driver_delivery');