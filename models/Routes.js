var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var RoutesSchema = new Schema({
    id: {
        type: String,
        unique: true,
        index: true
    },
    created: { type: Date, default: Date.now() },
    printed: { type: Boolean, default: false },
    deliveryid : String,
    deliverytype : String,
    distribution : String,
    cartype : String,
    department: String,
    recipientname: String,
    recipientphone: {
        country_iso_code : { type: String, minlength: 2, maxlength: 3 },
        country_dial_code : { type: String },
        phone : { type : String }
    },
    pickupaddress: String,
    pickupaddress2: String,
    deliverydate: { type: Date },
    pickupzip: Number,
    pickupcity: String,
    pickupdeadline: String,
    pickupdeadlineto: String,
    deliveryaddress: String,
    deliveryaddress2: String,
    deliveryzip: Number,
    deliverycity: String,
    deliverydayofweek: String,
    deliverywindowstart: String,
    type: String,
    status: Number,
    deliverywindowend: String,
    deliverylabel: String,
    deliverynumberofpackages: Number,
    deliverynotes: String,
    delivered_at: String,
    routes: String,
    driveremail: String,
    weekNumber: String,
    deliverycoordinates: [String, String],
    pickupcoordinates: [String, String],
    creator: Schema.Types.ObjectId,
    carrier: {accountId: Schema.Types.ObjectId, email: String, phone: String},
    full_insurance: Boolean,
    full_insurance_value: Number,
    parent_delivery_id: Schema.Types.ObjectId,
    returned_delivery_id:Schema.Types.ObjectId, //Only for Return
    return_request_by:String,
    signature:String,
    deleted: {
        type: Boolean,
        default: false
    }
});


var routes = mongoose.model('scheduleddeliveries', RoutesSchema);
module.exports = routes;