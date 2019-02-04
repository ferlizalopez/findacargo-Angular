/**
 * Created by SK on 9/8/2017.
 */
var module = angular.module("app");
module.component("departments", {
    templateUrl: "../components/departments/departments.component.html",
    controllerAs: "model",
    controller: ["$http", "$state", "urlService", controller]
});

function controller($http, $state, urlService){
    this.departments = [];
    $http.get('/delivery_settings/')
    .then(response => {
        this.deliveryTypes = ["Distribution", "Dedicated Drivers"];
        var depts = []
        if(getCookie('departmentData') != ''){
            //console.log(JSON.parse(getCookie('departmentData')).departments);
            depts = JSON.parse(getCookie('departmentData')).departments;
            depts.map(function(obj){obj.editorEnabled=false;return obj;});
        }

        console.log('depts', depts, getCookie('departmentData'))

        if (response.data.body) {
            var setting = response.data.body
        
            if (!setting.allow_express) {
                depts = depts.filter(o=>{
                    return o.typeOfDelivery != 'Express / On-demand'
                })
            } else {
                this.deliveryTypes = ["Distribution", "Dedicated Drivers", "Express / On-demand"];
            }
        }

        this.departments = depts
    })
    this.editorEnabled = false;
    this.duplicatedError = false

    this.toggleCheckbox = function(elem){
        if (elem.department.default){
            this.departments.map(function(obj){obj.default = false;return obj;});
        }
        elem.department.default = true;
        this.submit();
    };

    this.addNew = function(){
        if(this.departments.length == 0){
            this.departments.push({ 
            'name': "", 
            'typeOfDelivery': "Distribution",
            'default': true,
            'editorEnabled': true
            });
        }
        else {
            var hasDefault = this.departments.filter(function(obj){return obj.default});
            this.departments.push({ 
                'name': "", 
                'typeOfDelivery': "Distribution",
                'default': !(hasDefault.length > 0) ,
                'editorEnabled': true
            });
        }
    };

    this.remove = function(val){
        this.departments = this.departments.filter(function( obj ) {
        return obj.name !== val;
        });
        this.submit();
    };  

    this.edit = function(elem){
        elem.editorEnabled = true;
    }; 

    this.save = function(elem){
        var depts = _.filter(this.departments, (d)=>{
            return d.name == elem.name
        })
        this.duplicatedError = (depts.length > 1)

        if(!this.duplicatedError) {
            this.departments.map(function(obj){obj.editorEnabled=false;return obj;});
            this.submit();
        }
    };

    this.cancel = function(e){
        this.editorEnabled = false;
    };    

    this.submit = function() {
        var reqBody = {};
        reqBody["departments"] = this.departments
        let cookieDepartmentData = JSON.parse(getCookie('departmentData'));

        if(cookieDepartmentData&&cookieDepartmentData.departments
        &&cookieDepartmentData.departments.length>0){
            console.log('reqBody', reqBody)
            $http({
                method: 'PUT',
                url: urlService.getApiUrl()+'/v1/departments/update',
                data: reqBody,
                headers: {
                    "Content-Type": "application/json",
                    "token": getCookie('apikey')
                }
            }).then(function (response) {
                    data = response.data;
                    console.log('result', data)

                    delete data._id;
                    $.cookie('departmentData', JSON.stringify(data));
                },function (error){
                    console.log('error -', error);
                });
        }
        else{
            
            $http({
                method: 'POST',
                url: urlService.getApiUrl()+'/v1/departments/create',
                data: angular.toJson(reqBody),
                headers: {
                    "Content-Type": "application/json",
                    "token": getCookie('apikey')
                }
            }).then(function (response) {
                    data = response.data;
                    delete data._id;
                    $.cookie('departmentData', JSON.stringify(data));
                },function (error){
                    console.log('error -', error);
                });            
        }
    }; 
}