let db = require('../../framework/db-connector'),
    ScheduledDeliveriesCollection = db.collection('scheduleddeliveries'),
    ScheduledDeliveriesModel = require('../../../models/ScheduledDelivery'),
    moment = require('moment');


module.exports = {
    scheduled: {
        updateStatus: function (ids, status) {
            return ScheduledDeliveriesCollection.updateMany(
                { _id: { $in: ids } },
                { $set: { "status" : status } }
             );
        },

        updateDate: function (ids, deliverydate, weekNumber, deliverydayofweek) {
            return ScheduledDeliveriesCollection.updateMany(
                { _id: { $in: ids } },
                {
                    $set: {
                        "deliverydate": deliverydate,
                        "weekNumber": weekNumber,
                        "deliverydayofweek": deliverydayofweek
                    }
                }
            );
        },

        deleteMany: function (ids) {
            return ScheduledDeliveriesCollection.deleteMany(
                { _id: { $in: ids } }
             );
        },

        forRouteDate: function (startDate, endDate, routeItem, ids) {
            let query = {
                deliveryid: {$in: ids, $ne: 1},
                weekno: parseInt(routeItem.weekNo),
                deliverydayofweek: routeItem.weekDay,
                deliverydate: {$gte: startDate.toDate(), $lt: endDate.toDate()},
                creator: routeItem.creator,
                "carrier.status": {$ne: 7}
            };

            return ScheduledDeliveriesCollection.find(query);
        },

        forDate: function (startDate, endDate) {
            let query = {
                deliverydate: {
                    $gte: startDate.toDate(), $lt: endDate.toDate()
                }
            };
            return ScheduledDeliveriesCollection.find(query);
        },

        pickups: function (creator, date, showNew) {
            let startDate = !!date ? moment.utc(date, "MM-DD-YYYY").startOf('day') : moment().utc().startOf('year');

            let match = {
                deliverydate: {
                    $gte: startDate.toDate()
                }
            };

            if (!!date && !showNew) {
                match.deliverydate.$lt = moment.utc(date, "MM-DD-YYYY").add(1, "days").toDate();
            }

            if (creator) {
                match.creator = creator.toObjectId();
            }

            return ScheduledDeliveriesCollection.aggregate([
                {
                    $match: match
                },
                {
                    $group: {
                        _id: {
                            creator: '$creator',
                            pickupaddress: '$pickupaddress',
                            pickupzip: '$pickupzip',
                            pickupcity: '$pickupcity',
                            date: '$deliverydate',
                            deliverydayofweek: '$deliverydayofweek'
                        },
                        deliveriesCount: { $sum: 1 }
                    }
                }
            ]).exec();
        },

        all: function (query, carrierId, fields) {
            if (!query) {
                query = {};
            }

            if (carrierId) {
                query['carrier.accountId'] = carrierId.toObjectId();
            }

            return fields
                ? ScheduledDeliveriesCollection.find(query, fields)
                : ScheduledDeliveriesCollection.find(query);
        },

        findAll: function(query, fields) {
            return ScheduledDeliveriesCollection.find(query, fields);
        },

        count: function (query){
            return ScheduledDeliveriesCollection.find(query).count();
        },

        update: function (deliveryId, updateQuery = {}) {
            return ScheduledDeliveriesCollection.update({_id: deliveryId}, {$set: updateQuery});
        },

        findOne: function (id) {
            return ScheduledDeliveriesCollection.findOne({_id: id});
        },
        findOneByFilter: function (filter) {
            return ScheduledDeliveriesCollection.findOne(filter);
        },
        findOneAndUpdate: function (id, data) {
            return ScheduledDeliveriesCollection.findOneAndUpdate({_id: id}, {$set: data});
        },

        create: function (query) {
            return ScheduledDeliveriesModel.create(query);
        }
    },

    zone: {
        forDate: function (startDate, endDate, ids) {
            let query = {
                _id: {$in: ids, $ne: 1},
                deliverydate: {$gte: startDate.toDate(), $lt: endDate.toDate()},
            };
            return ScheduledDeliveriesCollection.find(query);
        },

        all: function (ids, query = {}) {
            query._id = {$in: ids, $ne: 1};

            return ScheduledDeliveriesCollection.find(query);
        }
    }
};