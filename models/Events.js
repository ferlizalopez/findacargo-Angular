let mongoose = require('mongoose');
let Schema = mongoose.Schema;

let Event = new Schema({
    assigned_to : Schema.Types.ObjectId,
    assigned_to_type : String,
    event : String,
    event_data : String,
    created_at: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('events', Event);