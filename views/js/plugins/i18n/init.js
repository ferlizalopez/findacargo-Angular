$(document).ready(function () {
    $.i18n().load({
        da: '/locales/da.json',
        en: '/locales/en.json'
    }).done(function () {
        $.i18n({
            locale: 'da' // Locale is Hebrew
        });
        $('.language').i18n();
    });

    $('#lng-select').change(function (e) {
        e.preventDefault();
        $.i18n({
            locale: e.target.value
        });
        $('.language').i18n();
    });


});