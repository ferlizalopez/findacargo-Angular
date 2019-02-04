var module = angular.module("app");
module.component("deliverydetails", {
    templateUrl: "../components/deliverydetails/deliverydetails.component.html",
    controllerAs: "model",
    controller: ["$http", "$stateParams", "$scope", "$state", "$window", "$timeout", "statusService", "socketService", "urlService", "deliveryService", "storageService", "$translate", controller]
});

function controller($http, $stateParams, $scope, $state, $window, $timeout, statusService, socketService, urlService, deliveryService, storageService, $translate) {
    this.deliveryId = $stateParams.deliveryid;
    this.API_ENDPOINT_URL = urlService.getApiUrl();
    this.eventsList = [];
    this.pickupcoordinates = [];
    this.deliverycoordinates = [];
    this.updateTruckPosition = false;
    this.showClaim = [
        '',
        'Driver reported an Issue: ' + $translate.instant("delivery_details.report_damaged_box"),
        'Driver reported an Issue: ' + $translate.instant("delivery_details.client_does_not_answer"),
        'Driver reported an Issue: ' + $translate.instant("delivery_details.missing_box"),
        'Driver reported an Issue: ' + $translate.instant("delivery_details.another_report"),
    ];
    this.notificationDetail = {}
    this.notificationMessage = "";
    this.customNotificationMessage = "";
    this.deliveryNotificated = {};
    this.notificationPatterns = [];
    this.approved = storageService.getApproved();
    this.trackDomain = urlService.getTrackingUrl();

    this.returnedData = [];
    this.returnedStatus = 0;

    this.rating = null;

    this.googleMap = null;
    console.log("deliveries ==>")

    $scope.delivered_at = ""
    this.initSocket = () => {
        console.log("called init socket")
        // if (!this.updateTruckPosition) {
        //     return;
        // }

        this.socket = socketService.connect();

        let that = this;
        console.log("that.details.status Info", this.details)
        if (this.socket) {
            console.log("socket is created", this.truck)
            if(this.truck && this.truck._id) {
                this.socket.on(`vehicle_location_changed_${this.truck._id}`, function (data) {
                    console.log("socket event data", data)
                    let newPosition = new google.maps.LatLng(data.latitude, data.longitude);
                    
                    if (that.truckMarker) {
                        that.truckMarker.setPosition(newPosition);
                    }
                    else if (parseInt(that.details.status) === 2) {
                        let truckPoint = {lng: parseFloat(data.longitude), lat: parseFloat(data.latitude)};
                        
                        let showLabel = "";

                        console.log("deliver", this.details)

                        var bounds = new google.maps.LatLngBounds();

                        if (this.pickupcoordinates && this.deliverycoordinates) {
                            let pointA = { lng: parseFloat(this.pickupcoordinates[0]), lat: parseFloat(this.pickupcoordinates[1]) },
                                pointB = { lng: parseFloat(this.deliverycoordinates[0]), lat: parseFloat(this.deliverycoordinates[1]) },
    
                            map = new google.maps.Map(document.getElementById('routemap'), {
                                zoom: 15,
                                center: centerP
                            });

                            var bounds = new google.maps.LatLngBounds();
                            // bounds.extend(pointA);
                            bounds.extend(truckPoint);
                            bounds.extend(pointB);

                            if (this.googleMap != null) {
                                this.googleMap.fitBounds(bounds);
                            }
                        }
                        
                        if (!this.details.delivered_at && this.details.estimated_delivery_time) {
                            showLabel = this.details.estimated_delivery_time;
                        }
                        else {
                            showLabel = this.details.deliverywindowend;
                        }

                        that.truckMarker = new google.maps.Marker({
                            position: truckPoint,
                            icon:'img/truck.png',
                            map: that.googleMap,
                            label: {
                            text: showLabel,
                            color: "#ffffff",
                            fontSize: "13px",
                            }
                        });
                    }
                        
                    if (that.mapOptions.waypoints&&that.mapOptions.waypoints.length>0) {
                        //Add new truck position to current track 
                        that.mapOptions.waypoints.push({location: newPosition, stopover: false});
                    }
                    else {
                        that.mapOptions.waypoints = [{location: newPosition, stopover: false}];
                    }
                    that.displayRoute();
                });
            }

            this.socket.on(`delivery_status_changed_${this.deliveryId}`, function (data) {
                console.log("socket event data[delivery_status_changed]", data)
                that.getEventsList()
            });
        }
    };

    this.initializeMap = () => {
        let pointA = { lng: parseFloat(this.pickupcoordinates[0]), lat: parseFloat(this.pickupcoordinates[1]) },
            pointB = { lng: parseFloat(this.deliverycoordinates[0]), lat: parseFloat(this.deliverycoordinates[1]) },
            
            map = new google.maps.Map(document.getElementById('routemap'), {
                zoom: 1,
                center: pointA
            });

        this.googleMap = map;

        this.directionsService = new google.maps.DirectionsService;
        this.directionsDisplay = new google.maps.DirectionsRenderer({
            map: map,
            suppressMarkers: false
        });

        this.mapOptions = {
            origin: pointA,
            destination: pointB,
            avoidTolls: true,
            avoidHighways: false,
            travelMode: google.maps.TravelMode.DRIVING
        };

        this.updateTruckPosition = this.truck
            && this.truck.liveDelivery
            && this.truck.liveDelivery.location
            && parseInt(this.details.status) === 2;

            console.log("update Truck position", this.updateTruckPosition)
        let truckPoint = null;
        if (this.updateTruckPosition) {
            
            let coordinates = this.truck.liveDelivery.location.coordinates;
            let tracks = this.truck.liveDelivery.location.tracks;

            if (tracks&&tracks.length>0) {
                //For new track model structure
                let wayPoints = [];
                truckPoint = {lng: parseFloat(tracks[tracks.length-1].lng), lat: parseFloat(tracks[tracks.length-1].lat)};
    
                tracks.map(track=>{
                    wayPoints.push({
                        location:new google.maps.LatLng(parseFloat(track.lat), parseFloat(track.lng)),
                        stopover:false
                    })
                })
                this.mapOptions.waypoints = wayPoints;
                this.mapOptions.optimizeWaypoints = true;
            }
            else if (coordinates&&coordinates.length>0) {
                //For still working with legacy track model
                truckPoint = {lng: parseFloat(coordinates[0]), lat: parseFloat(coordinates[1])};
                waypoint = new google.maps.LatLng(parseFloat(coordinates[1]), parseFloat(coordinates[0]));
                this.mapOptions.waypoints = [{location: waypoint, stopover: false}];
                this.mapOptions.optimizeWaypoints = true;
            }

            if (truckPoint) {
                let showLabel = "";

                console.log("deliver", this.details)
                if (!this.details.delivered_at && this.details.estimated_delivery_time) {
                    
                    showLabel = this.details.estimated_delivery_time;
                }
                else {
                    showLabel = this.details.deliverywindowend;
                }

                this.truckMarker = new google.maps.Marker({
                    position: truckPoint,
                    icon:'img/truck.png',
                    map: map,
                    label: {
                    text: showLabel,
                    color: "#ffffff",
                    fontSize: "13px",
                    }
                });
            }
        }
        // 12.6082901, lat: 55.722582}
        if (this.updateTruckPosition) {
            this.directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: false,
                preserveViewport: true
            });
            console.log("yes truck point ")
            var bounds = new google.maps.LatLngBounds();
            if(truckPoint)
                bounds.extend(truckPoint);
            bounds.extend(pointB);
            map.fitBounds(bounds);
        }
        else {
            console.log("no truck point ")
            this.directionsDisplay = new google.maps.DirectionsRenderer({
                map: map,
                suppressMarkers: false
            });
            var bounds = new google.maps.LatLngBounds();
            bounds.extend(pointA);
            bounds.extend(pointB);
            map.fitBounds(bounds);
        }

        this.displayRoute();
    };

    this.displayRoute = () => {
        $scope.mapError = '';
        let that = this;
        this.directionsService.route(this.mapOptions, (response, status) => {
            if (status == google.maps.DirectionsStatus.OK) {
                this.directionsDisplay.setDirections(response);
            } else {
                //ignore current position and try again
                this.mapOptions.waypoints = []
                this.directionsService.route(this.mapOptions, (response, status) => {
                    if (status == google.maps.DirectionsStatus.OK) {
                        this.directionsDisplay.setDirections(response);
                    } else {
                        $scope.mapError = 'Error occured while calculating the route';
                        $scope.$apply();
                    }
                })
            }
        });
    };

    this.returnDelivery=()=> {
        $state.go('returnrequest', {returned_delivery: this.details})
    }

    Date.prototype.getWeek = function () {
        let onejan = new Date(this.getFullYear(), 0, 1);
        return Math.ceil((((this - onejan) / 86400000) + onejan.getDay() + 1) / 7);
    };

    this.getLocalTime = (timestr) => {
        return moment(new Date(`2018-01-01T${timestr}:00.000Z`)).format("hh:mm A")
    }

    this.getLocalDanTime = (timestr) => {
        let date = new Date(`2018-01-01T${timestr}:00.000Z`);
        date.setHours(date.getHours() - 1);
        return moment(date).format("hh:mm A")
    }

    this.formatCountryCode = (code) => {
        if (!code) {
            return '';
        }
        if(!code.startsWith ("+")){
            return '+' + code
        }

        return code
    }

    this.deliverydetails = () => {
        $http.get('/deliverydetails/' + this.deliveryId)
            .then(response => {
                if (parseInt(response.status) === 200) {
                    console.log("delivery details content", response)
                    this.details = response.data.body.delivery;
                    console.log("this.details", this.details)
                    $scope.delivered_at = this.details.delivered_at
                    this.truck = response.data.body.truck;
                    this.driver = response.data.body.driver;
                    this.zone = response.data.body.zone
                    $scope.deletable = deliveryService.checkForDeletable(this.details);
                    this.pickupcoordinates = this.details.pickupcoordinates;
                    this.deliverycoordinates = this.details.deliverycoordinates;
                    this.initializeMap();
                    this.initSocket();
                    this.details.statusText = statusService.getStatus(this.details.status);
                    this.details.deliverynotes = (this.details.deliverynotes||'').replace(/(?:\r\n|\r|\n)/g, '<br>');
                    this.deliveredAt = this.details.delivered_at
                    if (!this.details.deliverynumberofpackages) {
                        this.details.deliverynumberofpackages = 1;
                        this.setDeliveryBoxes();
                    } else if (!Number.isInteger(this.details.deliverynumberofpackages)) {
                        this.details.deliverynumberofpackages = parseInt(this.details.deliverynumberofpackages);
                    }

                    this.getEventsList();
                    //Driver test code
                    /*this.driver = {
                        email:"abc",
                        name:"dafd"
                    }*/

                    /* get the returne data from API */
                    if (response.data.body.returned) {
                        this.returnedData = response.data.body.returned;
                        this.returnedStatus = 0;
                        for (var i = 0; i < this.returnedData.length; i++) {
                            let singleData = this.returnedData[i];
                            if (singleData.status != 0) {
                                this.returnedStatus = 1;
                                break;
                            }
                        }
                    }

                    /* get the rating data from API */
                    if (response.data.body.rating) {
                        this.rating = response.data.body.rating;
                        console.log("this.rating==>", this.rating)
                    }
                }
            },
                (error) => {
                    if (parseInt(error.status) === 400) {
                        window.location.href = '/#!/home';
                    }
                }
            )
    };

    this.changeBoxesCount = (increase) => {
        if (increase) {
            this.details.deliverynumberofpackages++
        } else {
            if (parseInt(this.details.deliverynumberofpackages) === 1) return false;
            this.details.deliverynumberofpackages--;
        }

        this.setDeliveryBoxes();
    };

    this.setBoxesCount = () => {
        if (!Number.isInteger(this.details.deliverynumberofpackages)) {
            this.details.deliverynumberofpackages = 1;
        }
        this.setDeliveryBoxes();
    };

    this.openLabelsSite = () => {
        if (window.location.hostname == 'localhost') {
            window.open('http://localhost:1234/' + this.details._id, '_blank');
        } else if('dev.labels.goidag.com') {
            window.open('https://labels.goidag.com/' + this.details._id, '_blank');
        } else {
            window.open('https://labels.goidag.com/' + this.details._id, '_blank');
        }
        
    };

    this.setDeliveryBoxes = () => {
        $http.put('/set-delivery-boxes/' + this.details._id, { count: this.details.deliverynumberofpackages }).then(function (res) {
            console.log(res);
        }, function (err) {
        });
    };

    this.deleteDelivery = (id) => {
        if (confirm($translate.instant("delivery_details.are_you_sure"))) {
            //Delete the delivery
            $http.delete('/delete_delivery/' + id)
                .then(res => {
                    if (res.data.success === true) {
                        window.location.href = '/#!/weekly';
                    }
                })
        } else {
            // Do nothing!
        }
    };

    function removeDuplicates(myArr, prop) {
        return myArr.filter((obj, pos, arr) => {
            return arr.map(mapObj => mapObj[prop]).indexOf(obj[prop]) === pos;
        });
    }

    this.getEventsList = function () {
        $http.get(`${this.API_ENDPOINT_URL}/v1/scheduled/${this.deliveryId}/events`).then((response) => {
            this.eventsList = response.data;
            this.eventsList = removeDuplicates(this.eventsList, 'event_data')
            $http.get(`${this.API_ENDPOINT_URL}/v1/deliveries/${this.deliveryId}/claim`).then((response) => {
                _.each(response.data, (claim)=>{
                    var obj = _.find(this.eventsList, (o)=>{
                        return o._id == claim._id
                    })
                    if(!obj) {
                        claim.claim = true;
                        this.eventsList.push(claim);
                    }
                })

                console.log('this.eventsList', this.eventsList)
            });
        });
    };

    this.getNotificationTemplates = function() {
        let authToken = JSON.parse(localStorage.getItem('apikey'));

        return $http({
            method: 'GET',
            url: `${this.API_ENDPOINT_URL}/v1/scheduled/events/notification`,
            headers: {'Token': authToken}
        })
        .then((response) => {
            this.notificationPatterns = response.data;
            this.notificationMessage = 'Other';
        })
    };

    this.sendNotifications = function() {
        let authToken = JSON.parse(localStorage.getItem('apikey'));
        let message = this.notificationMessage !== 'Other' ? this.notificationMessage : this.customNotificationMessage;

        $http({
            method: 'POST',
            url: `${this.API_ENDPOINT_URL}/v1/scheduled/events/notification`,
            data: {notificationMessage: message, deliveryIds: [this.deliveryId], token: authToken},
            headers: {'Token': authToken}
        })
        .then(res => {
            if(res && res.data) {
                this.deliveryNotificated.success = res.data[0].success;
                this.deliveryNotificated.message = res.data[0].message;
                this.deliveryNotificated.display = true;
            } else {
                window.alert("Error occurred");
            }
            $timeout(() => {
                this.deliveryNotificated.display = false;
            }, 9000);
        },(err) => {
            window.alert("Error occurred: " + err.data.error);
        })
    };

    this.getEventMessage =  (event) => {
        if (event.event == "ADMIN_EVENT") {
            return 'Nemlevering says "' + event.event_data + '"';
        }
        else if (event.event == 'STATUS_UPDATE') {
            return statusService.getStatus(parseInt(event.event_data) - 1);
        } 
        else {
            if(event.event_data == 'Delivery completed') {
                if (this.driver) {
                    return event.event_data + `(by ${this.driver.name} / ${this.driver.phone})`
                }
            }
            else if (event.event_data == 'Notification sent (SMS): Delivery is on the way') {
                return 'Notification sent (SMS): Delivery is arriving in ~15 minutes';
            }
            else if (event.event_data == 'Notification sent (Email): Delivery is on the way') {
                return 'Notification sent (Email): Delivery is arriving in ~15 minutes';
            }
            return event.event_data;
        }
    };

    this.hasContent = (event) => {
        if(!event) return false

        if(event.message) return true

        if(event.ClaimType == 3 && (event.imgURLS[0] || event.imgURLS[1] || event.imgURLS[2] || event.imgURLS[3])) {
            return true
        }

        if(event.ClaimType == 1 && event.image) return true

        return false
    }

    this.setNotificationData = (event) =>{
        if(!event) {
            this.notificationDetail = {}
            return
        }
        if(!event.event_detail) {
            this.notificationDetail = {}
            //return
        } else {
            this.notificationDetail = JSON.parse(event.event_detail)        
        }
        this.notificationDetail.title = event.event_data

        if(this.notificationDetail.title == 'Delivery completed' && this.details.signature) {
            this.notificationDetail.signature = `data:image/png;base64,${this.details.signature}`
        }
    }

    this.goBack = function () {
        $window.history.back();
    };

    this.$onInit = () => {
        this.deliverydetails();
        this.getNotificationTemplates();
    };


    this.$onDestroy = function () {
        if (this.socket) {
            this.socket.disconnect();
        }
    };

}
