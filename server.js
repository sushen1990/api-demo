const express = require("express")
const app = express()
// const port = process.env.PORT || 5000 // win测试
const port = 3000 // 阿里云ECS服务器
const fs = require("fs")
const mongoose = require("mongoose")
const bodyParser = require("body-parser")


// 转换https服务
const https = require("https")
var options = {
	key: fs.readFileSync('./static/2301701_www.sushen1990.cn.key'),
	cert: fs.readFileSync('./static/2301701_www.sushen1990.cn.pem')
}

// 监听服务器
// app.listen(port, ()=> {
// 	console.log(`服务器运行在端口[${port}]`)
// })
// 
https.createServer(options,app).listen(port)
console.log(`https服务器运行在端口[${port}]`)
// 访问页面内容
app.get("/",(req,res) =>{
	res.send("hello q")
})


// 访问数据库
// mongoRUI = "mongodb://aly_root:d456_FJ35LLL@127.0.0.1:27899/admin"
// mongoRUI = "mongodb://aly_root:d456_FJ35LLL@39.97.33.102:27899/admin"
mongoRUI="mongodb://localhost/admin"
const DB =  mongoRUI
mongoose.connect(DB,{ useNewUrlParser: true })
        .then(() => console.log("数据库连接成功"))
        .catch(err => console.log(err))

// 使用bodyParser中间件
app.use(bodyParser.urlencoded({extended:false}))
app.use(bodyParser.json())
		
// 调用简单的api接口
const usersAPI = require("./router/api/users")
app.use("/api/users",usersAPI) 


