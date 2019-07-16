const express = require("express")
const app = express()

const port = 3000 // 阿里云ECS服务器
const fs = require("fs") //文件
const cors = require('cors'); //跨域
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const config = require("./config")
const Schedule = require('./common/schedule') 

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

// 定时执行任务
// Schedule.scheduleCronstyle()

// mongoRUI="mongodb://aly_root:d456_FJ35LLL@localhost:27899/xiaoantong"

mongoRUI = config.mongoRUI;
const DB =  mongoRUI ;
mongoose.connect(DB,
			{ useNewUrlParser: true ,
			  useFindAndModify: false
			}
		)
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

// 获取验证码
const veryfiCodeApi = require("./router/api/veryfiCode")
app.use("/api/veryfiCode",veryfiCodeApi)

// 订单相关
const orderApi = require("./router/api/order")
app.use("/api/order",orderApi)

//支付相关
const payAPI = require("./router/api/pay")
app.use("/api/pay", payAPI)

//学校相关
const schoolAPI = require("./router/api/school")
app.use("/api/school", schoolAPI)