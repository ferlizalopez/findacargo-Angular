angular.module('customModule',[]).factory('alert',function($rootScope){
    var notificationscount = JSON.parse(localStorage.getItem('notificationscount'))?JSON.parse(localStorage.getItem('notificationscount')):0;
    var notifications = JSON.parse(localStorage.getItem('notifications'))?JSON.parse(localStorage.getItem('notifications')):[];
    $.getScript('https://js.pusher.com/3.0/pusher.min.js', function(){
        var pusher = new Pusher('ed1edc67bfc5a99939f1', { authEndpoint: '/chat/pusher/auth' });
        var channel = pusher.subscribe(somethingelse._id);
        channel.bind('alerts', function(data) {
            console.log(data);
            if(data.data.length){
                $rootScope.$apply(function() {
                    notifications = notifications.concat(data.data);
                    localStorage.setItem('notifications',JSON.stringify(notifications));
                    notificationscount = notificationscount+data.data.length;
                    localStorage.setItem('notificationscount',JSON.stringify(notificationscount));
                });
            }
        });
        channel.bind('bids', function(data) {
            console.log(data);
            alert("You have recieved a bid"+JSON.stringify(data.bid));
        });

        channel.bind('delivery_accepted', function(data) {
            console.log(data);
            var pickup = data && data.delivery && data.delivery.pickUp && data.delivery.pickUp.description;
            var destination = data && data.delivery && data.delivery.dropOff && data.delivery.dropOff.description;
            alert("Your Delivery from " + pickup + " to " +destination + " has been accepted");
        });
        /* Bind to the Presence channel to show online status */
        var channel = pusher.subscribe('presence-fac');
        channel.bind('pusher:subscription_succeeded', function(members) {});
    });
    console.warn('Factory instantiated');
    return {
        getNotifications:function(){return notifications},
        getNotificationscount:function(){return notificationscount}
    }
});