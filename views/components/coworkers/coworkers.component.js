/**
 * Created by SK on 10/23/2017.
 */
var module = angular.module("app");
module.component("coworkers", {
    templateUrl: "../components/coworkers/coworkers.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "spinnerService", controller]
});

function controller($http, $state, spinnerService) {
    this.coworker = {};
    this.coworkers = [];
    this.notFound = false;
    this.isAdmin = false;
    this.spinnerChecker = spinnerService;

    this.$onInit = () => {
        this.getCoWorkers();
    };
    this.categories = [
        {category: 'admin', text: 'Admin'},
        {category: 'sales', text: 'Agents (Sales, Support..)'}
        // { value: 'driver', text: 'Driver' }
    ];

    this.currentUserId = getCookie('userId');
    // this.currentUserId = JSON.parse(localStorage.getItem('userId'));

    this.getCoWorkers = () => {
        spinnerService.show();
        $http.get('/co-workers/' + this.currentUserId)
            .then(function (response) {
                return response.data.body;
            })
        .then(res => {
            
            if (res.data) {
                this.isAdmin = true;
                this.coworkers = res.data;
                localStorage.setItem('totalLength', res.data.length);
            } else {
                this.notFound = true;
            }

            spinnerService.hide();
        })
    };

    this.delete = (coWorker) => {
        $http.delete('/co-worker/' + coWorker._id)
            .then(response => {
                var deleted = this.coworkers.indexOf(coWorker);
                this.coworkers.splice(deleted, 1);
            })
    };

    this.resendInvite = (member) => {
        var token = getCookie('token');
        $http.post('/re-invite', {member: member, token: token})
            .then(response => {
                if (response.data.success) {
                    this.showSuccess = true;
                    this.showMsg = response.data.msg;
                    alert('Invitation re-sent successfully.')
                }
            });
    };

    this.editView = (coworker) => {
        coworker.editMode = true;
        this.coworker = coworker;
    };

    this.closeEditView = (coworker) => {
        coworker.editMode = false;
    };

    this.edit = () => {
        $http.put('/co-worker/' + this.coworker._id, this.coworker)
            .then(response => {
                if (response.data.success) {
                    this.coworker.editMode = false;
                }
            })
    };
}