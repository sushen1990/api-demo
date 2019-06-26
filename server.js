const express = require("express")
const app = express()

const port = 3000 // 阿里云ECS服务器
const fs = require("fs") //文件
const cors = require('cors'); //跨域
const mongoose = require("mongoose")
const bodyParser = require("body-parser")

const config = require("./config")

app.use(cors()); //解决跨域


// 转换https服务
const https = require("https")
var options = {
	key: fs.readFileSync('./static/2301701_www.sushen1990.cn.key'),
	cert: fs.readFileSync('./static/2301701_www.sushen1990.cn.pem')
}


https.createServer(options,app).listen(port)
console.log(`https服务器运行在端口[${port}]`)
// 访问页面内容
app.get("/",(req,res) =>{
	res.send("hello q")
})


// 访问数据库
// mongoRUI = "mongodb://aly_root:d456_FJ35LLL@127.0.0.1:27899/admin"
// mongoRUI="mongodb://aly_root:d456_FJ35LLL@localhost:27899/xiaoantong"

// mongoRUI = "mongodb://xat:xat@localhost:27899/xiaoantong";
mongoRUI = config.mongoRUI;
const DB =  mongoRUI ;
mongoose.connect(DB,{ useNewUrlParser: true })
        .then(() => console.log("数据库连接成功"))
        .catch(err => console.log(err))

// 使用bodyParser中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
		
// 用户相关
const usersAPI = require("./router/api/users")
app.use("/api/users",usersAPI) 

// 获取banner信息之类的
const resApi = require("./router/api/res")
app.use("/api/res",resApi)

// 定位设备
const locationApi = require("./router/api/location")
app.use("/api/location",locationApi)

// 获取呀正码
const veryfiCodeApi = require("./router/api/veryfiCode")
app.use("/api/veryfiCode",veryfiCodeApi)


// 错误的innerHTML
// const innerHtmlApi = require("./router/api/innerHtml")
// app.use("/api/innerHtml",innerHtmlApi) 



