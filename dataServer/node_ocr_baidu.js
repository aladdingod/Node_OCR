var AipOcrClient = require("aip-node-sdk-1.4.1").ocr;

// 设置APPID/AK/SK
var APP_ID = "10403470";
var API_KEY = "cf0iE3yKa2u4CFMpDzKwrfAC";
var SECRET_KEY = "3EQwCWo6Itm0QUCzx6KOoemFxnO4V13k";

var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);

var fs = require('fs');

module.exports = { 
	getResult : function(res,imgName){
		var image = fs.readFileSync(imgName);
		var base64Img = new Buffer(image).toString('base64');
		client.generalBasic(base64Img).then(function(result) {
	    	console.log(JSON.stringify(result));
	    	res.json(result);
		});
	}
}
