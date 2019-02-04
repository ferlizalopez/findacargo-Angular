var Response = require('../utils/Response');
var Accounts = require('../models/Accounts');

String.prototype.toObjectId = function () {
    var ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};

const AccountController = {
    get_account_info: function (req, res, next) {
        var userObId = req.cookies.userId.toObjectId();
        Accounts.findOne({_id: userObId}).then((account) => {
            Response.success(res, 'Account info', {
                account: account
            });
        });
    },
    get_account_detail: function (req, res, next) {
        var userObId = req.params.accountId.toObjectId();
        Accounts.findOne({_id: userObId}).then((account) => {
            Response.success(res, 'Account info', {
                account: account
            });
        });
    },
    payment: function (req, res, next) {
        let stripe = require("stripe")("sk_live_QHcyOfgXJQp4j1ZSLOATOSh6");

        let token = req.body.stripeToken; // Using Express

        stripe.charges.create({
            amount: 11250,
            currency: "dkk",
            description: "IDAG payment",
            source: token,
        }, (err, charge) => {
            Response.success(res, 'Payment', {
                charge: charge,
                success: !err,
                error: err && err.message ? err.message : "Something went wrong"
            });
        });
    },
};

module.exports = AccountController;