(function() {
    angular
        .module('app')
        .factory('utilityService', utilityService);

    function utilityService() {
        return {
            getGoogleAddressComponent : getGoogleAddressComponent,
        };

        function getGoogleAddressComponent(place, type) {
            if (!place.address_components || place.address_components.length === 0) {
                return '';
            }
            let component = place.address_components.find((item) => item.types.indexOf(type) > -1);
            return component ? component.long_name : '';
        }
    }
})();