/**
 * Created by SK on 9/12/2017.
 */
var module = angular.module("app");
module.component("notificationsettings", {
    templateUrl: "../components/notification_settings/notificationsettings.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "urlService", "spinnerService", controller]
});

function controller($http, $state, urlService, spinnerService) {
    this.clients = [];
    this.notFound = false;
    this.spinnerChecker = spinnerService;

    this.$onInit = () => {
        this.getNotificationSettings();
    };

    this.apikey = getCookie('token');
    this.editorEnabled = false;

    this.addNew = function () {
        // if (this.clients.length == 0) {
        //     this.clients.push({
        //         "email": "",
        //         "email_enabled": false,
        //         "phone_number": "",
        //         "sms_enabled": false,
        //         'editorEnabled': true
        //     });
        // }
        // else {
        //     this.clients.push({
        //         "email": "",
        //         "email_enabled": false,
        //         "phone_number": "",
        //         "sms_enabled": false,
        //         'editorEnabled': true
        //     });
        // }
        this.clients.unshift({
            "_id": "",
            "email": "",
            "email_enabled": false,
            "phone_number": "",
            "sms_enabled": false,
            'editorEnabled': true
        });
    };

    this.getNotificationSettings = () => {
        spinnerService.show();

        $http({
            method: 'GET',
            url: urlService.getApiUrl() + '/v1/user/notifications/settings/client/details',
            headers: {
                "Content-Type": "application/json",
                "token": getCookie('apikey')
            }
        })
            .then((response) => {
                this.clients = response.data.data;
                console.log("clients", this.clients)
                spinnerService.hide();
            })
    };

    this.remove = function (idx, val) {
        $http({
            method: 'DELETE',
            url: urlService.getApiUrl() + '/v1/user/notifications/settings/' + val._id,
            headers: {
                "Content-Type": "application/json",
                "token": getCookie('apikey')
            }
        }).then((response) => {
            this.clients = this.clients.filter(function (obj) {
                return obj._id !== val._id;
            });
        }, function (error) {
            console.log('error -', error);
        });

        if (idx != -1) {
            this.clients.splice(idx, 1);
        }
    };

    this.edit = function (elem) {
        elem.editorEnabled = true;
    };

    this.save = function (elem) {
        this.clients.map(function (obj) {
            obj.editorEnabled = false;
            return obj;
        });
        this.submit(elem);
    };

    this.toggleSmsSelection = function (elem) {
        elem.sms_enabled = !elem.sms_enabled;
        if (!elem.editorEnabled) {
            this.submit(elem);
        }
    }

    this.toggleEmailSelection = function (elem) {
        elem.email_enabled = !elem.email_enabled;
        if (!elem.editorEnabled) {
            this.submit(elem);
        }
    }

    this.submit = function (elem) {
        var reqBody = elem;
        delete reqBody._id;
        delete reqBody.__v;
        delete reqBody.$$hashKey;
        delete reqBody.editorEnabled;

        $http({
            method: 'POST',
            url: urlService.getApiUrl() + '/v1/user/notifications/settings',
            data: JSON.stringify(reqBody),
            headers: {
                "Content-Type": "application/json",
                "token": getCookie('apikey')
            }
        }).then(function (response) {
            data = response.data;
            delete data._id;
        }, function (error) {
            console.log('error -', error);
        });
    };

}