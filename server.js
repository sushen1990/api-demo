const express = require("express")
const app = express()

const port = process.env.PORT || 5000

// 访问页面内容
app.get("/",(req,res) =>{
	res.send("hello q")
})

// 监听服务器
app.listen(port, ()=> {
	console.log(`服务器运行在端口[${port}]`)
})


// 访问数据库
const mongoose = require("mongoose")

mongoRUI = "mongodb://localhost/admin"

const DB =  mongoRUI

mongoose.connect(DB,{ useNewUrlParser: true })
        .then(() => console.log("数据库连接成功"))
        .catch(err => console.log(err))
		
// 调用简单的api接口

const usersAPI = require("./router/api/users")
app.use("/api/users",usersAPI)