$(document).ready(function(){
    $(".search-field").find("input").on("keydown", function (evt) {
        var stroke;
        stroke = (_ref = evt.which) != null ? _ref : evt.keyCode;
        if (stroke == 9) { // 9 = tab key
            $('#tags').append('<option value="' + $(this).val() + '" selected="selected">' + $(this).val() + '</option>');
            $('#tags').trigger('chosen:updated');
            evt.preventDefault();
        }
    });
});