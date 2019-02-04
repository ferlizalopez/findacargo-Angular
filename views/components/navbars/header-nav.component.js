/**
 * Created by jeton on 6/28/2017.
 */
var module = angular.module("app");
module.component("headerNav", {
    templateUrl: "../components/navbars/header-nav.component.html",
    controllerAs: "model",
    controller: ["$translate", controller]
});

function controller($translate){

    this.$onInit = () => {
        this.userEmail = decodeURIComponent(JSON.parse(localStorage.getItem('userEmail')));
        let lang = localStorage.getItem('lang');

        if (!lang) {
            this.lang = "en";
            localStorage.setItem('lang', this.lang);
            moment.locale(this.lang);
        } else {
            this.lang = lang;
            moment.locale(lang);
        }

        $translate.use(this.lang);
    };

    this.changeLang = () => {
        localStorage.setItem('lang', this.lang);
        window.location.reload();
    }

}
