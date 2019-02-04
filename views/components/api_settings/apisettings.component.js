var module = angular.module("app");
module.component("userapisettings", {
    templateUrl: "../components/api_settings/apisettings.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "toastr", "urlService", "$translate", controller]
});

function controller($http, $state, toastr, urlService, $translate) {
    var self = this;
    var name = getCookie('name');
    var apikey = getCookie('apikey');
    var showKey = false;

    this.$onInit = () => {
        this.getApiKeys();
    };

    this.getApiKeys = () => {
        let currentUserId = getCookie('userId');
        $http.get(`${urlService.getApiUrl()}/v1/apikeys/${currentUserId}`)
            .then(response => {
                if (response) {
                    self.name = response.data.name;
                    self.apikey = response.data.apikey;
                }
            })
    };

    this.regenerate = () => {
        let currentUserId = getCookie('userId');
        if (confirm($translate.instant('api_settings.regenerate'))) {
            $http.put(`${urlService.getApiUrl()}/v1/apikeys/${currentUserId}`)
                .then(response => {
                    if (response) {
                        self.name = response.data.name;
                        self.apikey = response.data.apikey;
                        setCookie('apikey', response.data.apikey, 999)
                    }
                })
        }
    };

    this.changeSecure = () => {
        this.showKey = !this.showKey;
    }
}
