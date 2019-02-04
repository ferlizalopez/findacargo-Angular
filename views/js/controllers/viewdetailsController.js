angular.module('details', ['customModule'])
    .controller('detailsController', function($scope,$location,$http,$sce,alert) {
        var directionDisplay;
        var directionsService = new google.maps.DirectionsService();     //Create a DirectionsService object which is required to communicate with the Google Maps API Direction Service
        var map;
        $scope.deliver = false;
        $scope.initialize = function()
        {
            directionsDisplay = new google.maps.DirectionsRenderer();        //Create a DirectionsRenderer object to render the directions results
            var center = new google.maps.LatLng(0, 0);    //Map is centered at 0,0
            var myOptions =
            {
                zoom:7,
                mapTypeId: google.maps.MapTypeId.ROADMAP,
                center: center
            }
            map = new google.maps.Map(document.getElementById("map_canvas"), myOptions);
            directionsDisplay.setMap(map);
            var request =
            {
                origin:$scope.detail.pickuplocreadable,
                destination:$scope.detail.destinationreadable,
                travelMode: google.maps.DirectionsTravelMode.DRIVING          //Current travel mode is DRIVING. You can change to BICYCLING or WALKING and see the changes.
            };
            directionsService.route(request, function(response, status)
            {
                if (status == google.maps.DirectionsStatus.OK) //Check if request is successful.
                {
                    $scope.display.distance = response.routes[0].legs[0].distance.text;
                    $scope.display.duration = response.routes[0].legs[0].duration.text;
                    $scope.$digest();
                    directionsDisplay.setDirections(response);         //Display the directions result
                }
            });
        }
        $scope.numberAlerts=alert.getNotificationscount;
        $scope.alertNotifications = alert.getNotifications;
        if($location.search().request){
            $http.get('/api/transrequests/'+$location.search().request).then(function(res){
                $scope.detail = res.data.detail;
            }, function(err){

            });
        }
        else{
            $scope.detail = JSON.parse(localStorage.getItem("detail"));
            $scope.initialize();
            angular.forEach($scope.detail.bids,function(bid){
                if(bid.bidder == user._id && bid.accepted){
                    $scope.deliver = true;
                }
            })
        }
        $scope.bid = {};
        $scope.display = {distance:"",duration:""};
        $scope.mapSrc = $sce.trustAsResourceUrl("https://www.google.com/maps/embed/v1/directions?origin="+$scope.detail.pickuplocreadable+"&destination="+$scope.detail.destinationreadable+"&key=AIzaSyC4L6iMK1Kyw2fYOYgnRZ6AEaaMb6y_RVI");
        $scope.view = function(details){
            localStorage.setItem("detail", JSON.stringify(details));
            window.location.href = "/details";
        }
        $scope.inquire = function(){
            $('#myModal').modal('hide');
            $scope.detail.inquiry = "";
            $http.post('/inquire', {detail:$scope.detail}).then(function(res){

            }, function(err){
            });
        }
        $scope.bidNow = function(){
            $scope.detail["bid"] = $scope.bid;
            $http.put('/api/transrequests/'+$scope.detail._id, {transrequests:JSON.stringify($scope.detail)}).then(function(res){
                $scope.bid = {};
            }, function(err){
            });
        }
        $scope.markDelivered = function(){
            $http.post('/delivered', {detail:$scope.detail}).then(function(res){

            }, function(err){
            });
        }
    });