const express = require("express")
const app = express()
const path = require("path")

const port = 3000 // 阿里云ECS服务器
const fs = require("fs") //文件
const cors = require('cors'); //跨域
const mongoose = require("mongoose") 
const bodyParser = require("body-parser")
const passport = require('passport'); // 验证token



const config = require("./config")
const Schedule = require('./common/schedule')

app.use(cors()); //解决跨域

//  1. 连接数据库
const DB = require('./config/keys').mongoURI;
// const DB = require('./config/keys').localMongoURI;
mongoose
	.connect(
		DB, {
			useNewUrlParser: true,
			useUnifiedTopology: true
		}
	)
	.then(() => console.log('MongoDB Connected'))
	.catch(err => console.log(err));

//  2. 使用bodyParser中间件
app.use(bodyParser.urlencoded({
	extended: false
}))
app.use(bodyParser.json())

// 3. 转换https服务
const https = require("https")
var options = {
	key: fs.readFileSync('./static/2301701_www.sushen1990.cn.key'),
	cert: fs.readFileSync('./static/2301701_www.sushen1990.cn.pem')
}
const httpsServer = https.createServer(options, app);

app.listen(port, (result) => {
	console.log(`http服务器运行在端口[${port}]`)
})

// httpsServer.listen(port, function() {
// console.log(`https服务器运行在端口[${port}]`)
// });

// 4. app下载页面
app.set('views', path.join(__dirname, 'views'));
app.set('view engine', 'ejs');
app.get("/app", (req, res) => {
	res.render('index')
})

// 5. 定时执行任务
// Schedule.scheduleCronstyle()


// 6. 使用routes
app.get("/", (req, res) => {
	res.send("hello q")
})


const adminAPI = require('./router/api/admin'); 
app.use('/api/v1/admin', adminAPI);

//学校相关
const schoolAPI = require("./router/api/school")
app.use("/api/v1/school", schoolAPI)

// // 用户相关
// const userAPI = require("./router/api/user")
// app.use("/api/user", userAPI)

// // 获取banner信息之类的
// const resApi = require("./router/api/res")
// app.use("/api/res", resApi)

// // 定位设备
// const locationApi = require("./router/api/location")
// app.use("/api/location", locationApi)

// 获取验证码
const veryfiCodeApi = require("./router/api/veryfiCode")
app.use("/api/veryfiCode", veryfiCodeApi)

// // 订单相关
// const orderApi = require("./router/api/order")
// app.use("/api/order", orderApi)

// //支付相关
// const payAPI = require("./router/api/pay")
// app.use("/api/pay", payAPI)



// //班级相关
// const classlAPI = require("./router/api/class")
// app.use("/api/class", classlAPI)

// //学生相关
// const studentAPI = require("./router/api/student")
// app.use("/api/student", studentAPI)

// //家长相关
// const parentAPI = require("./router/api/parent")
// app.use("/api/parent", parentAPI)

// //教师相关
const teacherAPI = require('./router/api/teacher')
app.use("/api/teacher", teacherAPI)

// //飞安信API整合
// const fei_an_xinAPI = require("./router/api/fei_an_xin")
// app.use("/api/fei_an_xin", fei_an_xinAPI)

// // app版本更新
// const app_versionAPI = require('./router/api/app_version')
// app.use("/api/app_version", app_versionAPI)


// 7. passport 初始化
app.use(passport.initialize());
require('./common/passport')(passport);
