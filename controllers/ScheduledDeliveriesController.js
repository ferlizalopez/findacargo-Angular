let Response = require('../utils/Response');
let routes = require('../models/Routes');
let DriverDelivery = require('../models/DriverDelivery');
let Truck = require('../models/Truck');
let Promise = require('promise');
let PostCodes = require('../models/PostCodes');
let Events = require('../models/Events');
let DeliverySettings = require('../models/DeliverySettings');
let DeliveryRatings = require('../models/DeliveryRatings');

var Accounts = require('../models/Accounts');


let nodeGeoCoder = require('node-geocoder');

const geoCoderKey = 'AIzaSyBmP1A3mxSdf5EH3zI0PIsDa2kUXiF2eao';
const coderOptions = {
    provider: 'google',
    httpAdapter: 'https',
    apiKey: geoCoderKey,
    formatter: null
};

const GeoCoder = nodeGeoCoder(coderOptions);
//let scheduleDeliveriesRepository = require('../models/scheduleDeliveriesRepository');

function capitalizeFirstLetter(string) {
    return string.charAt(0).toUpperCase() + string.slice(1);
}

String.prototype.toObjectId = function () {
    let ObjectId = (require('mongoose').Types.ObjectId);
    return new ObjectId(this.toString());
};
const DELIVRY_TYPE = "delivery";
const RETURN_TYPE = "return";

function getCoworkerIds(userId, cb) {
    var coworkersArr = [];
    Accounts.findOne({ _id: userId.toObjectId() }).then((account) => {

        if (typeof account.groupId != 'undefined') {
            Accounts.find({
                $or: [
                    { 'groupId': account.groupId },
                    { '_id': account.groupId }
                ]
            }, function (err, coworkers) {
                if (err) {
                    cb(err, coworkersArr)
                } else {
                    for (var key in coworkers) {
                        let conworkerID = coworkers[key]._id;
                        coworkersArr.push(conworkerID);
                    }
                    cb(null, coworkersArr)
                }
            });
        } else {
            Accounts.find({
                $or: [
                    { 'groupId': userId },
                    { '_id': userId.toObjectId() }
                ]
            }, function (err, coworkers) {
                if (err) {
                    cb(err, coworkersArr)
                } else {
                    for (var key in coworkers) {
                        let conworkerID = coworkers[key]._id;
                        coworkersArr.push(conworkerID);
                    }

                    cb(null, coworkersArr)
                }
            });
        }
    });
}

function fetchDeliveryData(coworkersArr, res, departmentName, deliveryType) {
    let typeCondition = {};

    if (deliveryType==RETURN_TYPE) {
        typeCondition['type']=RETURN_TYPE;
    }
    else {
        typeCondition['type']= { "$ne": RETURN_TYPE };
    }

    if (typeof departmentName == 'undefined') {
        var matchCondition = {
            $match: {
                deliverydate: { "$ne": null },
                creator: { $in: coworkersArr },
                //  department : 'Default'
                type: typeCondition['type']
            },
        };
    } else {
        var departments = [departmentName]
        if(departmentName == 'Default') {
            departments = [departmentName, '']
        } 
        
        var matchCondition = {
            $match: {
                deliverydate: { "$ne": null },
                creator: { $in: coworkersArr },
                department: { $in: departments },
                type: typeCondition['type']
            },
        };
    }
    let deliveries = routes.aggregate([matchCondition, {
        $group: {
            _id: {
                year: {
                    $year: "$deliverydate"
                },
                weekNumber: "$weekNumber"
            },
            daysofweek: {
                $push: "$deliverydayofweek"
            },
            deliverywindows: {
                $push: {deliveryWindowStart:"$deliverywindowstart", deliveryWindowEnd:"$deliverywindowend"}
            }
        }
    }, {
            $sort: {
                _id: 1
            }
        }],
        function (err, result) {
            if (err) {
                console.error(err);
                //res.status(500).send("Error while getting deliveries from database.");
                Response.dbError(res, "Error while getting deliveries from database.")
            }

            result.sort(function (a, b) {
                return a._id.year - b._id.year || parseInt(a._id.weekNumber) - parseInt(b._id.weekNumber);
            });

            //res.json(result);
            Response.success(res, 'Success', result);
        }
    );
}

function fetchDeliveriesByStatus(searchTerm, coworkersArr, res, departmentName, deliveryType, status) {
    let typeCondition = {};

    if (deliveryType==RETURN_TYPE) {
        typeCondition['type']=RETURN_TYPE;
    }
    else {
        typeCondition['type']= { "$ne": RETURN_TYPE };
    }
    
    if (typeof departmentName == 'undefined') {
        var matchCondition = {
            $match: {
                deliverydate: { "$ne": null },
                creator: { $in: coworkersArr },
                //  department : 'Default'
                type: typeCondition['type'],
                // status:status
            },
        };
    } else {
        var matchCondition = {
            $match: {
                deliverydate: { "$ne": null },
                creator: { $in: coworkersArr },
                department: departmentName,
                type: typeCondition['type'],
                // status:status
            },
        };
    }

    if (searchTerm&&searchTerm.length>0) {
        //let keywordQuery = {};
        if (typeof searchTerm == 'string') {
            let regex = {'$regex':searchTerm, '$options' : 'i' }
            matchCondition['$match'].$or = [
                { deliveryid: regex }
                // { recipientid: regex },
                // { recipientname: regex },
                // { deliveryaddress: regex }
            ];
        }
        
        //matchCondition['$match'].deliveryid={'$regex':searchTerm, '$options' : 'i' }
    }

    let deliveries = routes.aggregate([matchCondition, {
            $sort: {
                // created: -1
                "deliveryid" : 1
            }
        }],
        function (err, result) {
            if (err) {
                console.error(err);
                //res.status(500).send("Error while getting deliveries from database.");
                Response.dbError(res, "Error while getting deliveries from database.")
            }
            //res.json(result);
            Response.success(res, 'Success', result);
        }
    );
}

function getDailyDeliveries(req, res, criteria) {
    let dayDeliveries = routes.find(criteria).skip(parseInt(req.query.offset)).limit(parseInt(req.query.limit));
    let postCodes = [];
    let deliveries = [];
    PostCodes.find({})
        .then((result) => {
            if (result) {
                postCodes = result;
            }
            return dayDeliveries;
        }).then((result) => {
            deliveries = result.map((item) => {
                let zone = postCodes.find((postCode) => (postCode.ZIP == item.deliveryzip));
                item._doc.zone = zone ? zone.AREA + zone.ZONE : '';
                return item;
            });
            deliveries.forEach((item, index) => {
                if (item.status && parseInt(item.status) === 3) {
                    switch (item.status) {
                        case 1:
                            if (item.estimated_delivery_time) {
                                deliveries[index]._doc.statusTime = "Delivery at " + item.estimated_delivery_time;
                            }
                            break;
                        case 3:
                            if (item.delivered_at) {
                                deliveries[index]._doc.statusTime = "Delivered at " + item.delivered_at;
                            }
                            break;
                    }
                }
            });

            Response.success(res, 'Got Deliveries', {
                deliveries: deliveries
            });
        });
}

function getMonthlyStatis(req, res, criteria, departmentName) {
    var matchCondition = {
        $match:criteria,
    };

    routes.aggregate([matchCondition, {
        $group:{
            _id:{$month:"$deliverydate"},
            counts:{$sum:1}
        }
    }],
    function (err, result) {
        if (err) {
            console.error(err);
            //res.status(500).send("Error while getting deliveries from database.");
            Response.dbError(res, "Error while getting deliveries from database.")
        }

        //res.json(result);
        Response.success(res, 'Success', result);
    }
);
}


function fetchDeliveryDetails(req, res, coworkersArr, deliveryObjId) {
    let result = null;
    let returned_result = null;
    let rating_result = null;
    routes.findOne({ '_id': deliveryObjId, /*'creator': { $in: coworkersArr }*/ })
        .then(delivery => {
            //console.log("delivery", delivery, deliveryObjId, coworkersArr)
            result = delivery
            let zone = ''
            if (!delivery) {
                res.status(400).send('No delivery with this ID');
            } else {
                routes.find({'returned_delivery_id':  deliveryObjId})
                .then(returnedArray => {
                    if (returnedArray) {
                        returned_result = returnedArray;
                    }
                    else {
                        returned_result = null;
                    }
                    return DriverDelivery.findOne({ 'delivery_id': delivery._id.toString() })
                })
                .then((driver)=>{
                    return PostCodes.find({}).then(postCodes=>{
                        var zoneObj = postCodes.find((postCode) => (postCode.ZIP == delivery.deliveryzip));
                        zone = zoneObj ? zoneObj.AREA + zoneObj.ZONE : ''
                        return driver;    
                    })
                })
                .then(driver => {
                    if (!driver) {
                        return null;
                    }
                    result.driver = driver;
                    return DeliveryRatings.findOne({'delivery_id': deliveryObjId})
                })
                .then(rating => {
                    rating_result = rating;
                    if(result.driver)
                        return Truck.findOne({ 'userID': result.driver.carrier_id.toObjectId() });
                    else 
                        return null;    
                })
                .then(truck => {
                    //delete result.driver;
                    
                    if (truck === null) {
                        return Response.success(res, 'Success', {
                            returned: returned_result,
                            delivery: result,
                            truck: truck,
                            rating: rating_result,
                            zone
                        });
                    } else {
                        Accounts.findOne({ _id: truck.userID }).then((account) => {

                            return Response.success(res, 'Success', {
                                returned: returned_result,
                                delivery: result,
                                truck: truck,
                                rating: rating_result,
                                driver: account,
                                zone
                            });
                        });
                    }
                })
                .catch(function (err) {
                    console.log(err)
                    return Response.dbError(res, 'Error fetching delivery data. Error 500.')
                });
            }
        })
}
const ScheduledDeliveriesController = {
    get_daily_deliveries: function (req, res, next) {
        let userObId = req.cookies.userId.toObjectId();
        let departmentName = req.params.department ? req.params.department : null;

        let type = req.query.type;

        if (!type) {
            type = DELIVRY_TYPE;
        }
        getCoworkerIds(req.cookies.userId, (err, coworkerIds)=>{
            if(err) {
                Response.error(res, 'Invalid user');
                return
            }

            let criteria = {
                //type: type
            };
    
            if (type==RETURN_TYPE) {
                criteria['type']=RETURN_TYPE;
            }
            else {
                criteria['type']= { "$ne": RETURN_TYPE };
            }
    
            if (req.params) {
                criteria.weekNumber = req.params.weeknumber;
                criteria.deliverydayofweek = capitalizeFirstLetter(req.params.day);
    
                let year = parseInt(req.params.year);
                let start = new Date(year, 0, 1);
                let end = new Date(year + 1, 0, 1);
    
                criteria.deliverydate = {
                    $gte: start,
                    $lt: end
                };
            }
    
            if (req.query.status) {
                criteria.status = req.query.status;
            }
    
            if (req.query.printed) {
                criteria.printed = parseInt(req.query.printed) === 1
                    ? true
                    : { $ne: true }
            }
            criteria.creator = { $in: coworkerIds };
            if (departmentName) {
                let departments = (departmentName == 'Default'?['Default','']:[departmentName])
                criteria['department'] = {$in:departments}
            }
            getDailyDeliveries(req, res, criteria);
        })
    },
    get_daily_deliveries_statistics: function (req, res, next) {
        let userObId = req.cookies.userId.toObjectId();
        let type = req.query.type;
        let department = req.query.department;

        getCoworkerIds(req.cookies.userId, (err, coworkerIds)=>{
            if(err) {
                Response.error(res, 'Invalid user');
                return
            }

            if (!type) {
                type = DELIVRY_TYPE;
            }
    
            let criteria = {
                //type: type
            };
    
            if (type==RETURN_TYPE) {
                criteria['type']=RETURN_TYPE;
            }
            else {
                criteria['type']= { "$ne": RETURN_TYPE };
            }
            
            if(department) {
                let departments = (department == 'Default'?['Default','']:[department])
                criteria['department'] = {$in:departments}
            }
    
            if (req.params) {
                criteria.weekNumber = req.params.weeknumber;
                criteria.deliverydayofweek = capitalizeFirstLetter(req.params.day);
    
                let year = parseInt(req.params.year);
                let start = new Date(year, 0, 1);
                let end = new Date(year + 1, 0, 1);
    
                criteria.deliverydate = {
                    $gte: start,
                    $lt: end
                };
            }
            criteria.creator = {$in:coworkerIds};
    
            let deliveries = [];
            //console.log('criteria', criteria)
            routes.find(criteria).then((result) => {
                deliveries = result;
    
                return Events.find({
                    assigned_to: { $in: deliveries.map((item) => item._id) },
                    event_data: '3',
                    event: "STATUS_UPDATE",
                    assigned_to_type: "SCHEDULED_DELIVERY"
                }).limit(1).sort({ created_at: -1 });
            }).then((events) => {
                let finished = deliveries.filter((item) => (parseInt(item.status) === 3)).length;
                let last_delivery = events.length > 0 ? events[0].created_at.getHours() + ":" + events[0].created_at.getMinutes() : '';
    
                Response.success(res, 'Got Deliveries Statistics', {
                    delivered: finished + '/' + deliveries.length,
                    complete: Math.ceil((finished * 100) / deliveries.length),
                    last_delivery: last_delivery,
                    total: deliveries.length
                });
            });
        })
    },

    get_weekly_deliveries: function (req, res, next) {
        let userObId = req.cookies.userId.toObjectId();
        let type = req.params.type;
        let departmentName = req.params.department;
        console.log(departmentName);
        if (!type) {
            type = DELIVRY_TYPE;
        }
        getCoworkerIds(req.cookies.userId, (err, coworkerIds)=>{
            if(err) {
                Response.error(res, 'Invalid user');
                return
            }

            fetchDeliveryData(coworkerIds, res, departmentName, type);
        })
    },
    get_delivery_details: function (req, res, next) {
        console.log("get delivery details+++++++++++++++++", req.params)
        let deliveryObjId = req.params.deliveryid.toObjectId();
        let userObId = req.cookies.userId.toObjectId();
        if (!userObId || !deliveryObjId) {
            Response.error(res, 'No required params');
            return false;
        }
        var coworkersArr = [];
        Accounts.findOne({ _id: userObId })
        .then((account) => {
            if (typeof account.groupId != 'undefined') {
                Accounts.find({
                    $or: [
                        { 'groupId': account.groupId },
                        { '_id': account.groupId }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            coworkersArr.push(conworkerID);
                        }
                        fetchDeliveryDetails(req, res, coworkersArr, deliveryObjId)
                    }
                });
            } else {
                Accounts.find({
                    $or: [
                        { 'groupId': userObId },
                        { '_id': userObId }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            coworkersArr.push(conworkerID);
                        }
                        fetchDeliveryDetails(req, res, coworkersArr, deliveryObjId)
                    }
                });
            }
            
        })
    },

    get_finished_deliveries: function (req, res, next) {
        let userObId = req.cookies.userId.toObjectId();
        let type = req.params.type;
        let departmentName = req.params.department;
        let searchTerm = req.query.query;
        //console.log(departmentName);
        if (!type) {
            type = DELIVRY_TYPE;
        }
        var coworkersArr = [];
        Accounts.findOne({ _id: userObId }).then((account) => {

            if (typeof account.groupId != 'undefined') {
                Accounts.find({
                    $or: [
                        { 'groupId': account.groupId },
                        { '_id': account.groupId }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            coworkersArr.push(conworkerID);
                        }
                        fetchDeliveriesByStatus(searchTerm, coworkersArr, res, departmentName, type, 3);
                    }
                });
            } else {
                Accounts.find({
                    $or: [
                        { 'groupId': userObId },
                        { '_id': userObId }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            coworkersArr.push(conworkerID);
                        }

                        fetchDeliveriesByStatus(searchTerm, coworkersArr, res, departmentName, type, 3);
                    }
                });
            }
        });
    },

    checkDeliveriesDefaultSettings: function (req, res, next) {
        var apikey = req.cookies.apikey;
        let clientId = req.cookies.userId;

        Accounts.findOne({ _id: clientId }).then((account) => {

            if (typeof account.groupId !== 'undefined') {
                clientId = account.groupId;
            }
            if (!clientId) {
                Response.error(res, 'No Client ID');
                return false;
            }

            DeliverySettings.findOne({ clientId: clientId })
                .then(result => {
                    if (result && result.addresses.length > 0) {
                        return res.json({ status: true, error: "Settings are set" });
                    } else {
                        return res.json({ status: false, error: "Please set your default pick up address from admin settings and confirm the administrator of the account or support@goidag.com" });
                    }
                })
        })
    },

    insertDeliveries: function (req, res, next) {
        var apikey = req.cookies.apikey;
        let clientId = req.cookies.userId;
        var departmentName = '';
        var departMentData = req.cookies.departmentData ? req.cookies.departmentData : '';
        if (departMentData) {
            departMentData = JSON.parse(departMentData);
            for (i = 0; i < departMentData.departments.length; i++) {
                if (departMentData.departments[i].default == true) {
                    departmentName = departMentData.departments[i].name;
                    break;
                }
            }
        }
        Accounts.findOne({ _id: clientId }).then((account) => {

            if (typeof account.groupId !== 'undefined') {
                clientId = account.groupId;
            }
            if (!clientId) {
                Response.error(res, 'No Client ID');
                return false;
            }

            DeliverySettings.findOne({ clientId: clientId })
                .then(result => {
                    if (result && result.addresses.length > 0) {
                        for (i = 0; i < result.addresses.length; i++) {
                            if (result.addresses[i].default == true) {
                                var address = result.addresses[i].value;

                                var str_array = address.trim().split(',');
                                var address1 = str_array[0];
                                var CityPinArr = str_array[1].trim().split(' ');
                                var zip = CityPinArr[0];
                                var city = CityPinArr[1];

                                break;
                            }
                        }
                    } else {
                        return res.json({ status: false, error: "Please set your default pick up address from admin settings" });
                    }


                    var delivery_window_end = result.delivery_window_end ? result.delivery_window_end : '';
                    var delivery_window_start = result.delivery_window_start ? result.delivery_window_start : '';
                    // var pickup_deadline = result.pickup_deadline ? result.pickup_deadline : '';


                    let createRequest = new Promise(function (resolve, reject) {
                        let reqJSON = [];
                        for (let i = 0; i < req.body.length; i++) {
                            let data = req.body[i];
                            var pickup_deadline = data.pickup_deadline ? data.pickup_deadline : '';
                            var pickup_zip = data.pickup_zip ? data.pickup_zip : zip;
                            var pickup_city = data.pickup_city ? data.pickup_city : city;
                            var isDefaultPickup = data.pickup_location_address ? false : true;
                            var address_picup = data.pickup_location_address ? data.pickup_location_address : address1;

                            let tempJSON = {
                                "delivery_id": data.delivery_id ? data.delivery_id : '',
                                "recipient_id": data.recipient_id ? data.recipient_id : '',
                                "department": data.department_name ? data.department_name : departmentName,
                                "full_insurance": data.full_insurance ? data.full_insurance : '',
                                "full_insurance_value": data.full_insurance_value,
                                "recipient_name": data.recipient_name ? data.recipient_name : '',
                                "recipient_email": data.recipient_email ? data.recipient_email : '',
                                "delivery_date": data.delivery_date,
                                "recipient_phone": {
                                    "country_iso_code": "DK",
                                    "country_dial_code": "45",
                                    "phone": data.recipient_phone
                                },
                                //"pickup_deadline": pickup_deadline,
                                "pickup_window": {
                                    "from": (data.pickup_window_start ? (data.pickup_window_start || '08:00') : ''),
                                    "to": (data.pickup_window_end ? (data.pickup_window_end || '16:00') : '')
                                },
                                "delivery_location": {
                                    "description": "",
                                    "zip": data.delivery_zip,
                                    "city": data.delivery_city,
                                    "address_1": data.delivery_location_address,
                                    "address_2": data.delivery_address_2 ? data.delivery_address_2 : '',
                                    "latitude": "10",
                                    "longitude": "10"
                                },
                                "delivery_window": {
                                    /*"start": "08:00",
                                    "end": "16:00"*/
                                    "from": (data.delivery_window_start ? (data.delivery_window_start || '08:00') : ''),
                                    "to": (data.delivery_window_end ? (data.delivery_window_end || '16:00') : '')
                                },
                                "delivery_label": data.delivery_label ? data.delivery_label : '',
                                "delivery_notes": data.delivery_notes ? data.delivery_notes : '',
                                "delivery_number_of_packages": data.delivery_number_of_packages ? data.delivery_number_of_packages : '1',
                                "pickup_location": {
                                    "description": "",
                                    "zip": pickup_zip,
                                    "city": pickup_city,
                                    "address_1": address_picup,
                                    "latitude": "10",
                                    "longitude": "10"
                                },
                                "delivery_date": data.delivery_date,
                                "is_default_pickup": isDefaultPickup
                            }

                            reqJSON.push(tempJSON);

                            if (i === req.body.length - 1) {
                                resolve(reqJSON);
                            }
                        }
                    });

                    createRequest.then(function (response) {
                        // send to API
                        var request = require("request");
                        var hostname = req.headers.host;
                        if (hostname === 'dev.my.nemlevering.dk') {
                            apiurl = 'https://dev.api.nemlevering.dk';
                        } else if (hostname === 'my.nemlevering.dk') {
                            apiurl = 'https://api.nemlevering.dk';
                        } else if (hostname === 'localhost:3551') {
                            apiurl = 'http://localhost:3333';
                        } else {
                            apiurl = 'http://10.0.53.90:3551';
                        }
                        var options = {
                            method: 'POST',
                            url: apiurl + '/v1.3/scheduled/create',
                            headers:
                            {
                                token: apikey,
                                'content-type': 'application/json'
                            },
                            body: response,
                            json: true
                        };
                        var globalDeliveryData = response;
                        request(options, function (error, response, body) {
                            if (error) {
                                return res.send({ status: false, error: error });
                            }

                            if (typeof body.message != 'undefined') {
                                return res.send({ status: false, error: body.message });
                            } else if (typeof body.error != 'undefined') {
                                return res.send({ status: false, error: body.error });
                            } else {

                                var request = require("request");

                                var options = {
                                    method: 'POST',
                                    url: apiurl + '/updateLatLong',
                                    headers:
                                    {

                                    },
                                    body:
                                    {
                                        body: body,
                                        globalDeliveryData: globalDeliveryData[0]
                                    },
                                    json: true
                                };

                                request(options, function (error, response, body) {
                                    if (error) throw new Error(error);

                                    console.log(body);
                                });

                                return res.send({ status: true, body: true });
                            }
                        });

                    });

                });
        })

    },

    updateDelivery: function (req, res, next) {
        let deliveryobjId = req.params.deliveryid.toObjectId();

        let insurance;
        let insurance_value;
        routes.findOne({ _id: deliveryobjId })
            .then(doc => {
                insurance = doc.full_insurance;
                insurance_value = doc.full_insurance_value;
                return routes.findOneAndUpdate({ _id: deliveryobjId }, req.body, { ups0rt: true, new: true })
            })
            .then((doc) => {
                let changeEventText = "Delivery was changed";
                if (doc.full_insurance !== insurance || doc.full_insurance_value !== insurance_value) {
                    changeEventText += ` (with ${doc.full_insurance_value} kr in cargo insurance coverage)`
                }
                return Events.create({
                    assigned_to: deliveryobjId,
                    assigned_to_type: "SCHEDULED_DELIVERY",
                    event: "CUSTOM",
                    event_data: changeEventText,
                })
            }).then((doc) => {
                // if (err) return res.send(500, {error: err});
                return res.send({ success: true });
            });
    },

    deleteDelivery: function (req, res, next) {
        let deliveryobjId = req.params.deliveryid.toObjectId();

        routes.remove({ _id: deliveryobjId }, function (err, doc) {
            if (err) return res.send(500, { error: err });
            return res.send({ success: true });
        })
    },

    statsBetweenDateRange: function (dateRange, callback) {
        let startDateLimit = new Date(dateRange.start);
        startDateLimit = new Date(startDateLimit.getTime() - startDateLimit.getTimezoneOffset() * 60000);
        startDateLimit.setUTCHours(0);
        startDateLimit.setUTCMinutes(0);
        startDateLimit.setUTCSeconds(0);
        startDateLimit.setUTCMilliseconds(0);
        let endDateLimit = new Date(dateRange.end);
        endDateLimit = new Date(endDateLimit.getTime() - endDateLimit.getTimezoneOffset() * 60000);
        endDateLimit.setUTCDate(endDateLimit.getUTCDate() + 1);
        endDateLimit.setUTCHours(0);
        endDateLimit.setUTCMinutes(0);
        endDateLimit.setUTCSeconds(0);
        endDateLimit.setUTCMilliseconds(0);
        routes.aggregate([{
            $match: {
                deliverydate: { $gte: startDateLimit, $lt: endDateLimit },
                creator: dateRange.userId
            }
        }, {
            $group: {
                _id: '$deliverydate',
                data: {
                    $push: {
                        deliveryid: '$deliveryid',
                        deliverydate: '$deliverydate',
                        carrier: '$carrier',
                        deliverywindowend: '$deliverywindowend',
                        status: '$carrier.status',
                        progressLog: '$carrier.progressLog'
                    }
                }
            }
        }], function (error, data) {
            if (error) {
                callback(error, null);
            } else {
                callback(null, data);
            }
        });
    },

    statsDeliveryAndReturn: function (req, res, next) {
        let userObId = req.cookies.userId.toObjectId();
        let type = req.query.type;
        let departmentName = req.query.department;

        console.log('req.query', req.query)
        let startDateLimit = new Date(req.query.start);
        startDateLimit = new Date(startDateLimit.getTime() - startDateLimit.getTimezoneOffset() * 60000);
        startDateLimit.setUTCHours(0);
        startDateLimit.setUTCMinutes(0);
        startDateLimit.setUTCSeconds(0);
        startDateLimit.setUTCMilliseconds(0);
        let endDateLimit = new Date(req.query.end);
        endDateLimit = new Date(endDateLimit.getTime() - endDateLimit.getTimezoneOffset() * 60000);
        endDateLimit.setUTCDate(endDateLimit.getUTCDate() + 1);
        endDateLimit.setUTCHours(0);
        endDateLimit.setUTCMinutes(0);
        endDateLimit.setUTCSeconds(0);
        endDateLimit.setUTCMilliseconds(0);


        if (!type) {
            type = DELIVRY_TYPE;
        }
        let criteria = {
            //type: type
        };

        if (type==RETURN_TYPE) {
            criteria['type']=RETURN_TYPE;
        }
        else {
            criteria['type']= { "$ne": RETURN_TYPE };
        }
        criteria.deliverydate ={ $gte: startDateLimit, $lt: endDateLimit }

        var coworkersArr = [];

        //console.log('criteria', criteria, userObId)
        Accounts.findOne({ _id: userObId }).then((account) => {

            if (typeof account.groupId != 'undefined') {
                Accounts.find({
                    $or: [
                        { 'groupId': account.groupId },
                        { '_id': account.groupId }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            coworkersArr.push(conworkerID);
                        }
                        criteria.creator = { $in: coworkersArr };
                        if (departmentName) {
                            criteria.department = { $in : [departmentName] };
                        }
                        getMonthlyStatis(req, res, criteria, departmentName);
                    }
                });
            } else {
                Accounts.find({
                    $or: [
                        { 'groupId': userObId },
                        { '_id': userObId }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            coworkersArr.push(conworkerID);
                        }
                        criteria.creator = { $in: coworkersArr };
                        if (departmentName) {
                            criteria.department = { $in : [departmentName] };
                        }
                        getMonthlyStatis(req, res, criteria, departmentName);
                    }
                });
            }
        });
    },

    set_delivery_printed: function (req, res, next) {
        let deliveryobjId = req.params.deliveryid.toObjectId();
        let printed = req.body.printed;

        routes.update({ _id: deliveryobjId }, { $set: { printed: printed } }, { multi: true }, function (err, doc) {
            if (err) {
                Response.error(res, 'Error', {
                    error: err
                });
            }
            Response.success(res, 'Done', { printed: printed });
        })
    },

    set_delivery_date: function (req, res, next) {
        let deliveryobjId = req.params.deliveryid.toObjectId();
        let deliverydate = req.body.deliverydate;

        routes.update({ _id: deliveryobjId }, { $set: { deliverydate: deliverydate } }, { multi: true }, function (err, doc) {
            if (err) {
                Response.error(res, 'Error', {
                    error: err
                });
            }
            Response.success(res, 'Done', { deliverydate: deliverydate });
        })
    },

    set_delivery_department: function (req, res, next) {
        let deliveryobjId = req.params.deliveryid.toObjectId();
        let department = req.body.department;

        routes.update({ _id: deliveryobjId }, { $set: { department: department } }, { multi: true }, function (err, doc) {
            if (err) {
                Response.error(res, 'Error', {
                    error: err
                });
            }
            Response.success(res, 'Done', { department: department });
        })
    },
    

    set_delivery_boxes: function (req, res, next) {
        let deliveryobjId = req.params.deliveryid.toObjectId();
        let count = req.body.count;

        routes.update({ _id: deliveryobjId }, { deliverynumberofpackages: count }, function (err, doc) {
            if (err) {
                Response.error(res, 'Error', {
                    error: err
                });
            }
            Response.success(res, 'Done');
        })
    },

    get_delivery_settings: function (req, res, next) {
        let clientId = req.cookies['userId'];
        Accounts.findOne({ _id: clientId }).then((account) => {

            if (typeof account.groupId !== 'undefined') {
                clientId = account.groupId;
            }
            if (!clientId) {
                Response.error(res, 'No Client ID');
                return false;
            }

            DeliverySettings.findOne({ clientId: clientId })
                .then(result => {

                    Response.success(res, 'Got Deliveries', result);
                });
        })

    },
};

module.exports = ScheduledDeliveriesController;

function fetchDenmarkData(str, addressArr, zipCode) {
    var options = {
        method: 'GET',
        url: 'https://dawa.aws.dk/adresser',
        qs: { vejnavn: str, husnr: addressArr[addressArr.length - 1], postnr: zipCode, struktur: 'mini' },
    };
    // console.log({ vejnavn: str, husnr: addressArr[addressArr.length - 1], postnr: zipCode, struktur: 'mini' });
    return new Promise(function (resolve, reject) {
        console.log("in promise")
        request(options, function (error, response, denmarkAData) {
            if (error) console.log(error);// throw new Error(error);
            console.log(denmarkAData);

            if (denmarkAData != null) {
                var responseData = JSON.parse(denmarkAData);
                if (responseData.length > 0) {
                    console.log(zipCode);
                    //for (let i = 0; i < responseData.length; i++) {
                    //console.log(responseData[i].postnr);
                    //if (responseData[i].postnr == zipCode) {
                    var data = {
                        x: responseData[0].x,
                        y: responseData[0].y
                    }
                    console.log(data);
                    return resolve(data);
                    //}
                    //}
                } else {
                    return resolve("else");
                    console.log("Else In");
                    // next();
                }

            } else {
                return resolve("else");
                console.log("Else");
                //next();
            }
        });
    });

}