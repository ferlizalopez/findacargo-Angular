var module = angular.module("app");
module.component("userpickupsettings", {
    templateUrl: "../components/pickup_settings/pickupsettings.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "toastr", "$translate", controller]
});

function controller($http, $state, toastr, $translate) {
    var self = this;
    this.bufAddresses = [];

    this.$onInit = () => {
        this.getScheduleAddresses();
    };

    this.getScheduleAddresses = () => {
        var userId = getCookie('userId');
        $http.get(`/pickup-settings/${userId}`)
        .then(response => {
            if (response.data.body) {
                //console.log("address", response.data.body.addresses)
                self.bufAddresses = response.data.body.addresses;
            } else {
                self.bufAddresses = [];
            }
        })
    };

    this.changeDefault = (num) => {
        this.bufAddresses = this.bufAddresses.map(el => {
            el.default = false;
            return el;
        })
        this.bufAddresses[num].default = true;    
    };

    this.changeReturnDefault = (num) => {
        this.bufAddresses = this.bufAddresses.map(el => {
            el.default_for_return = false;
            return el;
        })
        this.bufAddresses[num].default_for_return = true;    
    };

    this.addAddress = () => {
        this.bufAddresses.push({value: '', default: false, default_for_return:false});
        if (this.bufAddresses.length == 1)
            this.changeDefault(0);
        this.editView(this.bufAddresses[this.bufAddresses.length-1]);
    }

    this.deleteAddress = (num) => {
        if (this.bufAddresses[num].default) {
            this.bufAddresses.splice(num, 1);  
            if (this.bufAddresses[this.bufAddresses.length-1])
                this.bufAddresses[this.bufAddresses.length-1].default = true;
        } else {
            this.bufAddresses.splice(num, 1);  
        }
        this.updateScheduleAddresses();  
    }

    this.editView = (address) => {
        address.editMode = true;
    };

    this.closeEditView = (address) => {
        address.editMode = false;
        if (!address.value) {
            this.deleteAddress(this.bufAddresses.indexOf(address))
        } else {
            this.updateScheduleAddresses();  
        }
    };


    this.updateScheduleAddresses = () => {
        this.bufAddresses = this.bufAddresses.map(el => {
            if (el.value.formatted_address) 
                el.value = el.value.formatted_address;
            return el;
        })
        
        var userId = getCookie('userId');
        $http.put(`/pickup-settings/${userId}`, {addresses: this.bufAddresses})
        .then(response => {
            if (response.data.success) {
                toastr.success($translate.instant("pickup_settings.updated"));
            } else {
                toastr.error(response.data.msg, 'Error');
            }
        })
        .catch(response => {
            toastr.error(response.data.msg, 'Error');
        })
    };
}
