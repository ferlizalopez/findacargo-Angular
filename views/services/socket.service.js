(function () {
    angular
        .module('app')
        .service('socketService', ['socketFactory', 'urlService', socketService]);

    function socketService(socketFactory, urlService) {
        function connect() {
            return socketFactory({
                ioSocket: io.connect(urlService.getApiUrl())
            });
        }

        return {
            connect: connect
        }
    }
})();