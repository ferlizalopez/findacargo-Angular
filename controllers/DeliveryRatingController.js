/**
 * Created by jeton on 6/14/2017.
 */
var Response = require('../utils/Response');
var DeliveryRatingModel = require('../models/DeliveryRatings');
var Accounts = require('../models/Accounts');


function fetchDeliveryRatings(coworkersArr, res, departmentName) {
    var matchCondition = {
        $match: {
            creator: { $in: coworkersArr }
        },
    };
    // if (typeof departmentName == 'undefined') {
    //     var matchCondition = {
    //         $match: {
    //             creator: { $in: coworkersArr }
    //         },
    //     };
    // } else {
    //     var matchCondition = {
    //         $match: {
    //             creator: { $in: coworkersArr }
    //             //department: departmentName,
    //         },
    //     };
    // }
    DeliveryRatingModel.aggregate([
        { $match: {
                creator: { $in: coworkersArr }
            }
        },
        {
            $lookup:{
            from: "scheduleddeliveries",
            localField: "delivery_id",
            foreignField:"_id",
            as: "rating_delivery"}
        },{
            $sort:{
                "deliveryid":1
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

const DeliveryRatingController = {
    get: function (req, res) {

        let userObId = req.cookies.userId.toObjectId();
        let departmentName = req.params.department;

        var coworkersArr = [];
        Accounts.findOne({ _id: userObId }).then((account) => {

            if (typeof account.groupId != 'undefined') {
                Accounts.find({
                    $or: [
                        { 'groupId': account.groupId },
                        { '_id': account.groupId.toObjectId() }
                    ]
                }, function (err, coworkers) {
                    if (err) {
                        Response.dbError(res, "Error while getting deliveries from database.")
                    } else {
                        for (var key in coworkers) {
                            let conworkerID = coworkers[key]._id;
                            coworkersArr.push(conworkerID);
                        }
                        fetchDeliveryRatings(coworkersArr, res, departmentName);
                    }
                });
            } else {
                Accounts.find({
                    $or: [
                        { 'groupId': req.cookies.userId },
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

                        fetchDeliveryRatings(coworkersArr, res, departmentName);
                    }
                });
            }
        });
    },
    create: function (req, res) {
        let deliveryRatingData = req.body;
        if (!deliveryRatingData) {
            Response.error(res, 'Missed data');
            return false;
        }

        let deliveryRating = new DeliveryRatingModel(deliveryRatingData);

        deliveryRating.save((err, record) => {
            if (err) {
                Response.error(res, err);
                return false;
            }
            Response.success(res, 'Successfully created the deliveryRating.');
        });
    },

    delete: function (req, res) {
        DeliveryRatingModel.remove({_id: req.params.deliveryRatingId})
            .then((err, deliveryRating) => {
                Response.success(res, 'Successfully deleted the deliveryRating.');
            })
    }
};

module.exports = DeliveryRatingController;