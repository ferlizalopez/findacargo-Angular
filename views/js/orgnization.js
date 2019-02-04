$(document).ready(function () {
    
    //select as individual or company
    $('#individual').click(function () {
        $('#individual_detail').show();
        $('#company_detail').hide();
    });

    $('#company').click(function () {
        $('#company_detail').show();
        $('#individual_detail').hide();
    });
    //is having insurance
    $('#insuranceYes').click(function () {
        $('#insurance_detail').show();
    });
    $('#insuranceNo').click(function () {
        $('#insurance_detail').hide();
    });

    //having licence
    $('#otherLicenseYes').click(function () {
        $('#haulage_license').show();
    });
    $("#otherLicenseNo,#otherLicenseNotSure,#otherLicenseNotApp").click(function () {
        $('#haulage_license').hide();
    });

    // having special transport licence
    $('#specialTransportYes').click(function () {
        $('#special_transport').show();
    });
    $("#specialTransportNo,#specialTransportNotSure,#specialTransportNotApp").click(function () {
        $('#special_transport').hide();
    });
    //having commercial licence
    $('#commercialLicenceYes').click(function () {
        $('#commercial_licence').show();
    });
    $("#commercialLicenceNo,#commercialLicenceNotSure,#commercialLicenceNotApp").click(function () {
        $('#commercial_licence').hide();
    });

    //Provide service for rail transportation 
    $('#railwayServiceYes').click(function () {
        $('#railway_service').show();
    });
    $("#railwayServiceNo,#railwayServiceNotSure,#railwayServiceNotApp").click(function () {
        $('#railway_service').hide();
    });

    //air service
    $('#airServiceYes').click(function () {
        $('#air_service').show();
    });
    $("#airServiceNo").click(function () {
        $('#air_service').hide();
    });

    //ship service
    $('#shipServiceYes').click(function () {
        $('#ship_service').show();
    });
    $("#shipServiceNo").click(function () {
        $('#ship_service').hide();
    });


    $('#individual').click(function() {
        if($('#individual').is(':checked')) { 
            $('#company_detail').find('input').attr('disabled', 'disabled');
            $('#individual_detail').find('input').removeAttr('disabled');  
        }
    });

    $('#company').click(function() {
        if($('#company').is(':checked')) { 
            $('#individual_detail').find('input').attr('disabled', 'disabled');
            $('#company_detail').find('input').removeAttr('disabled'); 
        }
    });





// licence upload zone

    var accept = ".pdf,.doc,.docx,.jpg,.jpeg,.png";
    var licenceImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.licenceUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,        
        clickable: ".fileinput-licence",
        init: function () {
            this.on("addedfile", function (file) {
                if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
            this.on("success", function (file, response) {
                    var imgUrl = response ;
                    var fileName = file.name;
                    if (licenceImageArr.length) {
                        for (var i in licenceImageArr) {
                            if (licenceImageArr[i]["imageName"] != fileName) {
                                licenceImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        licenceImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }
                    var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);
                })
                
        },
        removedfile: function (file) {
            console.log(licenceImageArr);            
            var fileName = file.name;
            var filePath = "";
            for (var i in licenceImageArr) {
                if (licenceImageArr[i]["imageName"] == fileName) {
                    filePath = licenceImageArr[i]["imageUrl"];
                    licenceImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#licenceUpload').dropzone();



    //for insurance upload         

    var insuranceImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.insuranceUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,
        clickable: ".fileinput-insurance",
        init: function () {
            this.on("addedfile", function (file) {
                if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
            this.on("success", function (file, response) {
                    
                    var imgUrl = response ;
                    var fileName = file.name;
                    if (insuranceImageArr.length) {
                        for (var i in insuranceImageArr) {
                            if (insuranceImageArr[i]["imageName"] != fileName) {
                                insuranceImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        insuranceImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }
                    var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);

                })
        },
        removedfile: function (file) {
            console.log(insuranceImageArr);
            var fileName = file.name;
            var filePath = "";
            for (var i in insuranceImageArr) {
                if (insuranceImageArr[i]["imageName"] == fileName) {
                    filePath = insuranceImageArr[i]["imageUrl"];
                    insuranceImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#insuranceUpload').dropzone();



    //for haulage upload          

    var haulageImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.haulageUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,
        clickable: ".fileinput-haulage",
        init: function () {
            this.on("addedfile", function (file) {
                 if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
            this.on("success", function (file, response) {
                    console.log(response);
                    console.log(file);
                    var imgUrl = response ;
                    var fileName = file.name;
                    if (haulageImageArr.length) {
                        for (var i in haulageImageArr) {
                            if (haulageImageArr[i]["imageName"] != fileName) {
                                haulageImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        haulageImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }
                    var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);

                })
        },
        removedfile: function (file) {
            console.log(haulageImageArr);
            var fileName = file.name;
            var filePath = "";
            for (var i in haulageImageArr) {
                if (haulageImageArr[i]["imageName"] == fileName) {
                    filePath = haulageImageArr[i]["imageUrl"];
                    haulageImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#haulageUpload').dropzone();


    //for special upload          

    var specialImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.specialUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,
        clickable: ".fileinput-special",
        init: function () {
            this.on("addedfile", function (file) {
                 if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
                this.on("success", function (file, response) {
                    console.log(response);
                    console.log(file);
                    var imgUrl = response ;
                    var fileName = file.name;
                    if (specialImageArr.length) {
                        for (var i in specialImageArr) {
                            if (specialImageArr[i]["imageName"] != fileName) {
                                specialImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        specialImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }

                   var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);

                })
        },
        removedfile: function (file) {
            console.log(specialImageArr);
            var fileName = file.name;
            var filePath = "";
            for (var i in specialImageArr) {
                if (specialImageArr[i]["imageName"] == fileName) {
                    filePath = specialImageArr[i]["imageUrl"];
                    specialImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#specialUpload').dropzone();


    //for commercial Upload  

    var commercialImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.commercialUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,
        clickable: ".fileinput-commercial",
        init: function () {
            this.on("addedfile", function (file) {
                 if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
            this.on("success", function (file, response) {
                    console.log(response);
                    console.log(file);
                    var imgUrl = response ;
                    var fileName = file.name;
                    if (commercialImageArr.length) {
                        for (var i in commercialImageArr) {
                            if (commercialImageArr[i]["imageName"] != fileName) {
                                commercialImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        commercialImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }
                    var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);

                })
        },
        removedfile: function (file) {
            console.log(commercialImageArr);
            var fileName = file.name;
            var filePath = "";
            for (var i in commercialImageArr) {
                if (commercialImageArr[i]["imageName"] == fileName) {
                    filePath = commercialImageArr[i]["imageUrl"];
                    commercialImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#commercialUpload').dropzone();



    // for railway Upload 

    var railwayImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.railwayUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,
        clickable: ".fileinput-railway",
        init: function () {
            this.on("addedfile", function (file) {
                 if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
            this.on("success", function (file, response) {
                    console.log(response);
                    console.log(file);
                    var imgUrl = response;
                    var fileName = file.name;
                    if (railwayImageArr.length) {
                        for (var i in railwayImageArr) {
                            if (railwayImageArr[i]["imageName"] != fileName) {
                                railwayImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        railwayImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }
                    var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);
                  
                })
        },
        removedfile: function (file) {
            console.log(railwayImageArr);
            var fileName = file.name;
            var filePath = "";
            for (var i in railwayImageArr) {
                if (railwayImageArr[i]["imageName"] == fileName) {
                    filePath = railwayImageArr[i]["imageUrl"];
                    railwayImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#railwayUpload').dropzone();

    // for air Upload 

    var airImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.airUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,
        clickable: ".fileinput-air",
        init: function () {
            this.on("addedfile", function (file) {
                 if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
            this.on("success", function (file, response) {
                    console.log(response);
                    console.log(file);
                    var imgUrl = response ;
                    var fileName = file.name;
                    if (airImageArr.length) {
                        for (var i in airImageArr) {
                            if (airImageArr[i]["imageName"] != fileName) {
                                airImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        airImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }
                    var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);

                })
        },
        removedfile: function (file) {
            console.log(airImageArr);
            var fileName = file.name;
            var filePath = "";
            for (var i in airImageArr) {
                if (airImageArr[i]["imageName"] == fileName) {
                    filePath = airImageArr[i]["imageUrl"];
                    airImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#airUpload').dropzone();


    // for ship Upload 

    var shipImageArr = [];
    Dropzone.autoDiscover = false;
    Dropzone.prototype.defaultOptions.dictRemoveFile = 'Remove';
    Dropzone.options.shipUpload = {
        url: '/fleetUpload',
        maxFilesize: 6,
        maxFiles: 3,
        addRemoveLinks: true,
        acceptedFiles: accept,
        clickable: ".fileinput-ship",
        init: function () {
            this.on("addedfile", function (file) {
                 if (this.files.length) {
                    var _i, _len;
                    for (_i = 0, _len = this.files.length; _i < _len - 1; _i++) 
                    {
                        if (this.files[_i].name === file.name && this.files[_i].size === file.size && this.files[_i].lastModifiedDate.toString() === file.lastModifiedDate.toString()) {
                            return (pre = file.previewElement) != null ? pre.parentNode.removeChild(file.previewElement) : void 0;
                        }
                    }
                }
                var ext = file.name.split('.').pop();
                if (ext == "pdf") {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/pdf_view.png");
                 } else if (ext.indexOf("doc") != -1) {
                      $(file.previewElement).find(".dz-image img").attr("src", "/img/word_view.png");
                }
            }),
            this.on("success", function (file, response) {
                    console.log(response);
                    console.log(file);
                    var imgUrl = response ;
                    var fileName = file.name;
                    if (shipImageArr.length) {
                        for (var i in shipImageArr) {
                            if (shipImageArr[i]["imageName"] != fileName) {
                                shipImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                            }
                        }
                    } else {
                        shipImageArr.push({ "imageName": file.name, "imageUrl": imgUrl });
                    }
                    var anc = "<a target='_blank' href='"+ response + "'>View</a>";
                    $(file.previewTemplate).find('.dz-image').append(anc);

                })
        },
        removedfile: function (file) {
            console.log(shipImageArr);
            var fileName = file.name;
            var filePath = "";
            for (var i in shipImageArr) {
                if (shipImageArr[i]["imageName"] == fileName) {
                    filePath = shipImageArr[i]["imageUrl"];
                    shipImageArr.splice(i, 1);
                }
            }

            $.ajax({
                url: '/removeFile?' + $.param({ "filePath": filePath }),
                type: 'DELETE',
                success: function (result) {

                }
            });
            var _ref;
            if ((_ref = file.previewElement) != null) {
                _ref.parentNode.removeChild(file.previewElement);
            }
        }
    }
    $('#shipUpload').dropzone();



    // organization for submit   
    $('#organizationForm').submit(function () {
        var options = {
            type: "POST",
            url: "/organizationUpdate",
            beforeSubmit: function (formData, jqForm, options) {
                $('#organizationForm').validate();
                
                
                var imgArray = [];                
                for (var i = 0; i < licenceImageArr.length; i++) {
                    imgArray.push(licenceImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'licenceImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);
                ///////////////
                var imgArray = [];                
                for (var i = 0; i < insuranceImageArr.length; i++) {
                    imgArray.push(insuranceImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'insuranceImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);

                ///////////////
                var imgArray = [];                
                for (var i = 0; i < haulageImageArr.length; i++) {
                    imgArray.push(haulageImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'haulageImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);


                 ///////////////
                var imgArray = [];                
                for (var i = 0; i < specialImageArr.length; i++) {
                    imgArray.push(specialImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'specialImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);

                 ///////////////
                var imgArray = [];                
                for (var i = 0; i < commercialImageArr.length; i++) {
                    imgArray.push(commercialImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'commercialImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);
                
                ///////////////
                var imgArray = [];                
                for (var i = 0; i < railwayImageArr.length; i++) {
                    imgArray.push(railwayImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'railwayImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);

                ///////////////
                var imgArray = [];                
                for (var i = 0; i < airImageArr.length; i++) {
                    imgArray.push(airImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'airImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);

                ///////////////
                var imgArray = [];                
                for (var i = 0; i < shipImageArr.length; i++) {
                    imgArray.push(shipImageArr[i]["imageUrl"]);
                }
                var imgObj = {};
                imgObj.name = 'shipImageUrl';
                imgObj.value = JSON.stringify(imgArray);
                formData.push(imgObj);
                            
                console.log(formData);
                return $('#organizationForm').valid();

            },
            success: function (responseText, status, xhr, $form) {
                window.location = '/organization'

            },
            error: function (e) {

            }
        };
        $(this).ajaxSubmit(options);
        return false;
    });


    
    $('.removeFile').click(function(){
        var thisEle = this;
        var filePath = $(thisEle).attr('img_url');       
         $.ajax({
                url: '/removeOrganizeFile?' + $.param({"filePath": filePath}),
                type: 'DELETE',
                success: function(result) {
                    
                }
          });
          $(thisEle).parent().remove();
      });


      // organizationupdate for submit   
            $('#updateOrganizationForm').submit(function () {
                var options = {
                    type: "POST",
                    url: "/organizationUpdateEdit",
                    beforeSubmit: function (formData, jqForm, options) {
                        $('#updateOrganizationForm').validate();
                        
                        
                        var imgArray = [];                
                        for (var i = 0; i < licenceImageArr.length; i++) {
                            imgArray.push(licenceImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'licenceImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);
                        ///////////////
                        var imgArray = [];                
                        for (var i = 0; i < insuranceImageArr.length; i++) {
                            imgArray.push(insuranceImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'insuranceImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);

                        ///////////////
                        var imgArray = [];                
                        for (var i = 0; i < haulageImageArr.length; i++) {
                            imgArray.push(haulageImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'haulageImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);


                        ///////////////
                        var imgArray = [];                
                        for (var i = 0; i < specialImageArr.length; i++) {
                            imgArray.push(specialImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'specialImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);

                        ///////////////
                        var imgArray = [];                
                        for (var i = 0; i < commercialImageArr.length; i++) {
                            imgArray.push(commercialImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'commercialImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);
                        
                        ///////////////
                        var imgArray = [];                
                        for (var i = 0; i < railwayImageArr.length; i++) {
                            imgArray.push(railwayImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'railwayImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);

                        ///////////////
                        var imgArray = [];                
                        for (var i = 0; i < airImageArr.length; i++) {
                            imgArray.push(airImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'airImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);

                        ///////////////
                        var imgArray = [];                
                        for (var i = 0; i < shipImageArr.length; i++) {
                            imgArray.push(shipImageArr[i]["imageUrl"]);
                        }
                        var imgObj = {};
                        imgObj.name = 'shipImageUrl';
                        imgObj.value = JSON.stringify(imgArray);
                        formData.push(imgObj);
                                    
                        console.log(formData);
                        return $('#updateOrganizationForm').valid();

                    },
                    success: function (responseText, status, xhr, $form) {
                        window.location = '/organization'

                    },
                    error: function (e) {

                    }
                };
                $(this).ajaxSubmit(options);
                return false;
            });



});



