/**
 * Created by SK on 9/12/2017.
 */
var module = angular.module("app");
module.component("newnotification", {
    templateUrl: "../components/newnotification/newnotification.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "$scope", controller]
});

function controller($http, $state, $scope, spinnerService) {
 
    $scope.Items = [
        {
            "value" : "created",
            "name" : "Created"
        },
        {
            "value" : "planned",
            "name" : "Assigned"
        },
        {
            "value" : "completed",
            "name" : "15 minutes before arrival"
        },
        {
            "value" : "on-way",
            "name" : "Finished"
        },
        {
            "value" : "delay",
            "name" : "Delayed"
        }
    ]

    this.test = "test";
    this.SMSContent = '';
    this.EmailContent = '';


    this.$onInit = () => {
        this.SMSContent = '';
        this.EmailContent = '';
        this.currentUserId = getCookie('userId');
    };

    this.getSMSContent = (selectedSMS) => {
        console.log("selected sms ", selectedSMS)
        fetchSMSContent($http, this.currentUserId, selectedSMS.value).then(details=>{
            if (details != null) {
                this.SMSContent = details.content;
            }
            else {
                this.SMSContent = ''
            }
        });
    }

    this.getEmailContent = (selectedEmail) => {
        fetchEmailContent($http, this.currentUserId, selectedEmail.value).then(details=>{
            if (details != null) {
                this.EmailContent = details.content;
            }
            else {
                this.EmailContent = ''
            }
        });
    }

    this.SaveContent = (selectedSMS, selectedEmail) => {
        let promises = [];

        let promise1 = new Promise((resolve, reject)=>{
            if (selectedSMS !== undefined) {
                console.log("selected sms", selectedSMS)
                let postSMS = {};
                postSMS['type'] = selectedSMS.value;
                postSMS['content'] = this.SMSContent;
                postSMS['client_id'] = this.currentUserId;
                console.log("post sms", postSMS)
                $http.post(`${API_ENDPOINT_URL}v1/template/sms`, postSMS).then(function (response) {
                    if (response.data.success === true) {
                        //alert("The content of SMS is successfully saved.")
                        resolve(true)
                    }
                    else {
                        reject(new Error('Failed update'));
                    }
                });
            }
            else {
                resolve(false);
            }
        })
        
        let promise2 = new Promise((resolve, reject)=>{
            if (selectedEmail !== undefined) {
                console.log("selected email", selectedEmail)
                let postEmail = {};
                postEmail['type'] = selectedEmail.value;
                postEmail['content'] = this.EmailContent;
                postEmail['client_id'] = this.currentUserId;

                $http.post(`${API_ENDPOINT_URL}v1/template/email`, postEmail).then(function (response) {
                    if (response.data.success === true) {
                        //alert("The content of SMS is successfully saved.")
                        resolve(true)
                    }
                    else {
                        reject(new Error('Failed update'));
                    }
                });
            }
            else {
                resolve(false);
            }
        })

        promises.push(promise1);
        promises.push(promise2);
        Promise.all(promises).then(results=>{
            alert("The content is successfully saved.");
        })
        .catch(err=>{
            alert(err.message);
        })
    }

}

function fetchSMSContent($http, currentId, selectedSMSValue) {
    console.log("seelcte tyhpe", selectedSMSValue)
    console.log("current user Id ", currentId)
    
    return $http.get(`${API_ENDPOINT_URL}v1/template/sms/${currentId}/${selectedSMSValue}`)
        .then(function (response) {
            console.log("response sms", response.data.data)
            return response.data.data;
        })
}

function fetchEmailContent($http, currentId, selectedEmailValue) {
    return $http.get(`${API_ENDPOINT_URL}v1/template/email/${currentId}/${selectedEmailValue}`)
        .then(function (response) {
            console.log("response email", response.data.data)
            return response.data.body.data;
        })
}