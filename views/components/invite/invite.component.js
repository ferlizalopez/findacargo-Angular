/**
 * Created by SK on 10/20/2017.
 */
var module = angular.module("app");
module.component("invite", {
    templateUrl: "../components/invite/invite.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$scope", "$timeout", "$stateParams", "toastr", controller]
});

function controller($http, $state, $scope, $timeout, $stateParams, toastr){
    this.members = Members();

    this.categories = [
        {category: 'admin', text: 'Admin'},
        {category: 'sales', text: 'Agents (Sales, Support..)'}
        // {value: 'driver', text: 'Driver'}
    ];

    $scope.countryOptions = [
        {"value": "45", "name": "(+45)"},
        {"value": "46", "name": "(+46)"},
    ];

    this.showSuccess = false;
    this.showMsg = '';

    this.invite = () =>{
        var reqBody = this.members;
        var members = reqBody.filter(function(member){return member.email.length > 0});
        var token = getCookie('token');
        $http.post('/invite', {members: members, token: token})
        .then(res => {
            //console.log('res', res)
            //toastr.error($translate.instant(error.data.message));
            if(res && res.data){
                var idx = 0;
                res.data.forEach(function(user){
                    if(user.mailSent){
                        members[idx].success = user.mailSent;
                        members[idx].display = true;
                        toastr.success(`Sent email to ${members[idx].email}`);
                    }
                    else{
                        toastr.error("This email was registered already.");
                        // members[idx].success = user.mailSent;
                        // members[idx].display = true;
                    }
                    idx = idx + 1;
                });
                this.members = Members();
            } else {
                window.alert("Error occurred: ");
            }
            $timeout(function(){
                members.map(function(o){
                    o.display = false;
                    return o;
                });
                //$scope.members = [{type:'admin'},{type:'admin'},{type:'admin'}];
            }, 5000);
        },(err) => {
                window.alert("Error occurred: "+err.data.error);
            })
    };
    
    this.addNew = () => {
        var newData = {name: '', email: '', phone: '', category: '', display: false, success: false, category:'sales', ccode:'45'};
        this.members.unshift(newData);
    }

    this.deleteClient = (idx) => {
        if (idx != -1) {
            this.members.splice(idx, 1);
        }
    }
    
}

function Members(){
    return [
        {name: '', email: '', phone: '', category: '', display: false, success: false, category:'sales', ccode:'45'}
        // {name: '', email: '', phone: '', category: '', display: false, success: false, category:'sales', ccode:'45'},
        // {name: '', email: '', phone: '',  category: '', display: false, success: false, category:'sales', ccode:'45'}
    ];
}
