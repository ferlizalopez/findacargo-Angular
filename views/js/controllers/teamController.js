angular.module('team', ['customModule'])
    .controller('teamController', function($scope,$http,alert) {
        $scope.member = {active:false};
        $scope.users = [];
        if($scope.users.length<1){
            $http.get('/users').then(function(res){
                $scope.users = res.data.users;
            }, function(err){

            });
        }
        $scope.remove = function(user){
            
            bootbox.confirm("Are you Sure you want to delete!", function (confirmation) {
                if(confirmation) {
                     $http.delete('/user/'+user._id).then(function(res){
                        if(res.status == 204){
                            $scope.users.splice($scope.users.indexOf(user),1);
                        }
                        }, function(err){

                        });
                    }
                });
        };
        $scope.sendInviteAgain = function (userId) {
            $http.post('/resendInvite', { userId: userId }).then(function (res) {
                console.log(res.data);
                if(res.data == 200) {
                    bootbox.alert('Invitation sent successfully.');
                } else {
                    bootbox.alert('Error in Sending invitation.');
                }
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