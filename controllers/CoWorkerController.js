/**
 * Created by SK on 10/22/2017.
 */
var Response = require('../utils/Response');
var AccountModel = require('../models/Accounts');
var Mail = require('../services/Mail');
var jwt = require('jsonwebtoken');
var Config = require('../config/general');
var Crypto = require('crypto');
var mongoose = require('mongoose');

const InviteController = {
    getCoWorkers: function (req, res) {
        let accountId = req.params.clientId;
        let account;
        AccountModel.findOne({_id: accountId})
            .then(res => {
                account = res;
                let query = {$or: [{_id: accountId}, {groupId: accountId}]};
                if (account.groupId) {
                    query.$or.push({groupId: account.groupId}, {_id: account.groupId});
                }
                return AccountModel.find(query)
            })
            .then(data => {
                if (data) {
                    Response.success(res, 'Successfully returned.', {user: account, data: data});
                } else {
                    Response.noData(res, 'Not found.');
                }
            });
    },
    edit: function (req, res) {
        var coworker = req.body;
        AccountModel.update({_id: coworker._id}, {
            $set: {
                name: coworker.name,
                email: coworker.email,
                category: coworker.category
            }
        })
            .then((err, response) => {
                Response.success(res, 'Successfully updated.');
            })
    },
    delete: function (req, res) {
        var coWorkerId = req.params.coWorkerId;
        AccountModel.remove({_id: coWorkerId})
            .then((err, response) => {
                Response.success(res, 'Successfully removed.');
            })
    }
};

module.exports = InviteController;