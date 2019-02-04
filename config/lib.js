var slug=require('slug');
var requestImg = require('request').defaults({ encoding: null });
var api={}


/*
========== CONFIGURATION ============	
*/

//Uncomment as per usage
api.config={
	version:'0.0.3',
	homepage:'http://something.com'
};



/*
========== FUNCTIONS ============	
*/

/**
 * [p description] Quick Print
 * @type {String} 
 */
 api.p=console.log.bind(console,'> ');

/**
 * COnverts an image url to Base64
 * @param {String} url - The Url of the image
 * @param {Function} cb - Teh Call back Function, in the standard format (err,data)
 */
 api.Img2B64=function (url,cb){
 	requestImg.get(url, function (error, response, body) {
 		if (!error && response.statusCode == 200) {
 			//data = "data:" + response.headers["content-type"] + ";base64," + new Buffer(body).toString('base64');
 			data = new Buffer(body).toString('base64');
 			return cb(false,data);
 		}else{
 			return cb(true,error);
 		}
 	});
 };


/**
 * Slugifies a string
 * @param  {String} str - The STring to be slugified
 * @return {[type]} str - Slugified String
 */
 api.slug=function(str){
 	return slug(str).toLowerCase();
 };


 api.chunk=function(array,chunkSize){
 	var i,j,temparray=[];
 	chunkSize=(chunkSize!=undefined)?chunkSize:5;
 	for (i=0,j=array.length; i<j; i+=chunkSize) {
 		temparray.push(array.slice(i,i+chunkSize));
 	}
 	return temparray;
 };


//Checks if a string is JSON or not. Returns json object or false
function IsJsonString(str) {
  var json=null;
  try {
    json=JSON.parse(str);
  } catch (e) {
    return false;
  }
  return json;
}

//Soft copy properties and retuns new object
function ObjCopy(obj1,obj2){
  for (var attrname in obj2) { obj1[attrname] = obj2[attrname]; }

    return obj1;  
};


 module.exports=api;