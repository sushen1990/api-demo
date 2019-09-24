const express = require("express")
const app = express()
const path = require("path")

const port = 3000 // 阿里云ECS服务器
const fs = require("fs") //文件
const cors = require('cors'); //跨域
const mongoose = require("mongoose")
const bodyParser = require("body-parser")
const config = require("./config")
const Schedule = require('./common/schedule')

const Promise = require('bluebird'); // 异步问题
mongoose.Promise = Promise;

app.use(cors()); //解决跨域




// 转换https服务
const https = require("https")
var options = {
	key: fs.readFileSync('./static/2301701_www.sushen1990.cn.key'),
	cert: fs.readFileSync('./static/2301701_www.sushen1990.cn.pem')
}

https.createServer(options, app).listen(port, function(result) {
	console.log(`https服务器运行在端口[${port}]`)
	console.log(result)
})

// var httpsServer = https.createServer(options, app);
// httpsServer.listen(port, function() {
// 	console.log('HTTP Server is running on: %s', port);
// });

// console.log(httpsServer)
// 访问页面内容
app.get("/", (req, res) => {
	res.send("hello q")
})


app.get("/app", (req, res) => {
	res.render('index')
})


// 定时执行任务
// Schedule.scheduleCronstyle()

// mongoRUI="mongodb://aly_root:d456_FJ35LLL@localhost:27899/xiaoantong"

mongoRUI = config.mongoRUI;
const DB = mongoRUI;
mongoose.connect(DB)
 // {
	// 	useNewUrlParser: true,
	// 	useFindAndModify: false
	// }
	.then(() => console.log("数据库连接成功"))
	.catch(err => console.log(err))

// 使用bodyParser中间件
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

// view engine setup
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');


// 用户相关
const userAPI = require("./router/api/user")
app.use("/api/user", userAPI)

// 获取banner信息之类的
const resApi = require("./router/api/res")
app.use("/api/res", resApi)

// 定位设备
const locationApi = require("./router/api/location")
app.use("/api/location", locationApi)

// 获取验证码
const veryfiCodeApi = require("./router/api/veryfiCode")
app.use("/api/veryfiCode", veryfiCodeApi)

// 订单相关
const orderApi = require("./router/api/order")
app.use("/api/order", orderApi)

//支付相关
const payAPI = require("./router/api/pay")
app.use("/api/pay", payAPI)

//学校相关
const schoolAPI = require("./router/api/school")
app.use("/api/school", schoolAPI)

//班级相关
const classlAPI = require("./router/api/class")
app.use("/api/class", classlAPI)

//学生相关
const studentAPI = require("./router/api/student")
app.use("/api/student", studentAPI)

//家长相关
const parentAPI = require("./router/api/parent")
app.use("/api/parent", parentAPI)

//教师相关
const teacherAPI = require('./router/api/teacher')
app.use("/api/teacher", teacherAPI)

//飞安信API整合
const fei_an_xinAPI = require("./router/api/fei_an_xin")
app.use("/api/fei_an_xin", fei_an_xinAPI)

// app版本更新
const app_versionAPI = require('./router/api/app_version')
app.use("/api/app_version", app_versionAPI)
