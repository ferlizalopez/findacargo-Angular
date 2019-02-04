angular
    .module('app')
    .service('spinnerService', spinnerService);

function spinnerService($rootScope) {

    this.isVisible = function () { 
        return angular.element(document.querySelector('#spinner')).css('display') !== 'none';
    }

    this.show = function () {
        angular.element(document.querySelector('#spinner')).show();
    };

    this.hide = function () {
        angular.element(document.querySelector('#spinner')).hide();
    }
}
