angular.module('viewrequests', ['customModule'])
    .controller('viewRequestsController', function($scope,$http,alert,HOST) {
        Array.prototype.max = function() {
            return Math.max.apply(null, this);
        };

        Array.prototype.min = function() {
            return Math.min.apply(null, this);
        };
        $scope.remove = function(request){
            $http.delete('/api/transrequests/'+request._id).then(function(res){
                if(res.status == 204){
                    $scope.requests.splice($scope.requests.indexOf(request),1);
                }
            }, function(err){

            });
        };
        $scope.requests = [];
        $scope.token_auth = '';
        $scope.bids = {selected:{}};
        if(!$scope.requests.length){
            $http.get('/api/transrequestss').then(function(res){
                $scope.requests = res.data.transrequestss;
                for(var i=0;i<$scope.requests.length;i++){
                    var amounts =[];
                    for(var j=0;j<$scope.requests[i].bids.length;j++){
                        amounts.push($scope.requests[i].bids[j].amount);
                        if(j == $scope.requests[i].bids.length-1){
                            $scope.requests[i].min = Math.min.apply(null, amounts);
                            $scope.requests[i].max = Math.max.apply(null, amounts);
                        }
                    }
                }
            }, function(err){

            });
        }

        $scope.deliveries = [];
        if(!$scope.deliveries.length){
            var xhr = new XMLHttpRequest();
            var url = HOST.URL + "/auth/login";
            xhr.open("POST", url, true);
            xhr.setRequestHeader("Content-type", "application/json");
            xhr.onreadystatechange = function () {
                if (xhr.readyState == 4 && xhr.status == 200) {
                    var json = JSON.parse(xhr.responseText);

                    $scope.token_auth = json.token;

                    var getV = new XMLHttpRequest();
                     getV.open("GET",HOST.URL + "/deliveries", true);
                     getV.setRequestHeader("Content-type", "application/json");
                     getV.setRequestHeader("Authorization", "JWT "+$scope.token_auth);
                     getV.onreadystatechange = function () {
                     if (getV.readyState == 4 && getV.status == 200) {
                       var json = JSON.parse(getV.responseText);
                       json = json.filter(function(delivery){
                           return delivery.type != 'scheduled';
                       })
                       $scope.$apply(function () {
                         $scope.deliveries = json;
                       });
                     }
                     };

                     getV.send("");

                }
            };
            var data = JSON.stringify({"email":$('#email').val(),"password":$('#pass').val()});
            xhr.send(data);
        }

        $scope.accept = function(request,bid){
            request.bidAction = bid;
            request.bidAction.accepted = true;
            request.bidAction.rejected = false;
            $http.put('/api/transrequests/'+request._id, {transrequests:JSON.stringify(request)}).then(function(res){
                console.log(res);
            }, function(err){
            });
        };
        $scope.reject = function(request,bid){
            request.bidAction = bid;
            request.bidAction.accepted = false;
            request.bidAction.rejected = true;
            $http.put('/api/transrequests/'+request._id, {transrequests:JSON.stringify(request)}).then(function(res){
                console.log(res);
            }, function(err){
            });
        };
        $scope.viewRequest = function(request){
            localStorage.setItem('requestbids',JSON.stringify(request));
            window.location.href = "/bids";
        }
        $scope.viewDelivery = function(delivery){
            localStorage.setItem('delivery',JSON.stringify(delivery));
            window.location.href = "/deliveryDetail";
        }
        $scope.cancel = function(delivery, index){
            var cancelDelivery = new XMLHttpRequest();
            cancelDelivery.open("POST",HOST.URL+"/deliveries/" + delivery.id + "/cancel", true);
            cancelDelivery.setRequestHeader("Content-type", "application/json");
            cancelDelivery.setRequestHeader("Authorization", "JWT "+$scope.token_auth);
            cancelDelivery.onreadystatechange = function () {
                if (cancelDelivery.readyState == 4 && cancelDelivery.status == 200) {
                    var json = JSON.parse(cancelDelivery.responseText);
                    //console.log(json);
                    console.log(json);
                    delivery.status.description = "Canceled";
                    delivery.status.id = 5;
                    $scope.$apply();
                } else {
                    if(cancelDelivery.status == 505)
                    {

                    }
                }
            };
            cancelDelivery.send();
        }
    });