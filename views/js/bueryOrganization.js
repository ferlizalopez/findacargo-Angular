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


    // buyer organization form submit
    $('#organizationForm').submit(function () {
        var options = {
            type: "POST",
            url: "/buyOrganizationUpdate",
            beforeSubmit: function (formData, jqForm, options) {
                $('#organizationForm').validate();

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


});



