/* 
 * API Wrapper for MailGun to send emails
 * 
 * Author: Cashif
 * Date: 05.02.2016
 * 
 */
var http = require('https');
var qs = require('querystring');
var exports;

/*
 * ---------------------
 *  Account Settings
 * ---------------------
 */

var public_api_key = "pubkey-39e7b4737abaf1e20928dc4d35d41983"; 
var api_key = "key-52e3854a2fd0ebefea915d71ee3080d3";
var base_url = "api.mailgun.net";
var path = "/v3/findacargo.com/messages";
var DOMAIN = "findacargo.com"
var mailgun = require('mailgun-js')({ apiKey: public_api_key, domain: DOMAIN });

/*
 * Send an email
 */
exports.send = function(to, subject, msg, callback, from)
{
    var data = qs.stringify({
                from: from || 'Nemlevering <accounts@nemlevering.com>',
                to: to,
                subject: subject,
                html: msg
            });
    console.log(to, subject, msg, from);
    var request = http.request(
                           {
                               hostname: base_url,
                               path: path,
                               auth: 'api:' + api_key,
                               method: 'POST',
                               headers: {
                                    'Content-Type': 'application/x-www-form-urlencoded',
                                    'Content-Length': Buffer.byteLength(data)
                                }
                           }, 
                           function (response) {
                               //Callback takes err,success objects
                               if(response.statusCode == 200)
                                   callback(null, response.statusCode)
                               else{
                                  // console.log(response);
                                  callback("failed - status code: " + response.statusCode,null);
                               }
                                
                           });
    request.write(data);
    request.end();
}

exports.validate = function(email) {
    return new Promise((resolve, reject) => {
        mailgun.validate(email, function (error, body) {
            if (error)
                resolve({status: false, msg: "Mailgun does not response"});
            if (body.is_disposable_address)
                resolve({status: false, msg: "This address belongs to disposable email service"});
            if (body.is_role_address)
                resolve({status: false, msg: "This email is role-based"});
            if (body.is_valid)
                resolve({status: true});
        });
    })
}

module.exports = exports;
