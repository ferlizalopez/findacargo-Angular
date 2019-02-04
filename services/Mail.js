/**
 * Created by jeton on 6/29/2017.
 */
var api_key = 'key-52e3854a2fd0ebefea915d71ee3080d3';
var domain = 'nemlevering.dk';
var mailgun = require('mailgun-js')({apiKey: api_key, domain: domain});

var options = {
    from: 'IDAG <no-reply@goidag.com>',
    to: '',
    subject: '',
    text: ''
};

var Mail = {
    send: () => {
        mailgun.messages().send(options, function (error, body) {
            console.log(body);
            return error;
        });
    },
    setOptions: (sendTo, subject, html, callback) => {
        options.to = sendTo;
        options.subject = subject;
        options.html = html;
        callback();
    },
    inviteMsg: (member, user, link) => {
       return `${member.name} <br /><br />
        You're invited to join ${user}'s company on IDAG.<br />
        <br /><div>Nemlevering is a online and mobile app for cargo deliveries. <br />It helps you with all your business needs into one place, via web or mobile app.</div><div><br/></div><br/>
        <a href='${link}'>Click here to join</a><br /><br />
        -- The IDAG team <br/>support@goidag.com`;
    },
    signupMsg: (user, salesEmail) => {
        return `Hi, ${salesEmail} <br /><br />
         A new user has successfully signed up at IDAG <br /><br />
         ${user.email ? 'Email account: ' + user.email + '<br />' : ''}
         ${user.name ? 'User Name: ' + user.name + '<br />' : ''}
         ${user.phone ? 'Phone: ' + user.phone + '<br />' : ''}
         '<br /> -- The IDAG team <br/>support@goidag.com`;
     },
    forgotPassMsg:(user, token, link) => {
      return `Hello ${user.name} <br /><br />
        You have requested for a password reset on IDAG for email ${user.email}<br />
        <br /><div>Please click on the link below to change your password : <br /></div><div><br/></div><br/>
        <a href='${link}'>Click here to change the password</a><br /><br />
        -- The IDAG team <br/>support@goidag.com`;  
    } 
};

module.exports = Mail;