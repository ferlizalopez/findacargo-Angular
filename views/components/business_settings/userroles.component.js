var module = angular.module("app");
module.component("userroles", {
    templateUrl: "../components/business_settings/userroles.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", controller]
});

function controller($http, $state) {
    var self = this;

    this.selected = {};
    this.roles = [
        {
            name: 'Administrator',
            desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            info: 'Contrary to popular belief, Lorem Ipsum is not simply random text.'
        },
        {
            name: 'Developer',
            desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            info: 'Contrary to popular belief, Lorem Ipsum is not simply random text.'
        },
        {
            name: 'Analyst',
            desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            info: 'Contrary to popular belief, Lorem Ipsum is not simply random text.'
        },
        {
            name: 'Support Specialist',
            desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            info: 'Contrary to popular belief, Lorem Ipsum is not simply random text.'
        },
        {
            name: 'View Only',
            desc: 'Contrary to popular belief, Lorem Ipsum is not simply random text.',
            info: 'Contrary to popular belief, Lorem Ipsum is not simply random text.'
        },
    ];

    this.selectInfo = function(selected) {
        this.selected = selected;
    }
}