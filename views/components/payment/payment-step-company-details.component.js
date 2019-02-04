module.component("paymentstepcompanydetails", {
    templateUrl: "../components/payment/payment-step-company-details.component.html",
    bindings: {
        companyDetails: '=',
        changeStep: '&'
    },
    controllerAs: "model",
    controller: ["$http", "$scope", "$timeout", "utilityService", controller]
});

function controller($http, $scope, $timeout, utilityService) {
    $scope.stepForm = {};

    this.autoCompleteOptions = {
        minimumChars: 2,
        //autoHideDropdown: true,
        itemSelected: (res) => {
            let item = res.item;
            if (item.address) {
                this.companyDetails.company_address.street = item.address;
            }
            if (item.city) {
                this.companyDetails.company_address.city = item.city;
            }
            if (item.zipcode) {
                this.companyDetails.company_address.zip = item.zipcode;
            }
            if (item.name) {
                this.companyDetails.company_name = item.name;
            }

            this.companyDetails.company_address.address = item.address + ", " + item.zipcode + ", " + item.city + ", Denmark";
            this.companyDetails.company_address.country = "Denmark";
            $timeout(() => {
                $scope.$apply()
            });
        },
        renderItem: (item) => {
            return {
                value: item.vat,
                label: `<p class="auto-complete">${item.name}, ${item.vat}</p>`
            };
        },
        data: (searchText) => this.makeCVRQuery(searchText),
    };

    this.makeCVRQuery = (searchText) => {
        if (!searchText) return;

        return $http({
            method: 'GET',
            url: `https://cvrapi.dk/api?search=${searchText}&country=dk`,
        }).then(response => {
            return response.data ? [response.data] : [];
        });
    };

    this.autocomplete_company_address = new google.maps.places.Autocomplete(document.getElementById('company_address'));
    this.autocomplete_pickup_address = new google.maps.places.Autocomplete(document.getElementById('pickup_address'));
    google.maps.event.addListener(this.autocomplete_company_address, 'place_changed', (res) => {
        let place = this.autocomplete_company_address.getPlace();
        if (!place) return;

        this.companyDetails.company_address.street = utilityService.getGoogleAddressComponent(place, 'route') + " " + utilityService.getGoogleAddressComponent(place, 'street_number');
        this.companyDetails.company_address.city = utilityService.getGoogleAddressComponent(place, 'locality');
        this.companyDetails.company_address.zip = utilityService.getGoogleAddressComponent(place, 'postal_code');
        this.companyDetails.company_address.country = utilityService.getGoogleAddressComponent(place, 'country');

        $timeout(() => {
            $scope.$apply()
        });
    });
    google.maps.event.addListener(this.autocomplete_pickup_address, 'place_changed', (res) => {
        let place = this.autocomplete_pickup_address.getPlace();
        if (!place) return;

        this.companyDetails.pickup_address.street = utilityService.getGoogleAddressComponent(place, 'route') + " " + utilityService.getGoogleAddressComponent(place, 'street_number');
        this.companyDetails.pickup_address.city = utilityService.getGoogleAddressComponent(place, 'locality');
        this.companyDetails.pickup_address.zip = utilityService.getGoogleAddressComponent(place, 'postal_code');
        this.companyDetails.pickup_address.country = utilityService.getGoogleAddressComponent(place, 'country');

        $timeout(() => {
            $scope.$apply()
        });
    });


}
