angular.module('buyerFleetDrivers', ['customModule'])
    .controller('buyerFleetDriversController', function ($scope, $http) {
        $scope.member = {active:false};
        $scope.users = carriers;    
        $scope.language= lng = i18n.detectLanguage();
        var cnf, cancelText;
        if(lng === 'en') {
            cnf = 'Are you sure you want to delete?';
            cancelText = 'Cancel';
        } else if(lng === 'da') {
            cnf = 'Er du sikker på, at du vil slette?';
            cancelText = 'Annuller';
        }

        $scope.remove = function(user){
            bootbox.confirm({
                message : cnf,
                buttons: {
                    'cancel': {
                        label: cancelText
                    },
                    'confirm': {
                        label: 'OK'
                    }
                }, 
                callback : function (confirmation) {
                    if(confirmation) {
                        $http.delete('/user/'+user._id).then(function(res){
                            if(res.status == 204){
                                $scope.users.splice($scope.users.indexOf(user),1);
                            }
                        }, function(err){

                        });
                    }
                }
            });
        };
        $scope.sendInviteAgain = function (userId) {
            $http.post('/resendInvite', { userId: userId }).then(function (res) {
                bootbox.alert('Invitation sent successfully.');
            }, function (err) {

            });
        }
        $scope.edit = function(user){
            user.edit = true;
        };
        $scope.editAction = function(user,type){
            if(type){
                user.edit = false;
                $http.put('user/'+user._id, {user:user}).then(function(res){
                    console.log(res.data);
                }, function(err){

                });
            }
            else{
                user.edit = false;
            }
        };
    });