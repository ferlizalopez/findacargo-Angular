/**
 * Created by jeton on 6/14/2017.
 */
var Response = require('../utils/Response');
var ServiceModel = require('../models/Service');

const ServiceController = {
    get: function (req, res) {
        ServiceModel.find({enabled:true})
            .then(data => {
                if (data) {
                    Response.success(res, 'Successfully returned.', data);
                } else {
                    Response.noData(res, 'Not found.');
                }
            });
    },
    getEnabled: function (req, res) {
        ServiceModel.find({enabled:true})
            .then(data => {
                if (data) {
                    Response.success(res, 'Successfully returned.', data);
                } else {
                    Response.noData(res, 'Not found.');
                }
            });
    },
    create: function (req, res) {
        let serviceData = req.body;
        if (!serviceData) {
            Response.error(res, 'Missed data');
            return false;
        }

        let service = new ServiceModel(serviceData);

        service.save((err, record) => {
            if (err) {
                Response.error(res, err);
                return false;
            }
            Response.success(res, 'Successfully created the service.');
        });
    },
    edit: function (req, res) {
        delete req.body.service._id;
        ServiceModel.update({_id: req.params.serviceId}, {$set: req.body.service})
            .then((err, service) => {
                Response.success(res, 'Successfully updated the service.');
            })
    },
    delete: function (req, res) {
        ServiceModel.remove({_id: req.params.serviceId})
            .then((err, service) => {
                Response.success(res, 'Successfully deleted the service.');
            })
    }
};

module.exports = ServiceController;