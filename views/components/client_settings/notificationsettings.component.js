var module = angular.module("app");
module.component("usernotificationsettings", {
    templateUrl: "../components/client_settings/notificationsettings.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "toastr", "$translate", controller]
});

function controller($http, $state, toastr, $translate) {
    var self = this;

    this.settings = {
        allow_to_receive_daily_report: null,
        allow_to_receive_end_of_day_report: null,
        allow_to_receive_end_of_week_report: null,
        allow_to_receive_issue_report: null,
    }

    this.$onInit = () => {
        this.getNotificationSettings();
    };

    this.getNotificationSettings = () => {
        let currentUserId = getCookie('userId');
        $http.get(`/usersettings/notification-settings/${currentUserId}`)
        .then(response => {
            if (response.data.body) {
                this.settings = response.data.body.settings;
            }
        })
    };

    this.updateSettings = () => {
        let currentUserId = getCookie('userId');
        $http.put(`/usersettings/notification-settings/${currentUserId}`, {settings: this.settings})
            .then(response => {
                if (response.data.success) {
                    toastr.success($translate.instant("notification_settings.updated"));
                } else {
                    toastr.error(response.data.msg, 'Error');
                }
            })
            .catch(response => {
                toastr.error(response.data.msg, 'Error');
            })
    };

}
