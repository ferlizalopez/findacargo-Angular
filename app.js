var express = require('express'),
    exphbs = require('express-handlebars'),
    logger = require('morgan'),
    cookieParser = require('cookie-parser'),
    bodyParser = require('body-parser'),
    methodOverride = require('method-override'),
    exphbs = require('express-handlebars'),
    _ = require('lodash'),
    async = require('async'),
    session = require('express-session'),
    jwt = require('jsonwebtoken'),
    passport = require('passport'),
    passportJWT = require("passport-jwt"),
    FacebookStrategy = require('passport-facebook'),
    bcrypt = require('bcryptjs'),
    crypto = require('crypto'),
    Promise = require('promise'),
    secret = require('./config/secret'),
    mongoose = require('mongoose'),
    Mail = require('./services/Mail'),
    mailgun = require('./services/mailgun_api'),
    Config = require('./config/general'),
    path = require('path'),
    db = require('./config/db-connector'),
    //db = require('./config/db'),
    ApiUrl = require('./services/ApiUrl'),
    request = require('request'),
    Mail = require('./services/Mail');

var ExtractJwt = passportJWT.ExtractJwt;
var JwtStrategy = passportJWT.Strategy;

var jwtOptions = {}
jwtOptions.jwtFromRequest = ExtractJwt.fromAuthHeader();

//Controllers
var InviteController = require('./controllers/InviteController');
var CoWorkerController = require('./controllers/CoWorkerController');
var ScheduledDeliveriesController = require('./controllers/ScheduledDeliveriesController');
var UploadController = require('./controllers/UploadController');
var AccountController = require('./controllers/AccountController');
var UserSettingsController = require('./controllers/UserSettingsController');
var BusinessSettingsController = require('./controllers/BusinessSettingsController');
var ServiceController = require('./controllers/ServiceController');
var DeliveryRatingController = require('./controllers/DeliveryRatingController');

//Models definition
var Accounts = require('./models/Accounts');
var Departments = require('./models/Departments');
var DeliverySettings = require('./models/DeliverySettings');

//var config = require('config.js'); // config file contains all tokens and other private info
// var funct = require('auth.js'); // funct file contains our helper functions for our Passport and database work

var app = express();

// Express configuration
app.use(logger('combined'));
app.use(cookieParser());
app.use(bodyParser.json({limit: '50mb', extended: true, parameterLimit:50000}));
app.use(bodyParser.urlencoded({limit: '50mb', extended: true, parameterLimit:50000}));
app.use(bodyParser.raw({limit: "50mb", extended: true, parameterLimit:50000}));
//app.use(bodyParser.json());
app.use(bodyParser.json({limit:1024102420, type:'application/json'}));
app.use(methodOverride('X-HTTP-Method-Override'));

// Enable CORS from client-side
app.use(function (req, res, next) {
    res.header("Access-Control-Allow-Origin", "*");
    res.header('Access-Control-Allow-Methods', 'PUT, GET, POST, DELETE, OPTIONS');
    res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept, Authorization, Access-Control-Allow-Credentials");
    res.header("Access-Control-Allow-Credentials", "true");
    next();
});

function ensureObjectId(value) {
    return typeof value === 'string' ? value.toObjectId() : value;
}

function ensureToken(req, res, next) {
    var bearerHeader = req.cookies.token;
    if (bearerHeader) {
        if (typeof bearerHeader !== 'undefined') {
            var bearer = bearerHeader.split(" ");
            var bearerToken = bearer[1];
            req.token = bearerToken;
            next();
        } else {
            res.redirect('/login');
        }
    } else {
        res.redirect('/login');
    }
}

app.use(express.static('views'))

// Configure express to use handlebars templates
var hbs = exphbs.create();
app.engine('handlebars', hbs.engine);
app.set('view engine', 'handlebars');

var port = process.env.PORT || 3551; //select your port or let it pull from your .env file

app.get('/', ensureToken, function (req, res, next) {
    res.sendFile('index.html', { root: path.join(__dirname, 'views') });
});

app.get('/register', function (req, res) {
    res.render('register');
});

app.get('/login', function (req, res) {
    res.render('login');
});

app.post('/register', function (req, res, next) {
    /*mailgun.validate(req.body.email)
    .then(result => {

        if (!result.status)
            res.render('register', { emailerrormessage: result.msg });*/
    let email = req.body.email
    let password = req.body.password;
    let confirmpassword = req.body.confirmpassword;
    let reqObj = {
        email: email,
        password: password,
        confirmpassword: confirmpassword
    }
    if (!email) {
        return res.render('register', { reqObj: reqObj, emailRequiredMessage: "Email field should not be blank!" });
    } else if (email) {
        let lastAtPos = email.lastIndexOf('@');
        let lastDotPos = email.lastIndexOf('.');
        if (email.search("@") === -1) {
            return res.render('register', { reqObj: reqObj, emailErrorMessageInvalid: "Enter a valid email addres." });
        } else if (!(lastAtPos < lastDotPos && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
            return res.render('register', { reqObj: reqObj, emailErrorMessageInvalid: "Enter a valid email addres." });
        } else if (!(lastAtPos < lastDotPos && lastAtPos > 0 && email.indexOf('@@') === -1 && lastDotPos > 2 && (email.length - lastDotPos) > 2)) {
            return res.render('register', { reqObj: reqObj, emailErrorMessageInvalid: "Enter a valid email address." });
        }
    }

    if (!password) {
        return res.render('register', { reqObj: reqObj, passwordErrorMessageRequired: "password field should not be blank!" });
    }

    if (!confirmpassword) {
        return res.render('register', { reqObj: reqObj, confirmPasswordErrorMessageRequired: "Confirm password field should not be blank!" });
    }

    if (req.body.password !== req.body.confirmpassword) {
        return res.render('register', { reqObj: reqObj, passwordErrorMessageNotMatch: "Passwords does not match." });
    }

    crypto.randomBytes(16, function (err, buffer) {
        let user = new Accounts();
        user.email = req.body.email;
        user.scheduledClient = "1";
        user.buyer = "1";
        user.apikey = buffer.toString('hex');

        if (err) {
            return res.status(500).send(err);
        }

        bcrypt.hash(req.body.password, 10, function (err, hash) {
            user.password = hash;
            user.save(function (err, user) {
                if (err) {
                    // if (err.errmsg && err.errmsg.split(':')[0] == "E11000 duplicate key error collection") {
                    return res.render('register', { reqObj: reqObj, errorResponseForDuplicate: 'Email already registered, Please register with different email.' });
                    // } else {
                    //     return res.render('register', { reqObj: reqObj, errorResponse: 'Something went wrong, Please try again.' });
                    // }
                } else {
                    // create default user settings
                    request({
                        headers: {
                            'Token': user.apikey
                        },
                        uri: ApiUrl.getApiUrl(req.headers.host) + '/v1/settings/config/default',
                        method: 'POST'
                    }, function (err, resp, bd) {
                        //console.log(resp)
                        if (err) {
                            return res.status(500).send(err);
                        }

                        request({
                            headers: {
                                'Token': user.apikey
                            },
                            uri: ApiUrl.getApiUrl(req.headers.host) + '/v1/departments/create/default',
                            method: 'POST'
                        }, function (err, resp, bd) {
                            // console.log(resp)
                            if (err) {
                                return res.status(500).send(err);
                            }

                            var message = Mail.signupMsg(user, Config.salesEmail);
                            Mail.setOptions(Config.salesEmail, `A new user has signed up at IDAG`, message, cb => {
                                Mail.send();
                            });
                            bcrypt.compare(req.body.password, user.password, function (err, valid) {
                                if (err) { return res.render('register', { failed: true }); }
                                if (!valid) { return res.render('register', { failed: true }); }

                                var token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, secret.key);
                                Departments.findOne({ companyId: user._id })
                                    .exec(function (err, data) {
                                        if (err) { console.log("\n\nerror while fetching departments\n\n"); }
                                        if (data) {
                                            delete data._id;
                                            res.cookie('departmentData', JSON.stringify(data));
                                        }
                                        res.cookie('token', token);
                                        res.cookie('userId', user._id.toString());
                                        res.cookie('email', user.email);
                                        res.cookie('name', user.name);
                                        res.cookie('apikey', user._doc.apikey);
                                        res.cookie('approved', user.approved);
                                        res.cookie('message', 'Logged in successfully!!!!!!!!!!');
                                        return res.redirect('/#!/home');
                                    });
                            });

                            // res.render('login', { message: 'Registration Successful, please login.' });
                        });
                    });
                }
            })
        })
    });
});

app.post('/login', function (req, res, next) {
    //console.log("login req ", req)
    Accounts.findOne({ email: req.body.email.toLowerCase() })
        .select('password').select('email').select('apikey').select('name').select('approved').select('groupId').select('carrier')
        .exec(function (err, user) {
            if (err) { return res.status(401).send('Account does not exist'); }
            //console.log("login", user)
            if (!user || user.carrier) {
                return res.render('login', { failed: true });
            }

            bcrypt.compare(req.body.password, user.password, function (err, valid) {
                if (err) { return res.render('login', { failed: true }); }
                if (!valid) { return res.render('login', { failed: true }); }
                var token = jwt.sign({ userId: user._id, email: user.email, name: user.name }, secret.key);
                var isCowrkerApproved = false;
                if (typeof user.groupId != 'undefined') {
                    var coworkerId = user.groupId;
                } else {
                    var coworkerId = user._id;
                }
                var coworkersArr = [];

                var objectClientId = ensureObjectId(coworkerId)
                Accounts.find({
                    $or: [
                        { 'groupId': coworkerId },
                        { '_id': coworkerId }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            if (conworkerID == coworkerId) {
                               isCowrkerApproved = coworkers[key].approved ? true : false;
                            }
                            coworkersArr.push(conworkerID);
                        }

                        Departments.find({
                            $or: [
                                { 'companyId': { $in: coworkersArr } }
                            ]
                        }, function (err, departmentData) {
                            //console.log("err, departmentData", err, departmentData, coworkersArr)
                            if (err) {
                                //nothing new 
                            } else {
                                var deptArr = [];

                                var coworkers = JSON.parse(JSON.stringify(departmentData));
                                var isDefault = false;
                                for (let key in coworkers) {
                                    //console.log("key", key)
                                    let dataDept = coworkers[key].departments;
                                    for (let keyIn in dataDept) {
                                        var item = _.find(deptArr, (item)=>{
                                            return item.name == dataDept[keyIn].name
                                        })

                                        if(item) continue;
                                        deptArr.push(dataDept[keyIn]);
                                        // if (dataDept[keyIn].default == false || isDefault == false) {
                                        //     deptArr.push(dataDept[keyIn]);
                                        // }
                                        // if (dataDept[keyIn].default == true) {
                                        //     isDefault = true;
                                        // }
                                    }
                                }
                                //console.log('deptArr', deptArr)
                                var departments = { departments: deptArr };
                                if (err) { console.log("\n\nerror while fetching departments\n\n"); }
                                if (departments) {
                                    console.log("departments", departments, JSON.stringify(departments))
                                    res.cookie('departmentData', JSON.stringify(departments));
                                }
                            }

                            //console.log('setting', setting)
                            //res.cookie('allowReturn', setting.allow_return);
                            res.cookie('token', token);
                            res.cookie('userId', user._id.toString());
                            res.cookie('email', user.email);
                            res.cookie('name', user.name);
                            res.cookie('apikey', user._doc.apikey);
                            if (isCowrkerApproved) {
                                res.cookie('approved', true);
                                Accounts.findByIdAndUpdate(
                                    user._id,
                                    {'approved' : true},
                                    
                                    {new: true},
                                    
                                    (err, todo) => {
                                        //console.log(err);
                                        //console.log(todo);
                                    }
                                )    
                            } else {
                                res.cookie('approved', user.approved);
                            }
                            res.cookie('message', 'Logged in successfully');
                            res.redirect('/#!/home');
                        })
                    }
                });
            });
        });
});

app.get('/forgot-password', function (req, res, next) {
    res.render('forgot');
});

app.post('/forgot-password', function (req, res, next) {
    async.waterfall([
        function (done) {
            Accounts.findOne({
                email: req.body.email
            }).exec(function (err, user) {
                if (user) {
                    done(err, user);
                } else {
                    return res.render('forgoterror', { message: 'User not found. Enter correct email address.' });
                }
            });
        },
        function (user, done) {
            // create the random token
            crypto.randomBytes(20, function (err, buffer) {
                var token = buffer.toString('hex');
                done(err, user, token);
            });
        },
        function (user, token, done) {
            Accounts.findById(user._id).then((model) => {
                return Object.assign(model, { resetpasswordtoken: token });
            }).then((model) => {
                return model.save();
            }).then((updatedModel) => {
                done('', token, updatedModel);
            }).catch((err) => {
                return res.render('forgoterror', { message: err })
            })
        },
        function (token, user, done) {
            var hostname = req.headers.host;
            var apiurl;
            if (hostname === 'dev.my.nemlevering.dk') {
                apiurl = 'http://dev.my.nemlevering.dk';
            } else if (hostname === 'my.nemlevering.dk') {
                apiurl = 'https://my.nemlevering.dk';
            } else if (hostname === 'localhost') {
                apiurl = 'http://localhost:3551';
            } else {
                apiurl = 'http://10.0.53.90:3551';
            }
            var link = apiurl + '/reset-password?token=' + token;
            var message = Mail.forgotPassMsg(user, token, link);
            Mail.setOptions(user.email, 'Change password request on IDAG', message, cb => {
                Mail.send();
            })

            return res.render('changePassSent');
        }
    ], function (err) {
        return res.render('forgoterror', { message: err });
    });
});

app.get('/reset-password', function (req, res, next) {
    res.render('reset-password');
});

app.post('/reset-password', function (req, res, next) {
    //console.log("req.body.newPassword", req)
    Accounts.findOne(
        {resetpasswordtoken: req.body.token}
        //req.cookies.userId
    ).exec(function (err, user) {
        //console.log("err reset password", err);
        //console.log("user reset password", user)
        if (!err && user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                    user.password = hash;
                    user.resetpasswordtoken = undefined;
                    user.save(function (err) {
                        if (err) {
                            return res.render('forgoterror', { message: 'Error saving the new password.' });
                        } else {
                            // res.render('login', { changed: 'Password changed. Login here.' });
                            res.redirect('/login')
                        }
                    });
                })

            } else {
                return res.render('forgoterror', { message: 'Passwords do not match.' })
            }
        } else {
            return res.render('forgoterror', { message: 'Password reset token is invalid or has expired.' })
        }
    });
});

app.post('/change-password', function (req, res, next) {
    //console.log("req.body.newPassword", req)
    Accounts.findById(
        req.cookies.userId
    ).exec(function (err, user) {
        //console.log("err reset password", err);
        //console.log("user reset password", user)
        if (!err && user) {
            if (req.body.newPassword === req.body.verifyPassword) {
                bcrypt.hash(req.body.newPassword, 10, function (err, hash) {
                    user.password = hash;
                    user.resetpasswordtoken = undefined;
                    user.save(function (err) {
                        if (err) {
                            return res.render('forgoterror', { message: 'Error saving the new password.' });
                        } else {
                            // res.render('login', { changed: 'Password changed. Login here.' });
                            res.redirect('/login')
                        }
                    });
                })

            } else {
                return res.render('forgoterror', { message: 'Passwords do not match.' })
            }
        } else {
            return res.render('forgoterror', { message: 'Password reset token is invalid or has expired.' })
        }
    });
});

app.get('/logout', function (req, res, next) {
    res.clearCookie('token');
    res.clearCookie('userId');
    res.clearCookie('email');
    res.clearCookie('name');
    res.clearCookie('approved');
    res.clearCookie('apikey');
    res.clearCookie('departmentData');
    res.redirect('/login');
});

app.get('/statisticsData', function (req, res, next) {
    var start = req.query.start;
    var end = req.query.end;
    ScheduledDeliveriesController.statsBetweenDateRange(
        {
            userId: (req.cookies['userId']).toObjectId(),
            start: start,
            end: end,
            deleted:{$ne:true}
        }, function (error, data) {
            if (error) {
                res.status(404).send(
                    {
                        error_code: 1,
                        description: err.description
                    });
            }
            else {
                res.status(200).send(
                    {
                        error_code: 0,
                        statsData: data
                    });
            }
        });
});

app.post('/invite', ensureToken, InviteController.invite);
app.post('/re-invite', ensureToken, InviteController.resendInvite);
app.get('/co-workers/:clientId', ensureToken, CoWorkerController.getCoWorkers);
app.delete('/co-worker/:coWorkerId', ensureToken, CoWorkerController.delete);
app.put('/co-worker/:coWorkerId', ensureToken, CoWorkerController.edit);
app.put('/invite/changepass', ensureToken, InviteController.changePass);
app.put('/set-delivery-boxes/:deliveryid', ensureToken, ScheduledDeliveriesController.set_delivery_boxes);
app.put('/set-delivery-printed/:deliveryid', ensureToken, ScheduledDeliveriesController.set_delivery_printed);
app.put('/set-delivery-date/:deliveryid', ensureToken, ScheduledDeliveriesController.set_delivery_date);
app.put('/set-delivery-department/:deliveryid', ensureToken, ScheduledDeliveriesController.set_delivery_department);
app.get('/weekly_deliveries/:type/:department?', ensureToken, ScheduledDeliveriesController.get_weekly_deliveries);
app.get('/daily_deliveries/:year/:weeknumber/:day/:department?', ensureToken, ScheduledDeliveriesController.get_daily_deliveries);
app.get('/daily_deliveries_statistics/:year/:weeknumber/:day', ensureToken, ScheduledDeliveriesController.get_daily_deliveries_statistics);
app.get('/delivery_settings', ensureToken, ScheduledDeliveriesController.get_delivery_settings);
app.get('/deliverydetails/:deliveryid', ScheduledDeliveriesController.get_delivery_details);
app.get('/get-finished-deliveries', ScheduledDeliveriesController.get_finished_deliveries);
app.get('/get-delivery-return-stats', ScheduledDeliveriesController.statsDeliveryAndReturn);
app.post('/insertdeliveries', ensureToken, ScheduledDeliveriesController.insertDeliveries);
app.get('/checkDeliveriesDefaultSettings', ensureToken, ScheduledDeliveriesController.checkDeliveriesDefaultSettings);
app.post('/UploadDeliveriesFromClient', UploadController.uploadFile);
app.post('/update_delivery/:deliveryid', ScheduledDeliveriesController.updateDelivery);
app.delete('/delete_delivery/:deliveryid', ScheduledDeliveriesController.deleteDelivery);
app.get('/get_client_expenses', BusinessSettingsController.getClientExpenses);
app.get('/get_client_payments', BusinessSettingsController.getClientPayments);
app.get('/account-info', ensureToken, AccountController.get_account_info);
app.get('/account-detail/:accountId', ensureToken, AccountController.get_account_detail);
app.get('/usersettings/notification-settings/:clientId', ensureToken, UserSettingsController.getNotificationSettings);
app.put('/usersettings/notification-settings/:clientId', ensureToken, UserSettingsController.updateNotificationSettings);
app.get('/pickup-settings/:clientId', ensureToken, BusinessSettingsController.getPickupSettings);
app.put('/pickup-settings/:clientId', ensureToken, BusinessSettingsController.updatePickupSettings);
app.get('/getServices', ServiceController.get);
app.get('/getDeliveryRatings', DeliveryRatingController.get);
app.get('/getNewKey', (req, res)=>{
    request({
        uri: ApiUrl.getApiUrl(req.headers.host) + '/exposed-api/createId/delivery',
        method: 'GET',
    }, function (err, resp, bd) {
        if(!err) {
            res.json(JSON.parse(bd).data)
        }
    })
});

app.post('/payment', ensureToken, AccountController.payment);

app.listen(port, function () {
    console.log('App listening on port ' + port);
});