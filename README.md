###开发目的
这算是node应用的第二个小应用吧，主要目的是熟悉node和express框架。原理很简单：在node搭建的环境下引用第三方包处理图片数据并返回给前台信息。
实现效果，百度提供的图片识别，经过测试识别车牌号等规范文字数字还是比较准确的
###环境需求
1.Express 是一个非常流行的node.js的web框架。基于connect(node中间件框架)。提供了很多便于处理http请求等web开发相关的扩展。
2.OCR：
通用文字识别 Node SDK目录结构：
<pre><code>
├── src
    │  ├── auth                                //授权相关类
    │  ├── http                                //Http通信相关类
    │  ├── client                              //公用类
    │  ├── util                                //工具类
    │  └── const                               //常量类
    ├── AipOcr.js                      //通用文字识别交互类
    ├── index.js                               //入口文件
    └── package.json                           //npm包描述文件
  </code> </pre> 
  支持 node 版本 4.0+
  直接使用node开发包步骤如下：
1.在官方网站下载node SDK压缩包。
2.将下载的aip-node-sdk-version.zip解压后，复制到工程文件夹中。
3.进入目录，运行npm install安装sdk依赖库
4.把目录当做模块依赖
其中，version为版本号，添加完成后，用户就可以在工程中使用通用文字识别 Node SDK。
直接使用npm安装依赖：
npm install baidu-aip-sdk（**尝试没有成功**）

AipOcrClient是Optical Character Recognition的node客户端，为使用Optical Character Recognition的开发人员提供了一系列的交互方法。
用户可以参考如下代码新建一个AipOcrClient：
<code>
var AipOcrClient = require("baidu-aip-sdk").ocr;
// 设置APPID/AK/SK
var APP_ID = "你的 App ID";
var API_KEY = "你的 Api Key";
var SECRET_KEY = "你的 Secret Key";
var client = new AipOcrClient(APP_ID, API_KEY, SECRET_KEY);
</code>
*express搭建就不再做详细介绍了，上一篇博客已有哦~~*

###功能实现
前端上传图片后端处理：
<pre><code>
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
</code></pre>
图片处理核心模块:
<pre><code>
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
</code></pre>
获取到的base64图片数据和res对象作为阐述传递给ocr提供好的方法，
回调产生的数据将作为结果返回给前端。
***####小彩蛋：***
nodeJs中commonJs规范如何实现的？

1.Node程序由许多个模块组成，每个模块就是一个文件。Node模块采用了CommonJS规范。
2.module对象，Node内部提供一个Module构建函数。所有模块都是Module的实例。每个模块内部，都有一个module对象，代表当前模块。它有以下属性。

    module.id 模块的识别符，通常是带有绝对路径的模块文件名。
    module.filename 模块的文件名，带有绝对路径。
    module.loaded 返回一个布尔值，表示模块是否已经完成加载。
    module.parent 返回一个对象，表示调用该模块的模块。
    module.children 返回一个数组，表示该模块要用到的其他模块。
    module.exports 表示模块对外输出的值。
3.调用：根据模块名称作为对象调用其内自定义的方法即可。

<code> global.nodeServer.getResult(res,imgName);</code>

*前端js代码就不贴了 so~easy*

###效果展示
![这里写图片描述](http://img.blog.csdn.net/20171128143449471?watermark/2/text/aHR0cDovL2Jsb2cuY3Nkbi5uZXQvYWxhZGRpbmdvZA==/font/5a6L5L2T/fontsize/400/fill/I0JBQkFCMA==/dissolve/70/gravity/SouthEast)


