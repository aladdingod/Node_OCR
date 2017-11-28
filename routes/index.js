var express = require('express');
var router = express.Router();
var fs = require("fs");
var formidable = require('formidable');

/* GET home page. */
router.route("/uploadPhoto").get(function(req,res){    // 到达此路径则渲染register文件，并传出title值供 register.html使用
    res.render("uploadPhoto",{title:'图片文字识别',message:""});
}).post(function(req,res){
	// 跨域
    res.header("Access-Control-Allow-Origin", "*");
    res.header("Access-Control-Allow-Methods","PUT,POST,GET,DELETE,OPTIONS");
    res.header("Access-Control-Allow-Headers", "Content-Type,Content-Length, Authorization, Accept,X-Requested-With");
    
    let form = new formidable.IncomingForm();
    form.encoding = 'utf-8'; // 编码
    form.keepExtensions = true; // 保留扩展名
    form.maxFieldsSize = 2 * 1024 * 1024; // 文件大小
    form.uploadDir = 'F:/nodejs/ocrCheck/assets/OCR'  // 存储路径
    form.parse(req,function(err,fileds,files){ // 解析 formData数据
        if(err){ return console.log(err) }

        let imgPath = files.img.path // 获取文件路径
        let imgName = "F:/nodejs/ocrCheck/assets/OCR/test." + files.img.type.split("/")[1] // 修改之后的名字
        let data = fs.readFileSync(imgPath) // 同步读取文件

        fs.writeFile(imgName,data,function(err){ // 存储文件
            if(err){ return console.log(err) }

            fs.unlink(imgPath,function(){}) // 删除文件
            //上传图片成功返回code:1
            //res.json({code:1})
            global.nodeServer.getResult(res,imgName);
        })
    });
});
module.exports = router;
