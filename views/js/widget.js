$(document).ready(function(){

	var widgetDate="";
	widgetDate += "<div class=\"col-sm-7\" >";
	widgetDate += "  <!--h2(data-i18n='body.wtbp')-->";
	widgetDate += "<\/div>";
	widgetDate += "<div style=\"z-index:999;border-radius:50px;margin-right:30px;display:none\" class=\"col-sm-5 white-bg pull-right\">";
	widgetDate += "  <div class=\"timeline-view\">";
	widgetDate += "    <ul id=\"timeline\" class=\"timeline\">";
	widgetDate += "      <li id=\"first-step\" class=\"li\">";
	widgetDate += "        <div class=\"status\">";
	widgetDate += "          <h4 data-i18n=''>Request Delivery<\/h4>";
	widgetDate += "        <\/div>";
	widgetDate += "        <hr class=\"pull-right\"\/>";
	widgetDate += "      <\/li>";
	widgetDate += "      <li id=\"second-step\" class=\"li\">";
	widgetDate += "        <div class=\"status\">";
	widgetDate += "          <h4>Payment<\/h4>";
	widgetDate += "        <\/div>";
	widgetDate += "        <hr class=\"pull-left\"\/>";
	widgetDate += "        <hr class=\"pull-right\"\/>";
	widgetDate += "      <\/li>";
	widgetDate += "      <li id=\"third-step\" class=\"li\">";
	widgetDate += "        <div class=\"status\">";
	widgetDate += "          <h4>Success<\/h4>";
	widgetDate += "        <\/div>";
	widgetDate += "        <hr class=\"pull-left\"\/>";
	widgetDate += "      <\/li>";
	widgetDate += "    <\/ul>";
	widgetDate += "  <\/div>";
	widgetDate += "<\/div>";
	widgetDate += "<div class=\"full-height  booking-form-wrapper\"";
	widgetDate += "					id=\"booking-form\">";
	widgetDate += "";
	widgetDate += "					<!-- <div class=\"col-sm-1\"><\/div> -->";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-01.png\" \/>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "							<div class=\"col-sm-8\">";
	widgetDate += "								<label class=\"text-fine heading\" id='msgs'><\/label>";
	widgetDate += "								<div class=\"col-sm-12 vehicle-container\" id=\"vehicles\"><\/div>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-4\">";
	widgetDate += "								<label class=\"text-fine\">&nbsp;&nbsp;<\/label> <select";
	widgetDate += "									class=\"form-input widget\" name=\"pickup\" id=\"vehicleSelectBox\"";
	widgetDate += "									style=\"display: none\">";
	widgetDate += "									<!--            <option>Air<\/option>-->";
	widgetDate += "									<!--             <option>Berlingo<\/option>-->";
	widgetDate += "									<!--              <option>Bike Messenger<\/option>-->";
	widgetDate += "									<!--               <option>Box Truck<\/option>-->";
	widgetDate += "									<!--                <option>Dump Truck<\/option>-->";
	widgetDate += "									<!--                 <option>Flatbed<\/option>-->";
	widgetDate += "									<!--                  <option>Garbage-truck<\/option>-->";
	widgetDate += "									<!--                  <option>Log Carrier<\/option>-->";
	widgetDate += "									<!--                  <option>Long Haul<\/option>-->";
	widgetDate += "									<!--                  <option>Mobile Crane<\/option>-->";
	widgetDate += "									<!--                  <option>Pickup<\/option>-->";
	widgetDate += "									<!--                  <option>Rail<\/option>-->";
	widgetDate += "									<!--                  <option>Refrigerated<\/option>-->";
	widgetDate += "									<!--                  <option>Road<\/option>-->";
	widgetDate += "									<!--                  <option>Sea<\/option>-->";
	widgetDate += "									<!--                  <option>Tank Truck<\/option>-->";
	widgetDate += "									<!--                  <option>Tow Truck<\/option>-->";
	widgetDate += "									<!--                  <option>Truck<\/option>-->";
	widgetDate += "									<!--                  <option>Van<\/option>-->";
	widgetDate += "									<!--                  <option>Waterways<\/option>-->";
	widgetDate += "									<!--                   <option selected>Other vehicles<\/option>-->";
	widgetDate += "								<\/select>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "							<div class=\"col-sm-6\">";
	widgetDate += "								<label for=\"from\" class=\"text-fine\">From<\/label> <input";
	widgetDate += "									class=\"form-input\" name=\"from\" id=\"origin\"><\/input>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-6\">";
	widgetDate += "								<label for=\"to\" class=\"text-fine\">To<\/label> <input";
	widgetDate += "									class=\"form-input\" name=\"to\" id=\"destination\"><\/input>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-4 input-margin\">";
	widgetDate += "								<label for=\"pickup\" class=\"text-fine\">Pickup<\/label> <select";
	widgetDate += "									class=\"form-input widget\" name=\"pickup\" id=\"tolerance\">";
	widgetDate += "									<option value=\"now\">Now<\/option>";
//	widgetDate += "									<option value=\"next 4 hours\">Next 4 hours<\/option>";
	widgetDate += "									<option value=\"later\">Later<\/option>";
	widgetDate += "";
	widgetDate += "								<\/select>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-8 input-margin\">"
	widgetDate += "<div class=\"input-group date col-sm-6 pull-left widget\" id='date-cal' style='display:none'>";
	widgetDate += "                                    <span class=\"input-group-addon\"><i class=\"fa fa-calendar\"><\/i><\/span><input type=\"text\" class=\"form-control\" value=moment().format('YYYY-MM-DD') id='date-text'>";
	widgetDate += "                                <\/div>";
	widgetDate += "<div class=\"input-group clockpicker col-sm-5 pull-left  widget\" data-autoclose=\"true\" style='margin-left:5%;display:none;'  id='time-clock'>";
	widgetDate += "                                <input type=\"text\" class=\"form-control\" value=\"09:30\" id='time-text' >";
	widgetDate += "                                <span class=\"input-group-addon\">";
	widgetDate += "                                    <span class=\"fa fa-clock-o\"><\/span>";
	widgetDate += "                                <\/span>";
	widgetDate += "                            <\/div>";
	widgetDate+=  "                          <\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
//	widgetDate += "							<div class=\"col-sm-12 input-margin\">";
//	widgetDate += "								<label for=\"refrigerated\" class=\"text-fine\">Options:<\/label><br>";
//	widgetDate += "								<input type=\"checkbox\" class=\"\" name=\"refrigerated\"";
//	widgetDate += "									id=\"refrigerated\"> Refrigerated <\/input> &nbsp;&nbsp; <input";
//	widgetDate += "									type=\"checkbox\" class=\"\" name=\"extra\" id=\"extra\"> Extra";
//	widgetDate += "								man (+10 kr \/ Min) <\/input>";
//	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-6 input-margin\"><\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted  gray-bg\" style=\"display: none\" id='info_block'>";
	widgetDate += "							<div class=\"col-sm-6 text-style gray-bg\" id=\"price-div\">";
	widgetDate += "";
	widgetDate += "								<h5>Price<\/h5>";
	widgetDate += "								<h2 class=\"heading\" id=\"price\"><\/h2>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-6 gray-bg text-style\" id=\"duration-div\">";
	widgetDate += "								<h5>Est. pickup in<\/h5>";
	widgetDate += "								<h2 class=\"heading\" id=\"duration\">0:00 min.<\/h2>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-12 gray-bg text-style\">";
	widgetDate += "								<h5>Price is fixed before delivery starts<\/h5>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
//	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
//	widgetDate += "							<u><h5 id=\"notes\">Notes to driver<\/h5><\/u>";
//	widgetDate += "							<div id=\"note_text\" class=\"full-width\" style=\"display: none\">";
//	widgetDate += "								<textarea class=\"form-text-area\" rows=\"3\"><\/textarea>";
//	widgetDate += "							<\/div>";
//	widgetDate += "							<u><h5 id=\"promo_code\">Do you have a promo code?<\/h5> <u>";
//	widgetDate += "									<div id=\"promo_text\" class=\"full-width\" style=\"display: none\">";
//	widgetDate += "										<textarea class=\"form-text-area\" rows=\"3\"><\/textarea>";
//	widgetDate += "									<\/div>";
//	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "							<div class=\"col-sm-4\"><\/div>";
	widgetDate += "							<div class=\"col-sm-3\" style=\"display: none\">";
	widgetDate += "								<button class=\"button-default\">Cancel<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-5\">";
	widgetDate += "								<button class=\"button-action disabled\" data-i18n='body.nxt' id=\"next\"";
	widgetDate += "							style=\"width: 50%;margin-left: 20px\" disabled>";
	widgetDate += "									Next";
	widgetDate += "								<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-6 help-text text-style\">";
	widgetDate += "								<h5 data-i18n='body.need_help'>DO YOU NEED HELP?<\/h5>";
	widgetDate += "								<h5>support@goidag.com or +45 78 75 47 85<\/h5>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "					<!-- <div class=\"col-sm-6\"><\/div>-->";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\" id=\"no-vehicle\"";
	widgetDate += "					style=\"display: none\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-03.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "							<h1 class=\"fine-bold heading\" data-i18n='body.no_vehicle_available'>No Vehicle currently available";
	widgetDate += "								Booking.<\/h1>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\"><\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "							<div class=\"col-sm-4 input-margin\">";
	widgetDate += "								<button class=\"no_vehicle_button\" id='book-anyway' data-i18n='body.book_anyway'>";
	widgetDate += "									Book it Anyway";
	widgetDate += "								<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-4 input-margin\">";
	widgetDate += "								<button class=\"no_vehicle_button\" id='try-again' data-i18n='body.try_again' style='width:65%;'>";
	widgetDate += "									Try Again";
	widgetDate += "								<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "						<\/div>";
	widgetDate += "							<div class=\"col-sm-6 help-text text-style\">";
	widgetDate += "								<h5 data-i18n='body.support_confirmation'>Our support team will assign and confirm your booking soon if you book anyway<\/h5>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\" id=\"notes-form\"";
	widgetDate += "					style=\"display: none\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-03.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "								<\/div>";
	widgetDate += "							<h3 class=\"heading-bold\" style=\"text-align: center\" data-i18n='select_option_match_needs'>Select the options below to match your specific needs";
	widgetDate += "								<\/h3>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "								<div class=\"col-sm-12 form-style\">";
	widgetDate += "									<label for=\"refrigerated\" class=\"text-fine\">Do you need anything extra?:<\/label><br>";
	widgetDate += "								    <input type=\"checkbox\" class=\"\" name=\"refrigerated\"";
	widgetDate += "									    id=\"refrigerated\"> Refrigerated <\/input> &nbsp;&nbsp; ";
	widgetDate += "								<\/div>";
	widgetDate += "							<div class=\"col-sm-12 form-style\">";
	widgetDate += "									<label class=\"text-fine\" data-i18n='body.special_request'>Notes to the driver or special request<\/label> ";
	//widgetDate +="                                   <div id=\"note_text\" class=\"full-width\" style=\"display: none\">";
	widgetDate += "								         <textarea rows=\"3\" id=\"note_text\"";
	widgetDate +="                                        style=\"width: 100%\"><\/textarea>";
	widgetDate += "							         <\/div>";
	widgetDate += "								<div class=\"col-sm-12 form-style container\">";
	widgetDate += "									<a class=\"text-fine heading header\" data-i18n='body.send_delivery_status' id='toggle-email'>Send delivery status via email<\/a>";
	widgetDate += "								   <div class=\"content\"><input type=\"text\"";
	widgetDate += "										class=\"form-input\" id=\"delivery-email\" required \/>";
	widgetDate += "								   <\/div>";
	widgetDate += "								<\/div>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "							<div class=\"col-sm-3\">";
	widgetDate += "								<button class=\"button-default\" id=\"back-screen2\">Back<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-4\"><\/div>";
	widgetDate += "							<div class=\"col-sm-5\">";
	widgetDate += "								<button class=\"button-action\" id=\"request-delivery\">";
	widgetDate += "									Request Delivery";
	widgetDate += "								<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "				<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\"";
	widgetDate += "					id=\"payment-window\" style=\"display: none;\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\" style=' min-height:70%;'>";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-02.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "							<h4 class=\"heading-bold\">";
	widgetDate += "								Payment";
	widgetDate += "								<\/h4>";
	widgetDate += "								<h1 class=\"heading\">A carrier is about to confirm pickup.";
	widgetDate += "							<\/h1>";
	widgetDate += "							<h1 class=\"large-font heading\" id=\"amount\">";
	widgetDate += "								";
	widgetDate += "								<\/h1>";
	widgetDate += "								<br>";
	widgetDate += "								<h4 class=\"fine-bold\">";
	widgetDate += "									Please pay:";
	widgetDate += "									<\/h4>";
	widgetDate += "									<div class=\"col-sm-3\"><\/div>";
	widgetDate += "									<div class=\"col-sm-6\">";
	widgetDate += "										<button class=\"btn button-payment medium-font\" id=\"card_pay\">";
	widgetDate += "											";
	widgetDate += "										<\/button>";
	widgetDate += "									<\/div>";
	widgetDate += "									<!--<div class=\"col-sm-6\">";
	widgetDate += "                            <button class=\"btn button-payment medium-font\" disabled>Mobile Pay <span>><\/span><\/button>";
	widgetDate += "                        <\/div>-->";
	widgetDate += "									<div class=\"col-sm-3\"><\/div>";
	widgetDate += "						<\/div>";
	widgetDate += "						<!--<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "";
	widgetDate += "                <h4 class=\"fine-bold\">or Credit Card:<\/h3>";
	widgetDate += "                    <div class=\"col-sm-3\"><\/div>";
	widgetDate += "                    <div class=\"col-sm-6\">";
	widgetDate += "                        <button class=\"btn button-payment medium-font\" id=\"card_pay\">Credit Card <span>><\/span><\/button>";
	widgetDate += "                    <\/div>";
	widgetDate += "                    <div class=\"col-sm-3\"><\/div>";
	widgetDate += "            <\/div>-->";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "				<div class=\" col-sm-12 booking-form-wrapper\"";
	widgetDate += "					id=\"payment-window-2\" style=\"display: none;\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\" style=' min-height:70%;'>";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-02.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "							<h2 class=\"heading-bold\">";
	widgetDate += "								Your booking was stored but confirmation is pending";
	widgetDate += "								<\/h2>";
	widgetDate += "								<h4 class=\"heading\">Your request was successful but it is currently pending confirmation because one of our carrier wasn't able to approve it within the first seconds/minutes. We will soon email/sms you to confirm the delivery";
	widgetDate += "							<\/h4>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\" id='payment-window-2-invoice'>";
	widgetDate += "								<h4 class=\"heading\">Delivery cost will be added to your account statement.";
	widgetDate += "							<\/h4>";
	widgetDate += "						<\/div>";
	widgetDate += "							<h1 class=\"large-font heading\" id=\"amount\">";
	widgetDate += "								";
	widgetDate += "								<\/h1>";
	widgetDate += "								<br>";
	widgetDate += "								<!--<h4 class=\"fine-bold\">";
	widgetDate += "									Please pay:";
	widgetDate += "									<\/h4>-->";
	widgetDate += "									<div class=\"col-sm-3\"><\/div>";
	widgetDate += "									<!--<div class=\"col-sm-6\">";
	widgetDate += "										<button class=\"btn button-payment medium-font\" id=\"card_pay\">";
	widgetDate += "											";
	widgetDate += "										<\/button>";
	widgetDate += "									<\/div>-->";
	widgetDate += "									<!--<div class=\"col-sm-6\">";
	widgetDate += "                            <button class=\"btn button-payment medium-font\" disabled>Mobile Pay <span>><\/span><\/button>";
	widgetDate += "                        <\/div>-->";
	widgetDate += "									<div class=\"col-sm-3\"><\/div>";
	widgetDate += "						<\/div>";
	widgetDate += "						<!--<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "";
	widgetDate += "                <h4 class=\"fine-bold\">or Credit Card:<\/h3>";
	widgetDate += "                    <div class=\"col-sm-3\"><\/div>";
	widgetDate += "                    <div class=\"col-sm-6\">";
	widgetDate += "                        <button class=\"btn button-payment medium-font\" id=\"card_pay\">Credit Card <span>><\/span><\/button>";
	widgetDate += "                    <\/div>";
	widgetDate += "                    <div class=\"col-sm-3\"><\/div>";
	widgetDate += "            <\/div>-->";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\"";
	widgetDate += "					id=\"payment-form\" style=\"display: none\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-01.png\" \/>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<h2 class=\"heading-bold\" style=\"text-align: center\">Please";
	widgetDate += "								Provide Payment Information<\/h2>";
	widgetDate += "";
	widgetDate += "							<form method=\"POST\" action=\"#handler\" id=\"adyen-encrypted-form\">";
	widgetDate += "								<div class=\"col-sm-12 form-style\">";
	widgetDate += "									<label class=\"text-fine\">Card Number<\/label> <input type=\"text\"";
	widgetDate += "										size=\"20\" autocomplete=\"off\" data-encrypted-name=\"number\"";
	widgetDate += "										class=\"form-input\" id=\"number\" maxlength=\"20\" onkeypress='return event.charCode >= 48 && event.charCode <= 57' required styte=\"font-weight:bold;font-size:20sp;\" \/>";
	widgetDate += "									<span class=\"heading\" id='card-error' style='display:none;'>Invalid card number<\/span>";
	widgetDate += "								<\/div>";
	widgetDate += "								<div class=\"col-sm-12 form-style\">";
	widgetDate += "									<label class=\"text-fine\">Holder Name<\/label> <input type=\"text\"";
	widgetDate += "										size=\"20\" autocomplete=\"off\" data-encrypted-name=\"holderName\"";
	widgetDate += "										class=\"form-input\" id=\"name\" required \/>";
	widgetDate += "								<\/div>";
	widgetDate += "								<div class=\"col-sm-4 form-style\">";
	widgetDate += "									<label class=\"text-fine\">Expiry Month<\/label> <select";
	widgetDate += "										  autocomplete=\"off\"";
	widgetDate += "										data-encrypted-name=\"expiryMonth\" class=\"form-input\"";
	widgetDate += "										id=\"month\" required ><option value='1'>January</option><option value='1'>February</option><option value='3'>March</option><option value='4'>April</option><option value='5'>May</option><option value='6'>June</option><option value='7'>July</option><option value='8'>August</option><option value='9'>September</option><option value='10'>October</option><option value='11'>November</option><option value='12'>December</option><\/select>";
	widgetDate += "								<\/div>";
	widgetDate += "								<div class=\"col-sm-4 form-style\">";
	widgetDate += "									<label class=\"text-fine\">Expiry Year<\/label> <select ";
	widgetDate += "										 autocomplete=\"off\"";
	widgetDate += "										data-encrypted-name=\"expiryYear\" class=\"form-input\" id=\"year\"";
	widgetDate += "										required ><\/select>";
	widgetDate += "								<\/div>";
	widgetDate += "								<div class=\"col-sm-4 form-style\">";
	widgetDate += "									<label class=\"text-fine\">CVC \/ CVV<\/label> <input type=\"text\"";
	widgetDate += "										size=\"4\" maxlength=\"4\" autocomplete=\"off\" onkeypress='return event.charCode >= 48 && event.charCode <= 57'";
	widgetDate += "										data-encrypted-name=\"cvc\" class=\"form-input\" id=\"cvc\" required \/>";
	widgetDate += "								<\/div>";
	widgetDate += "								<div class=\"col-sm-4 form-style\">";
	widgetDate += "									<input type=\"button\" value=\"Back\" class=\"button-action\" id=\"back\" \/>";
	widgetDate += "								<\/div>";
	widgetDate += "								<div class=\"col-sm-4 form-style\"><\/div>";
	widgetDate += "								<div class=\"col-sm-4 form-style\">";
	widgetDate += "									<input type=\"hidden\" value=\"generate-this-server-side\"";
	widgetDate += "										data-encrypted-name=\"generationtime\" class=\"form-input\" \/><input";
	widgetDate += "										type=\"button\" value=\"Pay\" class=\"button-action\" id=\"pay\" \/>";
	widgetDate += "								<\/div>";
	widgetDate += "";
	widgetDate += "							<\/form>";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "				<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\"";
	widgetDate += "					id=\"wait-form\" style=\"display: none\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-03.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "							<h1 class=\"heading-bold\">Trip details<\/h1>";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "							<h3 class=\"col-sm-8 heading\">We are waiting for";
	widgetDate += "								confirmation.<\/h3>";
	widgetDate += "							<h3 class=\"col-sm-12 heading text-muted text-style\" id='wait-form-invoice'>Delivery cost will be added to your account statement.";
	widgetDate += "								<\/h3>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\"";
	widgetDate += "							style=\"display: flex;\">";
	widgetDate += "							<div class=\"col-sm-2 gray-bg div-style\">";
	widgetDate += "								<img class=\"img-style\" src=\"img\/berlingo.png\" id='vehicle-img'\/>";
	widgetDate += "								<h6 class=\"fine-bold\" id='vehicle-name'>Berlingo<\/h6>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-10 gray-bg div-style\">";
	widgetDate += "								<h1 class=\"fine-style pull-right\" id=\"amount-wait\"><\/h1>";
	widgetDate += "";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-6 input-margin border-div gray-bg div-style\">";
	widgetDate += "								<h4>From<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\" id=\"from\"><\/h4>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-6 input-margin border-div gray-bg div-style\">";
	widgetDate += "								<h4>To<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\" id=\"to\"><\/h4>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-6 input-margin border-div gray-bg div-style\">";
	widgetDate += "								<h4>Note to drivers<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\">NA<\/h4>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-6 input-margin border-div gray-bg div-style\">";
	widgetDate += "								<h4>Your promo code<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\">NA<\/h4>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-4\"><\/div>";
	widgetDate += "							<div class=\"col-sm-4\">";
	widgetDate += "								<button class=\"button-default\" id=\"cancel-delivery\">Cancel<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-4\"><\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "					<div class=\"col-sm-6\"><\/div>";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\" id=\"reject\"";
	widgetDate += "					style=\"display: none\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-03.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "							<h3 class=\"heading-bold\">Trip details<\/h3>";
	widgetDate += "							<h1 class=\"fine-bold heading\">No Carrier Accepted Your";
	widgetDate += "								Booking.<\/h1>";
	widgetDate += "							<h4>Your payment authorization of <span id=\"reject-amount\"><\/span> was canceled and no";
	widgetDate += "								money charged<\/h4>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\"><\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "							<div class=\"col-sm-8 input-margin\">";
	widgetDate += "								<button class=\"button-action-big\" id='schedule-another'>";
	widgetDate += "									Schedule your trip for another day <span>><\/span>";
	widgetDate += "								<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\" id=\"cancel-window\"";
	widgetDate += "					style=\"display: none\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-03.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "							<h2 class=\"fine-bold heading\">Your booking has been canceled";
	widgetDate += "								<\/h2>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "							<div class=\"col-sm-8 input-margin\">";
	widgetDate += "								<button class=\"button-action\"";
	widgetDate += "							style=\"width: 50%\" id='book-again'>";
	widgetDate += "									Book another trip";
	widgetDate += "								<\/button>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-2\"><\/div>";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";
	widgetDate += "";
	widgetDate += "				<div class=\"full-height  booking-form-wrapper\"";
	widgetDate += "					id=\"confirm-form\" style=\"display: none\">";
	widgetDate += "";
	widgetDate += "					<div class=\"col-sm-1\"><\/div>";
	widgetDate += "					<div class=\"col-sm-5 white-bg form-style booking-form-container\">";
	widgetDate += "						<div class=\"white-bg bottom-border div-margin-style\"";
	widgetDate += "							style=\"height: 115px\">";
	widgetDate += "";
	widgetDate += "							<img class=\"img-style-vertical\" src=\"img\/illustration-03.png\" \/>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted text-style\">";
	widgetDate += "							<h1 id=\"carrier_status\" class=\"heading-bold\">Booking confirmed<\/h1>";
	widgetDate += "							<h4>Your driver is on the way.<\/h4>";
	widgetDate += "							<h4>Please be ready for pickup to avoid surcharges<\/h4>";
	widgetDate += "							<h2 class=\"fine-bold\" id='arriving-time'>";
	widgetDate += "								Arriving in <span id='minutes'></span> minutes";
	widgetDate += "								<\/h3>";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\"";
	widgetDate += "							style=\"display: flex;\">";
	widgetDate += "							<div class=\"col-sm-4 gray-bg div-style\">";
	widgetDate += "								<img class=\"img-style\" src=\"img\/no_user.png\" \/>";
	widgetDate += "							<\/div>";
	widgetDate += "							<div class=\"col-sm-8 gray-bg div-style\">";
	widgetDate += "								<h3 class=\"heading-bold medium-font\" id='driver-name'><\/h3>";
	widgetDate += "								<h4>Licence plate<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\" id='license'><\/h4>";
	widgetDate += "								<br>";
	widgetDate += "								<h4>Phone<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\" id='phone'><\/h4>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-12 input-margin gray-bg div-style\">";
	widgetDate += "								<h4>From<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\" id=\"con-from\"><\/h4>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "						<div class=\"form-style col-sm-12 text-muted\">";
	widgetDate += "";
	widgetDate += "							<div class=\"col-sm-12 input-margin gray-bg div-style\">";
	widgetDate += "								<h4>To<\/h4>";
	widgetDate += "								<h4 class=\"text-fine\" id=\"con-to\"><\/h4>";
	widgetDate += "							<\/div>";
	widgetDate += "";
	widgetDate += "						<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "					<\/div>";
	widgetDate += "";
	widgetDate += "";
	widgetDate += "				<\/div>";



	$('#maps').html(widgetDate);

	$('.clockpicker').clockpicker();

	$('.input-group.date').datepicker({
		todayBtn: "linked",
		keyboardNavigation: false,
		forceParse: false,
		calendarWeeks: true,
		autoclose: true
	});

	$('#date-text').val(moment().format('YYYY-MM-DD'))
	$('#time-text').val(moment().format('hh:mm'));

	$("#notes").click(function(){


		$('#note_text').slideToggle();

	});

	$("#promo_code").click(function(){


		$('#promo_text').slideToggle();

	});


	$('#card_pay').click(function(){

		$('#payment-window').slideUp(200,function(){

			$('#payment-form').slideDown();
		});


	});


	$("#tolerance").on('change',function(){


		if($(this).val()=='later')
		{

			$('#date-cal').fadeIn();
			$('#time-clock').fadeIn();
		}
		else{

			$('#date-cal').fadeOut();
			$('#time-clock').fadeOut();

		}
	});

	var yearElement = "<option value='"+moment().format('YYYY')+"'>"+moment().format('YYYY')+"</option>";

	for(var y=1;y<=50;y++)
	{
		yearElement+= "<option value='"+moment().add(y,'years').format('YYYY')+"'>"+moment().add(y,'years').format('YYYY')+"</option>";
	}

	$('#year').html(yearElement);



	$("#maps").css('min-height',($("#page-wrapper").outerHeight( true )-($("#navBar").outerHeight(true)+$("#second-header").outerHeight(true)+$("#header").outerHeight( true )+$("#footer").outerHeight( true ))));
	$("#map").css('min-height',($("#page-wrapper").outerHeight( true )-($("#navBar").outerHeight(true)+$("#second-header").outerHeight(true)+$("#header").outerHeight( true )+$("#footer").outerHeight( true ))));



	(function () {
		var resizeContentWrapper = function () {
			console.group('resizing');


			var target = {
				content: $('#map')
			};

			//resize target content to window size, assuming that last time around it was set to document height, and might be pushing document height beyond window after resize
			//TODO: for performance, insert flags to only do this if the window is shrinking, and the div has already been resized
			target.content.css('height', $(window).height());

			var height = {
				document: $(document).height(),
				window: $(window).height()
			};

			console.log('height: ', height);


			if (height.document > height.window) {
				// Scrolling needed, no need to externd the sidebar
				target.content.css('height', '');

				console.info('custom height removed');
			} else {
				// Set the new content height
				height['content'] = height.window;
				target.content.css('height', height['content']);

				console.log('new height: ', height);
			}
			console.groupEnd();
		}
		resizeContentWrapper();
		$(window).bind('resize orientationchange', resizeContentWrapper);
	})(jQuery);


	var token;

	var pusher = new Pusher('ed1edc67bfc5a99939f1', {
		cluster: 'mt1'
	});
	var channel = pusher.subscribe($('#ids').val());

	console.log("IDS"+$('#ids').val());

	channel.bind('carrier_accepted', function(data) {
		$('#wait-form').slideUp(200,function(){

			$('#confirm-form').slideDown();
			$('#con-from').html(data.pickup_description);

			$('#con-to').html(data.destination_description);
			$('#phone').html(data.vehicle.phone);
			if(data.pickup_time == 0){
				$('#arriving-time').css('display', 'none');
			} else {
				$('#arriving-time').css('display', 'block');
			}
			$('#minutes').html(data.pickup_time);
			$('#driver-name').html(data.vehicle.driver);
			$('#license').html(data.vehicle.license_plate);
			$('#third-step').addClass('complete');
			$('#payment-window-2').slideUp();
		});
	});

	channel.bind('delivery_canceled', function(data) {

		$('#wait-form').slideUp(200,function(){

			$('#reject').slideDown();

			$('#reject-amount').html(price);

		});
	});
	channel.bind('status_changed', function(data) {

		alert(data.carrier_status.description);
	});



	var geocoder = new google.maps.Geocoder();


	var autocomplete1;
	var autocomplete2;
	var type;
	var weight;
	var area;
	var token_auth;
	var delivery_id;
	var price="0";
	var destinationText;
	var originText;
	var vname;
	var lat;
	var lng;
	var available_vehicles=[];
	var available_vehicles_types=[];
	var jsonObj;
	var newVehicle;

	var origin = {"lat":0.00,"lng":0.00};
	var destination = {"lat":0.00,"lng":0.00};
	var validCardNumber = false;
	var isVehicleUpdated = false;
	var selectedTypeId = '';
	var api_url = "https://api.nemlevering.dk/v1";
	var hostname = window.location.hostname;
	if (hostname.match(/localhost/) || hostname.match(/dev/)) {
		api_url = "https://dev.api.nemlevering.dk/v1";
	}


	function initialize() {
		getVehiclesTypes();
		autocomplete1 = new google.maps.places.Autocomplete(
			/** @type {HTMLInputElement} */(document.getElementById('origin')),
			{ types: ['geocode'] });
		google.maps.event.addListener(autocomplete1, 'place_changed', function() {


			origin=autocomplete1.getPlace().geometry.location;

			//alert(origin.lat()+","+origin.lng());
			getVehicles(token_auth,origin.lat()+","+origin.lng(),"");
			showMap(origin,destination);

			//$('#msgs').html('Please Select Vehicle or Destination (Optional)');

		});


		autocomplete2 = new google.maps.places.Autocomplete(
			/** @type {HTMLInputElement} */(document.getElementById('destination')),
			{ types: ['geocode'] });
		google.maps.event.addListener(autocomplete2, 'place_changed', function() {

			destination=autocomplete2.getPlace().geometry.location;

			//alert(destination);

			getVehicles(token_auth,origin.lat()+","+origin.lng(),destination.lat()+","+destination.lng());

			showMap(origin,destination);
			$('#msgs').html('Select desired vehicle');

		});

	}
	initialize();



	//Get the latitude and the longitude;
	function successFunction(position) {
		lat = position.coords.latitude;
		lng = position.coords.longitude;

		//console.log({lat,lng});

		getVehicles(token_auth,lat+","+lng,'');

	}

	function errorFunction(){
		console.log("Geocoder failed");
	}


	//

	var xhr = new XMLHttpRequest();
	var url = api_url + "/auth/login";
	xhr.open("POST", url, true);
	xhr.setRequestHeader("Content-type", "application/json");
	xhr.onreadystatechange = function () {
		if (xhr.readyState == 4 && xhr.status == 200) {
			var json = JSON.parse(xhr.responseText);

			token_auth = json.token;
			if (navigator.geolocation) {
				navigator.geolocation.getCurrentPosition(successFunction, errorFunction);
			}

			//console.log(json.token)



		} else{
			if(xhr.readyState == 4 && xhr.status == 505)
			{
				var json = JSON.parse(xhr.responseText);
				console.log('json', json);
				if(json && json.message)
					alert(json.message);
			}
		}
	}
	var data = JSON.stringify({"email":$('#email').val(),"password":$('#pass').val()});
	xhr.send(data);

	function getVehiclesTypes(){

		var vehicleEliment = "";
		var selectElement = "";

		selectElement +="<option value='-' selected>Other Vehicles</option>"
		available_vehicles_types =  [
			{type:{
				"id": 16,
				"description": "Bike",
				"cargo_limit": '40kg',
				"hidden": true
			}},
			{type:{
				"id": 17,
				"description": "Berlingo",
				"cargo_limit": '900kg',
				"hidden": true
			}},
			{type:{
				"id": 2,
				"description": "Van",
				"cargo_limit": '900kg',
				"hidden": true
			}},
			{type:{
				"id": 3,
				"description": "Box Truck",
				"cargo_limit": '900kg',
				"hidden": false
			}},
			{type:{
				"id": 14,
				"description": "Truck",
				"cargo_limit": '18000kg',
				"hidden": false
			}},
			{type:{
				"id": 13,
				"description": "Long Haul / Tractor Truck",
				"cargo_limit": '30000kg',
				"hidden": false
			}},
			{type:{
				"id": 10,
				"description": "Log Carrier",
				"cargo_limit": '',
				"hidden": false
			}},
			{type:{
				"id": 12,
				"description": "Tank Truck",
				"cargo_limit": '',
				"hidden": false
			}},
			{type:{
				"id": 8,
				"description": "Dump Truck",
				"cargo_limit": '',
				"hidden": false
			}},
			{type:{
				"id": 6,
				"description": "Concrete/ Cement mixer",
				"cargo_limit": '',
				"hidden": false
			}},
			{type:{
				"id": 5,
				"description": "Tow Truck",
				"cargo_limit": '',
				"hidden": false
			}},
			{type:{
				"id": 9,
				"description": "Garbage Truck",
				"cargo_limit": '',
				"hidden": false
			}},
			{type:{
				"id": 4,
				"description": "Flatbed",
				"cargo_limit": '30000kg',
				"hidden": false
			}}
		];

		//console.log('available vehicle types', available_vehicles_types);
		for (i = 0; i < available_vehicles_types.length; i++) {

			weight = available_vehicles_types[i].type.cargo_limit || '0 Kg';
			if(i<3)
			{
				var description = available_vehicles_types[i].type.description && available_vehicles_types[i].type.description.substr(0, 10);
				if(i==0){
					vehicleEliment += "<button  style='border:none' class=' btn-outline btn-white text-center btn col-sm-4 active' id='"+available_vehicles_types[i].type.id+"''><img src='img/"+available_vehicles_types[i].type.id+".png'  id='imageView'><h5 class='heading'  id='1'>"+description+"</h5>"
					selectedTypeId = available_vehicles_types[i].type.id;
				} else
					vehicleEliment += "<button  style='border:none' class=' btn-outline btn-white text-center btn col-sm-4' id='"+available_vehicles_types[i].type.id+"''><img src='img/"+available_vehicles_types[i].type.id+".png'  id='imageView'><h5 class='heading'  id='1'>"+description+"</h5>"

				vehicleEliment+="<input type='hidden' value="+available_vehicles_types[i].type.id+" id='type'>"
				if (weight != "0 Kg") {
					vehicleEliment += "<h5 class='vehicle-additional-info' id='weight'>" + weight + " max</h5>"
				}
			}

			var description = available_vehicles_types[i].type.description;

			$('#vehicleSelectBox').fadeIn();

			if(available_vehicles_types[i].type.hidden === false) {
				selectElement +="<option value="+available_vehicles_types[i].type.id+">"+description+"</option>"
			}



		}



		document.getElementById("vehicleSelectBox").innerHTML  = selectElement;
		document.getElementById("vehicles").innerHTML = vehicleEliment;



	}


	function getVehicles(token, pickup, drop)
	{

		var getV = new XMLHttpRequest();
		getV.open("GET",api_url+"/carriers/availability/"+pickup+"/"+drop, true);
		getV.setRequestHeader("Content-type", "application/json");
		getV.setRequestHeader("Authorization", "JWT "+token_auth);


		console.log(token_auth);
		getV.onreadystatechange = function () {
			if (getV.readyState == 4 && getV.status == 200) {

				var json = JSON.parse(getV.responseText);
				console.log(json);

				var vehicleEliment = "";
				var selectElement = "";

				selectElement += "<option value='-' selected>Other Vehicles</option>"
				available_vehicles = json.available_vehicles;
				jsonObj = json;
				if($("#origin").val().length>0 && $("#destination").val().length>0){
					$("#price-div").removeClass("help-text");
					$("#duration-div").css("display","block");
					var selectedVehicle = available_vehicles.filter(function(vehicle){
						return vehicle.type.id == selectedTypeId;
					});
					price = selectedVehicle[0] && selectedVehicle[0].estimated_cost;
					if(selectedVehicle[0] && (selectedVehicle[0].pickup_time)>59)
					{
						var time = (selectedVehicle[0].pickup_time)/60+" hrs."
						$("#duration-div").css("display","block");
					}
					else if(selectedVehicle[0] && (selectedVehicle[0].pickup_time) == 0){
						$("#duration-div").css("display","none");
						$("#price-div").addClass("help-text");
					} else {
						$("#duration-div").css("display","block");
						var time = (selectedVehicle[0].pickup_time)+" min."
					}
					$('#duration').html(time);
					if(price!="0")
						$('#info_block').slideDown();
					price = price+" kr";
					$('#price').html(price);
					$('#next').prop('disabled',false).removeClass('disabled');;
				}
			}
			else{
				if(getV.readyState == 4 && getV.status == 505)
				{
					var json = JSON.parse(getV.responseText);
					$('#info_block').slideUp();
					price=0;
					if(json && json.message)
						alert(json.message);
				}
			}
		}

		getV.send("");
	}


	$('#vehicleSelectBox').on('change', function(){
		$("#price-div").removeClass("help-text");
		$("#duration-div").css("display","block");
		var veh = this.options[this.selectedIndex];
		if($(this).val() != selectedTypeId){
			selectedTypeId = $(this).val();
			
			var vehicleIcon = [];
			$('#vehicles').find('button').each(function()
			{
				vehicleIcon.push($(this)[0].id);
				$(this).removeClass('active');
				console.log('vehicles button', $(event.target).closest('button'), $(this)[0].id)
				if($(this)[0].id == selectedTypeId){
					$(this).addClass('active');
				} else {
					$(this).removeClass('active');
				}

			});
			if(vehicleIcon.indexOf(selectedTypeId) > -1){
				$('#'+selectedTypeId).addClass('active');
			} else{
				vehicleIcon.splice(2,1);
				vehicleIcon.push(selectedTypeId);

				var vehicleElement = '';
				var vehiclesArray = available_vehicles.length > 0 ? available_vehicles : available_vehicles_types;
				vehicleIcon.forEach(function(item, index){
					var selectedVehicle = vehiclesArray.filter(function(vehicle){
						return vehicle.type.id == item;
					});
					var description = selectedVehicle[0].type.description && selectedVehicle[0].type.description.substr(0, 10);
					var weight = selectedVehicle[0].type.cargo_limit || '0 Kg';
					if(index == 2){
						vehicleElement += "<button  style='border:none' class=' btn-outline btn-white text-center btn col-sm-4 active' id='"+selectedVehicle[0].type.id+"''><img src='img/"+selectedVehicle[0].type.id+".png'  id='imageView'><h5 class='heading'  id='1'>"+description+"</h5>"
					} else {
						vehicleElement += "<button  style='border:none' class=' btn-outline btn-white text-center btn col-sm-4' id='"+selectedVehicle[0].type.id+"''><img src='img/"+selectedVehicle[0].type.id+".png'  id='imageView'><h5 class='heading'  id='1'>"+description+"</h5>"
					}
					vehicleElement+="<input type='hidden' value="+selectedVehicle[0].type.id+" id='type'>"

					if (weight != "0 Kg") {
						vehicleElement += "<h5 class='vehicle-additional-info' id='weight'>" + weight + " max</h5>"
					}
				});
				
				//var $el = $("#vehicleSelectBox");
				if(newVehicle === undefined) {
					newVehicle = '<option value="2">Van</option>';
				} else {
					console.log('New vehicle 1', newVehicle)
				}

				$("#vehicleSelectBox").append(newVehicle);
				newVehicle = veh;
					console.log('New vehicle 2 -', selectedTypeId)
				var newVehicleIndex = "#vehicleSelectBox option[value='" + selectedTypeId + "']";
				$(newVehicleIndex).remove();

				/*available_vehicles_types[3].hidden = true;
				$.each(available_vehicles_types, function(key,value) {
			  		$el.append($("<option></option>")
				     	.attr("value", available_vehicles_types.type.id).text(available_vehicles_types.type.description));
				});*/
				document.getElementById("vehicles").innerHTML = vehicleElement;

			}

		}
		$('#vehicleSelectBox').val('-');
		//selectedTypeId = $(this).val();
		if($("#origin").val().length>0 && $("#destination").val().length>0){
			$("#price-div").removeClass("help-text");
			$("#duration-div").css("display","block");
			var selectedVehicle = available_vehicles.filter(function(vehicle){
				return vehicle.type.id == selectedTypeId;
			});
			price = selectedVehicle[0] && selectedVehicle[0].estimated_cost;
			if(selectedVehicle[0] && (selectedVehicle[0].pickup_time)>59)
			{
				var time = (selectedVehicle[0].pickup_time)/60+" hrs."
				$("#duration-div").css("display","block");
			}
			else if(selectedVehicle[0] && (selectedVehicle[0].pickup_time) == 0){
				$("#duration-div").css("display","none");
				$("#price-div").addClass("help-text");
			} else {
				$("#duration-div").css("display","block");
				var time = (selectedVehicle[0].pickup_time)+" min."
			}
			$('#duration').html(time);
			if(price!="0")
				$('#info_block').slideDown();
			price = price+" kr";
			$('#price').html(price);
		}

	});

	showMap(origin, destination);

	function showMap(o, d)
	{

		var directionsService = new google.maps.DirectionsService();
		var directionsDisplay = new google.maps.DirectionsRenderer();
		var myOptions = {
			center:new google.maps.LatLng(55.6761,12.5683),
			zoom:7,
			mapTypeId: google.maps.MapTypeId.ROADMAP,
			disableDefaultUI: true
		}
		var map = new google.maps.Map(document.getElementById("map"), myOptions);
		directionsDisplay.setMap(map);
		var request = {
			origin: document.getElementById("origin").value,
			destination: document.getElementById("destination").value,
			travelMode: google.maps.DirectionsTravelMode.DRIVING
		};
		directionsService.route(request, function(response, status) {
			if (status == google.maps.DirectionsStatus.OK) {
				// Display the distance:-->
				//document.getElementById('distance').innerHTML ="Distance: "+-->
				//Math.round((response.routes[0].legs[0].distance.value/1609.34) * 100) / 100 + " Miles";-->
				// Display the duration:-->
				document.getElementById('duration').innerHTML =""+
				Math.round((response.routes[0].legs[0].duration.value/3600) * 100) / 100  + " hours";
				directionsDisplay.setDirections(response);
			}
		});

	}

	$('#next').click(function(){
		if(!selectedTypeId){
			alert('Please select desired vehicle');
		}
		else if($("#origin").val().length>0 && $("#destination").val().length>0) {
			var selectedVehicle = available_vehicles.filter(function(vehicle){
				return vehicle.type.id == selectedTypeId;
			});
			if(selectedVehicle[0] && selectedVehicle[0].vehicles && selectedVehicle[0].vehicles.length){
				$('#booking-form').slideUp(200, function () {
					$('#notes-form').slideDown();
				});
			} else {
				$('#booking-form').slideUp(200, function () {
					$('#no-vehicle').slideDown();
				});
			}

		} else {
			alert('Please Select Pickup and Destination Locations');
		}
	});

	$('#back-screen2').click(function(){
		$('#notes-form').slideUp(200, function () {

			$('#booking-form').slideDown();
		});
	});
	$('#try-again').click(function(){
		$('#no-vehicle').slideUp(200, function () {

			$('#booking-form').slideDown();
		});
	});
	$('#book-anyway').click(function(){
		$('#no-vehicle').slideUp(200, function () {

			$('#notes-form').slideDown();
		});
	});
	/*$("#toggle-email").click(function(){
	 alert('kjhj');
	 $("#delivery-email").toggle();
	 });*/
	$("#toggle-email").click(function () {

		$header = $(this);
		//getting the next element
		$content = $header.next();
		//open up the content needed - toggle the slide- if visible, slide up, if not slidedown.
		$content.slideToggle(200, function () {
			//execute this after slideToggle is done
			//change text of header based on visibility of content div
			$header.text(function () {
				//change text based on condition
				return $content.is(":visible") ? "Send delivery status via email" : "Send delivery status via email	";
			});
		});

	});
	document.getElementById('request-delivery').onclick = function() {

		$('#request-delivery').prop('disabled',true).addClass('disabled');
		if(!selectedTypeId){
			alert('Please select desired vehicle');
			$('#request-delivery').prop('disabled',false).removeClass('disabled');
		}
		else if($("#origin").val().length>0 && $("#destination").val().length>0)
		{
			$('#request-delivery').prop('disabled',true).addClass('disabled');
			var requestDelivery = new XMLHttpRequest();
			requestDelivery.open("POST",api_url+"/deliveries/", true);
			requestDelivery.setRequestHeader("Content-type", "application/json");
			requestDelivery.setRequestHeader("Authorization", "JWT "+token_auth);

			requestDelivery.onreadystatechange = function () {


				if (requestDelivery.readyState == 4 && requestDelivery.status == 200) {
					var json = JSON.parse(requestDelivery.responseText);

					//console.log(json);
					console.log(json);

					delivery_id = json.delivery_id;

					var requestEliment = json;
					$('#request-delivery').prop('disabled',false).removeClass('disabled');
					$('#notes-form').slideUp(200,function(){


						if(json.status.id==8)
						{
							$('#payment-window-2').slideDown();
							$("#payment-window-2-invoice").css("display","none");
							if(userInfo && userInfo.monthlyInvoice && userInfo.monthlyInvoice == 1){
								$("#payment-window-2-invoice").css("display","block");
							}
//					$('#amount').html(price);
//					$('#first-step').addClass('complete');
						}
						else{
							if(userInfo && userInfo.monthlyInvoice && userInfo.monthlyInvoice == 1){
								var payDelivery = new XMLHttpRequest();
								payDelivery.open("POST",api_url+"/deliveries/" + delivery_id + "/monthly-invoice", true);
								payDelivery.setRequestHeader("Content-type", "application/json");
								payDelivery.setRequestHeader("Authorization", "JWT "+token_auth);

								payDelivery.onreadystatechange = function () {
									if (payDelivery.readyState == 4 && payDelivery.status == 200) {
										var json = JSON.parse(payDelivery.responseText);

										//console.log(json);
										console.log(json);
										$('#wait-form').slideDown(200, function(){
											$('#from').html(originText);
											$('#to').html(destinationText);
											$("#vehicle-img").attr("src","img/"+type+".png");
											$("#vehicle-name").html(vname);
											$("#wait-form-invoice").css("display","block");

										});
									} else {
										if(payDelivery.readyState == 4 && payDelivery.status == 505)
										{
											var json = JSON.parse(payDelivery.responseText);
											console.log('json', json);
											if(json && json.message)
												alert(json.message);
										}

									}
								}
								payDelivery.send();
							} else {
								price = requestEliment.price+" kr";
								$('#payment-window').slideDown();
								$('#amount').html(price);
								$('#first-step').addClass('complete');
							}

						}

					});


				}
				else{
					$('#request-delivery').prop('disabled',false).removeClass('disabled');
					if(requestDelivery.status == 505)
					{

					}

				}

			}
			var data = {};
			var cargoDetails = {};
			cargoDetails.weight = weight;
			cargoDetails.size = area;

			var pickup_location = {};
			pickup_location.description = (document.getElementById('origin').value);
			pickup_location.latitude = (Math.floor(origin.lat() * 100) / 100)+"";
			pickup_location.longitude=(Math.floor(origin.lng() * 100) / 100)+"";

			var pickup_options = {};

			if(document.getElementById('tolerance').value=='now')
			{
				pickup_options.when=document.getElementById('tolerance').value;
				pickup_options.date="";//moment().format('YYYY-MM-DD');
				pickup_options.time = "";//moment().format('hh:mm:ss');
			}
			if(document.getElementById('tolerance').value=='next 4 hours')
			{
				pickup_options.when=document.getElementById('tolerance').value;
				pickup_options.date=moment().format('YYYY-MM-DD');
				pickup_options.time = moment().add(4,'hours').format('hh:mm:ss');
			}
			if(document.getElementById('tolerance').value=='later')
			{
				//pickup_options.when=document.getElementById('tolerance').value;
				pickup_options.date=$('#date-text').val();
				pickup_options.time = $('#time-text').val()+":00";
			}



			var dropoff_location = {};
			dropoff_location.description="'"+document.getElementById('destination').value+"'";
			dropoff_location.latitude = (Math.floor(destination.lat() * 100) / 100)+"";
			dropoff_location.longitude = (Math.floor(destination.lng() * 100) / 100)+"";

			destinationText = document.getElementById('destination').value;
			originText = document.getElementById('origin').value;

			var dropoff_options = {};
			dropoff_options.date='';
			dropoff_options.time='';
			var refrigerated = $('#refrigerated').is(':checked')?'refrigerated':'';
			var extra = $('#extra').is(':checked')?'extra':'';
			var options = [];
			if(refrigerated){
				options.push(refrigerated);
			}
			data.vehicle_type = selectedTypeId+"";
			//data.cargo_details = cargoDetails;
			data.pickup_location = pickup_location;
			data.pickup_options = pickup_options;
			data.dropoff_location = dropoff_location;
			data.dropoff_options = dropoff_options;
			data.notes = (document.getElementById('note_text').value);
			data.promo_code='';
			data.options=options;


			console.log(JSON.stringify(data));

			requestDelivery.send(JSON.stringify(data));
		}

		else{
			alert('Please Select Pickup and Destination Locations');
			$('#request-delivery').prop('disabled',false).removeClass('disabled');
		}

	};

	String.prototype.trunc = String.prototype.trunc ||
	function(n){
		return (this.length > n) ? this.substr(0,n-1)+'&hellip;' : this;
	};

	$('#pay').click(function(){


		//var myVar = setTimeout(myFunction, 5500);
		$("#adyen-encrypted-form").validate();
		if(!validCardNumber){
			$('#card-error').css('display', 'block');
		} else if(!document.getElementById('name').value){
			alert('Please enter holder name');
		}else if(!document.getElementById('cvc').value){
			alert('Please enter cvc/cvv');
		}else {
			if($("#adyen-encrypted-form").valid())
			{
				$('#pay').prop('disabled',true).addClass('disabled');
				$('#card-error').css('display', 'none');
				var name = document.getElementById('name').value;
				var number = document.getElementById('number').value;
				var month = document.getElementById('month').value;
				var year = document.getElementById('year').value;
				var cvc = document.getElementById('cvc').value;
				encryptExample(name, number, month, year, cvc);

			}
		}



	});

	$('#back').click(function(){
		$('#payment-form').slideUp(200,function(){

			$('#payment-window').slideDown();
		});
	});
	$('#cancel-delivery').click(function(){
		var cancelDelivery = new XMLHttpRequest();
		cancelDelivery.open("POST",api_url+"/deliveries/" + delivery_id + "/cancel", true);
		cancelDelivery.setRequestHeader("Content-type", "application/json");
		cancelDelivery.setRequestHeader("Authorization", "JWT "+token_auth);
		cancelDelivery.onreadystatechange = function () {
			if (cancelDelivery.readyState == 4 && cancelDelivery.status == 200) {
				var json = JSON.parse(cancelDelivery.responseText);
				//console.log(json);
				console.log(json);
				$('#wait-form').slideUp(200,function(){
					$('#cancel-window').slideDown();
				});
			} else {
				if(cancelDelivery.status == 505)
				{

				}
			}
		};
		cancelDelivery.send();
	});

	$('#book-again').click(function(){
		$('#cancel-window').slideUp(200,function(){

			$('#booking-form').slideDown();
		});
	});

	$('#schedule-another').click(function(){
		$('#reject').slideUp(200,function(){

			$('#booking-form').slideDown();
		});
	});

	function myFunction() {

		$('#wait-form').slideUp(200,function(){

			$('#reject').slideDown();

		});

	}

	$('#number').keyup(function(e){
		$('#card-error').css('display', 'none');
		$('#pay').prop('disabled',false).removeClass('disabled');
		var cardNumber = $(this).val().split(" ").join("");
		if (cardNumber.length > 0) {
			cardNumber = cardNumber.match(new RegExp('.{1,4}', 'g')).join(" ");
		}
		$(this).val(cardNumber);
	});

	$('#number').blur(function (e) {
		var cardnumber = e.target.value;
		cardnumber = cardnumber.replace(/[ -]/g, '');
		// See if the card is valid
		// The regex will capture the number in one of the capturing groups
		var match = /^(?:(4[0-9]{12}(?:[0-9]{3})?)|(5[1-5][0-9]{14})|(6(?:011|5[0-9]{2})[0-9]{12})|(3[47][0-9]{13})|(3(?:0[0-5]|[68][0-9])[0-9]{11})|((?:2131|1800|35[0-9]{3})[0-9]{11}))$/.exec(cardnumber);
		if (match) {
			validCardNumber = true;
			$('#card-error').css('display', 'none');
		} else {
			validCardNumber = false;
			$('#card-error').css('display', 'block');
		}
	});

	$('#cvc').keyup(function(e){
		$('#pay').prop('disabled',false).removeClass('disabled');
	});

	$('#year').change(function(e){
		$('#pay').prop('disabled',false).removeClass('disabled');
	});


	$('#month').change(function(e){
		$('#pay').prop('disabled',false).removeClass('disabled');
	});
	/*$('#vehicles button').bind('click',function(){
	 var elIndex = $(this).index();
	 console.log(elIndex);
	 });*/

	$('#vehicles').bind('click', function(event) {
		selectedTypeId = $(event.target).closest('button')[0].id;
		var index = 0;
		$(event.target).closest('button').addClass('active');
		if($("#origin").val().length>0 && $("#destination").val().length>0){
			$("#price-div").removeClass("help-text");
			$("#duration-div").css("display","block");
			var selectedVehicle = available_vehicles.filter(function(vehicle){
				return vehicle.type.id == selectedTypeId;
			});
			price = selectedVehicle[0] && selectedVehicle[0].estimated_cost;
			if(selectedVehicle[0] && (selectedVehicle[0].pickup_time)>59)
			{
				var time = (selectedVehicle[0].pickup_time)/60+" hrs."
				$("#duration-div").css("display","block");
			}
			else if(selectedVehicle[0] && (selectedVehicle[0].pickup_time) == 0){
				$("#duration-div").css("display","none");
				$("#price-div").addClass("help-text");
			} else {
				$("#duration-div").css("display","block");
				var time = (selectedVehicle[0].pickup_time)+" min."
			}
			$('#duration').html(time);
			if(price!="0")
				$('#info_block').slideDown();
			price = price+" kr";
			$('#price').html(price);
		}
		$('#vehicles').find('button').each(function() {
			if ($(event.target).closest('button').index() == index) {
			}
			else {
				$(this).removeClass('active');
			}
			index++;
		});
		$('#vehicleSelectBox').val('-');

	});

	var key     =   "10001|D1678A66D856650F4B506561F5326C880FFBAF10CF31BF2ED0DB537CF53C464577054AC87039A3A9137F5B3DFA9C878602F14BB1D1C8B613C4926A2F1C0C50D864F830CC38A347867526BA0DB0AC1AACFF746F2CC643A7D3ED9256C5D1869CE46EF605E168A7D3C8C84F32D03B2CFB89665506786DCDBD8547AFEEF921B18465920FF91BF1EA7F1AB8343927ED8309CADB37A87F78F9649A223497F0670C43753FBBF133A4965D6D79373421B689596DFCF55D05D94B5CCBFB59D3A50D3A778316802EE6398B260A96838BA35B9040ECC81C754CE3662F6FE50A0E4D792B739379CABB6B3318B48CF45CE886D79E4EAFB0DAD081DAE2DA043FBC1ED33611F1C9";

	var options = {};
	options.enableValidations=false;

	// Enable basic field validation (default is true)
	// The submit button will be disabled when fields
	// proof to be invalid. The form submission will be
	// prevented as well.
	// options.enableValidations = true;

	// Ignore non-numeric characters in the card number field (default
	// is true)
	// The payment handling ignores non-numeric characters for the card
	// field.
	// By default non-numeric characters will also be ignored while
	// validating
	// the card number field. This can be disabled for UX reasons.
	// options.numberIgnoreNonNumeric = true;

	// Ignore CVC validations for certain bins. Supply a comma separated
	// list.
	// options.cvcIgnoreBins = '6703'; // Ignore CVC for BCMC

	// Use 4digit cvc for certain bins. Supply a comma separated list.
	// options.fourDigitCvcForBins = '34,37'; // Set 4 digit CVC for Amex


	var cseInstance = adyen.encrypt.createEncryption(key, options);

	function getEncryptedFormData(cardNumber, cvc, holderName, expiryMonth, expiryYear, generationtime) {

		var postData = {};

		var cardData = {
			number : cardNumber,
			cvc : cvc,
			holderName : holderName,
			expiryMonth : expiryMonth,
			expiryYear : expiryYear,
			generationtime : generationtime
		};

		postData['adyen-encrypted-data'] = cseInstance.encrypt(cardData);

		return postData;
	}

	function encryptExample(name , number, month, year, cvc) {
		var generationTime = new Date().toISOString(); // Note:
		// Generate this
		// serverside!

		var postData = getEncryptedFormData(number, cvc, name, month, year, generationTime);

		var mString = JSON.stringify(postData);



		mString = mString.replace("adyen-encrypted-data", "aed");
		var parsedString = JSON.parse(mString);
		console.log("Post data: " + JSON.stringify(postData));

		var payDelivery = new XMLHttpRequest();
		payDelivery.open("POST",api_url+"/deliveries/"+delivery_id+"/pay", true);
		payDelivery.setRequestHeader("Content-type", "application/json");
		payDelivery.setRequestHeader("Authorization", "JWT "+token_auth);

		payDelivery.onreadystatechange = function () {
			if (payDelivery.readyState == 4 && payDelivery.status == 200) {
				var json = JSON.parse(payDelivery.responseText);

				//console.log(json);
				console.log(json);


				var requestEliment = json;
				$('#second-step').addClass('complete');
				$('#payment-form').slideUp(200,function(){

					$('#wait-form').slideDown(200, function(){
						$('#from').html(originText);
						$('#to').html(destinationText);
						$("#vehicle-img").attr("src","img/"+type+".png");
						$("#vehicle-name").html(vname);
						$("#wait-form-invoice").css("display","none");

					});

				});




			}
			else{
				if(payDelivery.readyState == 4 && payDelivery.status == 505)
				{
					var json = JSON.parse(payDelivery.responseText);
					console.log('json', json);
					if(json && json.message)
						alert(json.message);
				}
			}


		}

		var payData = {};

		payData.encryptedData = parsedString.aed;

		console.log(JSON.stringify(payData));

		payDelivery.send(JSON.stringify(payData));





	}

});