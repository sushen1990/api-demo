const mongoose = require("mongoose")
const Schema = mongoose.Schema

// 初始化schema

const UserSchema = new Schema({
	innerHtml:{
		type:String,
		required:true
	}
})

module.exports = User = mongoose.model("innerHtmls",UserSchema)