angular.module('invite', ['customModule'])
    .controller('inviteController', function($scope,$http,alert,$timeout) {
        $scope.members = [{type:'admin'},{type:'admin'},{type:'admin'}];
        $scope.lng = i18n.detectLanguage();
        $scope.addMember = function(){
            $http.post('/users', {user:$scope.members}).then(function(res){
                if(res && res.data){
                    _.forEach($scope.members, function(member){
                        var addedMember = _.filter(res.data, function(user){
                            return user.userAdded && user.userAdded.email == member.email;
                        });
                        if(addedMember.length){
                            member.success = true;
                            member.mailSent = addedMember[0].mailSent;
                        } else {
                            member.error = member.email ? true : false;
                        }
                    });
                } else {
                    window.alert("Error occurred: ");
                }
                $timeout(function(){
                    $scope.members = [{type:'admin'},{type:'admin'},{type:'admin'}];
                }, 5000);
            }, function(err){
                window.alert("Error occurred: "+err.data.error);
            });
        }

    });