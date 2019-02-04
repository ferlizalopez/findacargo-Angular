const mongoose = require('mongoose');
const Schema = mongoose.Schema;

let TruckSchema = new Schema({
    identifier: String,
    liveDelivery: {
        available: Boolean,
        location: {
            coordinates: [Number]
        }
    },
    type: String,
    userID: Schema.Types.ObjectId,
    vehicalType: String
});


let trucks = mongoose.model('truck', TruckSchema, 'truck');
module.exports = trucks;