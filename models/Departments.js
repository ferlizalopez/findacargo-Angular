/**
 * Created by SK on 9/8/2017.
 */
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var DepartmentSchema = new Schema({
    departmentNames : [String],
    default : String,
    typeOfDelivery : String,
    companyId : Schema.Types.ObjectId,
    companyName : String
});


var departments = mongoose.model('departments', DepartmentSchema);
module.exports = departments;