/**
 * Created by jeton on 6/20/2017.
 */
var app = angular.module('app', [
    'ui.router',
    'ngFileUpload',
    '720kb.datepicker',
    'google.places',
    'ngAnimate',
    'toastr',
    'ui.bootstrap',
    'btford.socket-io',
    'autoCompleteModule',
    'ngSanitize',
    'pascalprecht.translate',
    'chart.js',
    'ng-drag-scroll'
]);

app.constant('_',
    window._
);

app.config(config);

config.$inject = [
    '$stateProvider',
    '$urlRouterProvider',
    '$locationProvider',
    '$translateProvider'
];

function config($stateProvider, $urlRouterProvider, $locationProvider, $translateProvider ) {

    $urlRouterProvider.otherwise('/home');
    
    $stateProvider
        .state('/buyer', {
            url: '/buyer',
            component: 'buyer',
            resolve: {
                security: ['$q', function ($q) {

                }]
            }
        })
        .state('/driver', {
            url: '/driver',
            component: 'driver'
        })

        .state('invite', {
            url: '/invite',
            component: 'invite'
        })

        .state('coworkers', {
            url: '/coworkers',
            component: 'coworkers'
        })

        // .state('accountStatement', {
        //     url: '/accountStatement',
        //     component: 'accountStatement'
        // })

        .state('roles', {
            url: '/roles',
            component: 'userroles'
        })

        .state('notifications', {
            url: '/notifications',
            component: 'notificationsettings'
        })

        .state('newnotification', {
            url: '/newnotification',
            component: 'newnotification'
        })

        .state('userapisettings', {
            url: '/userapisettings',
            component: 'userapisettings'
        })

        .state('departments', {
            url: '/departments',
            component: 'departments'
        })

        .state('usernotificationsettings', {
            url: '/usernotificationsettings',
            component: 'usernotificationsettings'
        })

        .state('changepassword', {
            url: '/changepassword',
            component: 'changepassword'
        })

        .state('userpickupsettings', {
            url: '/userpickupsettings',
            component: 'userpickupsettings'
        })

        .state('changePass', {
            url: '/changepass/:token',
            component: 'changePass'
        })

        .state('deliverydetails', {
            url: '/deliverydetails/:deliveryid',
            component: 'deliverydetails'
        })

        .state('deliveryrequest', {
            url: '/deliveryrequest',
            component: 'deliveryrequest'
        })

        .state('weeklydeliveries', {
            url: '/weekly',
            component: 'weeklydeliveries'
        })

        .state('weeklydeliveriesDepartment', {
            url: '/weekly/:departmentname',
            component: 'weeklydeliveries'
        })

        .state('dailydeliveries', {
            url: '/daily-deliveries/:year/:weeknumber/:day',
            component: 'dailydeliveries'
        })

        .state('dailydeliveriesDepartment', {
            url: '/daily-deliveries/:year/:weeknumber/:day/:departmentname',
            component: 'dailydeliveries'
        })

        .state('statistics', {
            url: '/statistics',
            component: 'statistics'
        })

        .state('integrations', {
            url: '/integrations',
            component: 'integrations'
        })

        .state('plannedpickups', {
            url: '/pickups',
            component: 'plannedpickups'
        })

        .state('uploadAndPlanDeliveries', {
            url: '/upload/plan',
            component: 'uploaddeliveries'
        })

        .state('uploadPreplannedDeliveries', {
            url: '/upload/preplanned',
            component: 'uploaddeliveries'
        })

        .state('editdeliveries', {
            url: '/delivery/:id/edit',
            component: 'editdeliveries'
        })
        .state('home', {
            url: '/home',
            component: 'home'
        })

        .state('weeklyreturns', {
            url: '/weekly-returns',
            component: 'weeklyreturns'
        })
        .state('weeklyreturnsDepartment', {
            url: '/weeklyreturns/:departmentname',
            component: 'weeklyreturns'
        })

        .state('dailyreturns', {
            url: '/daily-returns/:year/:weeknumber/:day',
            component: 'dailyreturns'
        })

        .state('returndetails', {
            url: '/returndetails/:deliveryid',
            component: 'returndetails'
        })

         .state('returnrequest', {
             url: '/returnrequest',
             component: 'returnrequest',
             params: {returned_delivery: null}
        })

        .state('editreturns', {
            url: '/return/:id/edit',
            component: 'editreturns'
        })
        .state('paymentSteps', {
            url: '/payment',
            component: 'paymentsteps'
        })
        .state('ratings', {
            url: '/ratings',
            component: 'ratings'
        });

    $translateProvider.useStaticFilesLoader({
        prefix: '/translations/',
        suffix: '.json'
    }).preferredLanguage('en');

}

function getCookie(cname) {
    var name = cname + "=";
    var decodedCookie = decodeURIComponent(document.cookie);
    var ca = decodedCookie.split(';');
    for (var i = 0; i < ca.length; i++) {
        var c = ca[i];
        while (c.charAt(0) == ' ') {
            c = c.substring(1);
        }
        if (c.indexOf(name) == 0) {
            return c.substring(name.length, c.length);
        }
    }
    return "";
}

function setCookie(cname, cvalue, exdays) {
    var d = new Date();
    d.setTime(d.getTime() + (exdays*24*60*60*1000));
    var expires = "expires="+ d.toUTCString();
    document.cookie = cname + "=" + cvalue + ";" + expires + ";path=/";
}

getCookie();