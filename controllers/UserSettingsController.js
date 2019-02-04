var Response = require('../utils/Response');
var DeliverySettings = require('../models/DeliverySettings');
var jwt = require('jsonwebtoken');
var Secret = require('../config/secret');
var Crypto = require('crypto');

const UserSettingsController = {
    updateNotificationSettings: function(req, res) {
        try {
            var settings = req.body.settings;
            let accountId = req.params.clientId;
            //var userToken = jwt.verify(req.body.token, Secret.key);

            DeliverySettings.findOneAndUpdate(
                { clientId: accountId.toObjectId() }, 
                { $set: { 
                    allow_to_receive_daily_report: settings.allow_to_receive_daily_report, 
                    allow_to_receive_end_of_day_report: settings.allow_to_receive_end_of_day_report,
                    allow_to_receive_end_of_week_report: settings.allow_to_receive_end_of_week_report,
                    allow_to_receive_issue_report: settings.allow_to_receive_issue_report
                }},
                {upsert:true})
            .then((err, response) => {
                Response.success(res, 'Successfully Update Notification Settings');
            })
        } catch (err) {
            Response.badRequest(res, 'Invalid token or expired.');
        }
    },
    getNotificationSettings: function(req, res) {
        let accountId = req.params.clientId;
        DeliverySettings.findOne({clientId: accountId.toObjectId()})
            .then(data => {
                if (data) {
                    let settings = {
                        allow_to_receive_daily_report: data.allow_to_receive_daily_report, 
                        allow_to_receive_end_of_day_report: data.allow_to_receive_end_of_day_report,
                        allow_to_receive_end_of_week_report: data.allow_to_receive_end_of_week_report,
                        allow_to_receive_issue_report: data.allow_to_receive_issue_report
                    }
                    Response.success(res, 'Successfully returned.', {settings: settings});
                } else {
                    Response.noData(res, 'Not found.');
                }
        })
    }
};

module.exports = UserSettingsController;