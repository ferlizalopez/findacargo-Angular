/*********************

 Language selection


 */

$(document).ready(function () {
	$("body").attr('id', 'language');

    var footer = "<div class='footer' style='text-align:center;background-color:#000;color:#fff;opacity: 0.5;'><div data-i18n='top_msg'></div></div>"

                  //$('#page-wrapper').append(footer);


	$.i18n.init({
		resGetPath: 'locales/__lng__.json',
		load: 'unspecific',
		fallbackLng: false,
		lng: 'en'
	}, function (t){
		$('#language').i18n();
	});

	var userLang = navigator.language || navigator.userLanguage;
	var lng_memory = readCookie('lng');

	if(lng_memory==null)
	{

		$("#lng-select").val(userLang);
		if(userLang=='en')
		{i18n.setLng('en', function(){

			$('#language').i18n();

		});}
		if(userLang=='en-US')
		{i18n.setLng('en', function(){

			$('#language').i18n();
			$("#lng-select").val('en');

		});}

		else if(userLang=='uk')
		{i18n.setLng('uk', function(){

			$('#language').i18n();

		});}
		else if(userLang=='ru')
		{i18n.setLng('ru', function(){

			$('#language').i18n();

		});}

		else if(userLang=='pt')
		{i18n.setLng('pt', function(){

			$('#language').i18n();

		});}
		else if(userLang=='da')
		{i18n.setLng('da', function(){

			$('#language').i18n();

		});}
		else if(userLang=='es')
		{i18n.setLng('es', function(){

			$('#language').i18n();

		});}
		else if(userLang=='el')
		{i18n.setLng('el', function(){

			$('#language').i18n();

		});}
		else if(userLang=='it')
		{i18n.setLng('it', function(){

			$('#language').i18n();

		});}
		else
		{
			i18n.setLng('en', function(){

				$('#language').i18n();

			});
		}
	}
	else
	{

		$("#lng-select").val(lng_memory);

		if(lng_memory=='en')
		{i18n.setLng('en', function(){

			$('#language').i18n();

		});}
		if(lng_memory=='en-US')
		{i18n.setLng('en', function(){

			$('#language').i18n();

		});}

		else if(lng_memory=='uk')
		{i18n.setLng('uk', function(){

			$('#language').i18n();

		});}
		else if(lng_memory=='ru')
		{i18n.setLng('ru', function(){

			$('#language').i18n();

		});}

		else if(lng_memory=='pt')
		{i18n.setLng('pt', function(){

			$('#language').i18n();

		});}
		else if(lng_memory=='da')
		{i18n.setLng('da', function(){

			$('#language').i18n();

		});}
		else if(lng_memory=='es')
		{i18n.setLng('es', function(){

			$('#language').i18n();

		});}
		else if(lng_memory=='el')
		{i18n.setLng('el', function(){

			$('#language').i18n();

		});}
		else if(lng_memory=='it')
		{i18n.setLng('it', function(){

			$('#language').i18n();

		});}
		else
		{
			i18n.setLng('en', function(){

				$('#language').i18n();

			});
		}


	}

	$(function(){
		// bind change event to select
		$("#lng-select").on('change', function () {
			setCookie('lng', $(this).val(), 365);
			
			switch($(this).val())
			{
			case 'el':
				i18n.setLng('el', function(){

					$('#language').i18n();


				});
				break;
			case 'en':
				i18n.setLng('en', function(){

					$('#language').i18n();

				});
				break;
			case 'pt':
				i18n.setLng('pt', function(){

					$('#language').i18n();

				});
				break;
			case 'ru':
				i18n.setLng('ru', function(){

					$('#language').i18n();

				});
				break;
			case 'es':
				i18n.setLng('es', function(){

					$('#language').i18n();

				});
				break;
			case 'it':
				i18n.setLng('it', function(){

					$('#language').i18n();

				});
				break;
			case 'uk':
				i18n.setLng('uk', function(){

					$('#language').i18n();

				});
				break;
			case 'da':
				i18n.setLng('da', function(){

					$('#language').i18n();

				});
				break;
			}

			return false;
		});

	});



});

function saveLanguage(cookieValue)
{
	var sel = document.getElementById('LanguageSelect');
	setCookie('lng', cookieValue, 365);
}

function setCookie(cookieName, cookieValue, nDays) {
	var today = new Date();
	var expire = new Date();

	if (nDays==null || nDays==0)
		nDays=1;

	expire.setTime(today.getTime() + 3600000*24*nDays);
	document.cookie = cookieName+"="+escape(cookieValue) + ";expires="+expire.toGMTString();
}

function readCookie(name) {
	var nameEQ = name + "=";
	var ca = document.cookie.split(';');
	for(var i = 0; i < ca.length; i++) {
		var c = ca[i];
		while (c.charAt(0) == ' ') c = c.substring(1, c.length);
		if (c.indexOf(nameEQ) == 0) return c.substring(nameEQ.length, c.length);
	}
	return null;
} 