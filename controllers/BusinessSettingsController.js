let ClientExpense = require('../models/ClientExpense');
let ClientPayment = require('../models/ClientPayment');
var Response = require('../utils/Response');
var DeliverySettings = require('../models/DeliverySettings');

const BusinessSettingsController = {
    getClientExpenses: function (req, res, next) {
        let clientId = req.cookies.userId;

        if (!clientId) {
            return Response.badRequest(res);
        }

        return ClientExpense.find({ accountId: clientId.toObjectId() }).sort({ date: -1 })
            .then(data => {
                if (data) {
                    Response.success(res, 'Successfully returned.', data);
                } else {
                    Response.noData(res, 'Not found.');
                }
            });
    },

    getClientPayments: function (req, res, next) {
        let clientId = req.cookies.userId;

        if (!clientId) {
            return Response.badRequest(res);
        }

        return ClientPayment.find({ accountId: clientId.toObjectId() }).sort({ date: -1 }).then(data => {
            if (data) {
                Response.success(res, 'Successfully returned.', data);
            } else {
                Response.noData(res, 'Not found.');
            }
        });
    },
    updatePickupSettings: function(req, res) {
        try {
            var addresses = req.body.addresses;
            let accountId = req.params.clientId;
            //var userToken = jwt.verify(req.body.token, Secret.key);

            DeliverySettings.update(
                { clientId: accountId.toObjectId() }, 
                { $set: { addresses: addresses }},
                {
                    upsert: true,
                    setDefaultsOnInsert: true,
                    new: true
                })
            .then((err, response) => {
                Response.success(res, 'Successfully Update Notification Settings');
            })
        } catch (err) {
            Response.badRequest(res, 'Invalid token or expired.');
        }
    },
    getPickupSettings: function(req, res) {
        let accountId = req.params.clientId;
        DeliverySettings.findOne({clientId: accountId.toObjectId()})
            .then(data => {
                if (data) {
                    Response.success(res, 'Successfully returned.', {addresses: data.addresses});
                } else {
                    Response.noData(res, 'Not found.');
                }
        })
    }
};

module.exports = BusinessSettingsController;