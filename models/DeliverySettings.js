/**
 * Created by jeton on 7/21/2017.
 */
let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let DeliverySettingsSchema = new Schema({
    clientId: Schema.Types.ObjectId,
    addresses:  [
        {
            value: String,
            default: Boolean,
            default_for_return:Boolean
        }
    ],
    delivery_window_end: String,
    allow_to_send_email: Boolean,
    allow_to_send_SMS: Boolean,
    allow_to_receive_daily_report: Boolean,
    allow_to_receive_end_of_day_report: Boolean,
    allow_to_receive_end_of_week_report: Boolean,
    allow_to_receive_issue_report: Boolean,
    home_delivery: {
        type: Boolean,
        required: [true, 'home_delivery is required']
    },
    store_pickup: {
        type: Boolean,
        required: [true, 'store_pickup is required']
    },
    week_days_available: {
        type: Array,
        required: [true, 'week_days_available is required']
    },
    zip: [
        {
            range_from: {
                type: String,
                // required: [true, 'range_from is required']
            },
            range_to: {
                type: String
                // required: [true, 'range_to is required']
            },
            price: {
                value: Number,
                currency: String
            }
        }
    ],
    allowed_pickups_zones: [
        {
            range_from: {
                type: String,
            },
            range_to: {
                type: String
            }
        }
    ],
    delivery_windows: [
        {
            zip_from: String,
            zip_to: String,
            time_from: String,
            time_to: String
        }
    ],
    pickup_deadline: String,
    pickup_deadline_to: String,
    delivery_window_start: String,
    dropshipping_enabled: Boolean,
    webshipr_integration_enabled: Boolean,
    default_note: String,
    service_enabled:[
        {
            service_id:Schema.Types.ObjectId,
            countries:{
                type: Array,
                default:[]
            }
        }
    ],
    allow_signature:{
        type: Boolean,
        default:false
    },
    allow_delivery:{
        type: Boolean,
        default:true
    },
    allow_return:{
        type: Boolean,
        default:true
    },
    allow_express:{
        type: Boolean,
        default:false
    }
});


let deliverySettings = mongoose.model('deliverySettings', DeliverySettingsSchema);
module.exports = deliverySettings;