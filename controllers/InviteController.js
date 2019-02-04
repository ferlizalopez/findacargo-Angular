/**
 * Created by jeton on 6/28/2017.
 */
var Response = require('../utils/Response');
var AccountModel = require('../models/Accounts');
var Mail = require('../services/Mail');
var jwt = require('jsonwebtoken');
var Config = require('../config/general');
var Secret = require('../config/secret');
var Crypto = require('crypto');
var async = require('async');
var ApiUrl = require('../services/ApiUrl');
var request = require('request');

const InviteController = {
    invite: function(req, res) {
        var encodedToken = jwt.verify(req.body.token, Secret.key);
        var members = req.body.members;

        var response = [];
        var asyncArray = [];

        for (let member of members) {
            var asyncFunction = function (callback) {
                member.groupId = encodedToken.userId;
                member.status = false;
                if (member.email) {
                    var query = { email: member.email};
                    AccountModel.findOne(query, function(e, founded) {
                        if (founded) {
                            response.push({status: 200, userAdded: founded, mailSent: false, "message": "Email already registered for "+ member.name});
                            callback(null, 'email-taken');
                        }
                        else {
                            Crypto.randomBytes(20, function(err, buffer) {
                                var token = buffer.toString('hex');
                                member.apikey = buffer.toString('hex');
                                member.resetpasswordtoken = token;
                            
                                AccountModel.create(member)
                                .catch(err => {
                                    //response.push({status: 200, mailSent: false, "message": err});
                                    //callback();
                                    return res.status(500).send(err);
                                })
                                .then(created => {
                                    var link = `${Config.domain}/reset-password/?token=${token}`;
                                    console.log(link);
                                    console.log(ApiUrl.getApiUrl(req.headers.host));
                                    request({
                                        headers: {
                                            'Token': member.apikey
                                        },
                                        uri: ApiUrl.getApiUrl(req.headers.host) + '/v1/settings/config/default',
                                        method: 'POST'
                                    }, function (err, resp, bd) {
                                        console.log(resp)
                                        if (err) {
                                            console.log(err);
                                        } else {
                                            console.log(resp);
                                        }
                                        request({
                                            headers: {
                                                'Token': member.apikey
                                            },
                                            uri: ApiUrl.getApiUrl(req.headers.host) + '/v1/departments/create/default',
                                            method: 'POST'
                                        }, function (err, resp, bd) {
                                            if (err) {
                                                console.log(err);
                                            } else {
                                                console.log(resp);
                                            }
                                        });
                                    });    

                                    var message = Mail.inviteMsg(member, encodedToken.email, link);
                                    Mail.setOptions(member.email, `You're invited to join ${encodedToken.email} 's company on IDAG`, message, cb => {
                                        var err = Mail.send();
                                        if (err) {
                                            response.push({status: 200, userAdded: created, mailSent: false});
                                            callback();
                                        } else {
                                            response.push({status: 200, userAdded: created, mailSent: true, "message": "User account created for "+ member.name});
                                            callback();
                                        }
                                    })
                                });
                            });
                        }
                    });
                }
            };
        asyncArray.push(asyncFunction);
        }
        async.parallel(asyncArray, function (error, done) {
            res.send(response);
        });
    },
    resendInvite: function(req, res) {
        var member = req.body.member;
        var userToken = jwt.verify(req.body.token, Secret.key);
        Crypto.randomBytes(20, function(err, buffer) {
            var token = buffer.toString('hex');
            AccountModel.update({ _id: member._id }, { $set: { resetpasswordtoken: token, status: true } })
                .then(updated => {
                    var link = `${Config.domain}/reset-password/?token=${token}`;
                    console.log(link);

                    var message = Mail.inviteMsg(member, userToken.email, link);
                    Mail.setOptions(member.email, `You're invited to join ${userToken.email} 's company on IDAG`, message, cb => {
                        Mail.send();
                    })
                });
        });
        Response.success(res, 'Successfully re-send invite.');
    },
    changePass: function(req, res) {
        try {
            var decoded = jwt.verify(req.body.token, Config.key);
            var pass = req.body.password;
            var hash = Crypto.createHmac('sha512', Config.key);
            hash.update(pass);
            pass = hash.digest('hex');
            AccountModel.update({ _id: decoded.user._id }, { $set: { pass: pass, status: true } })
                .then((err, response) => {
                    Response.success(res, 'Successfully changed the password.');
                })
        } catch (err) {
            Response.badRequest(res, 'Invalid token or expired.');
        }
        //
    }
};

module.exports = InviteController;