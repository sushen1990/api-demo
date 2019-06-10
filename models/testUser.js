const mongoose = require("mongoose")
const Schema = mongoose.Schema

// 初始化schema

const UserSchema = new Schema({
	name:{
		type:String,
		required:true
	},
	email:{
		type:String,
		required:true
	},
	psd:{
		type:String,
		required:true
	},
	data:{
		type:Date,
		default:Date.now
	}
})

module.exports = User = mongoose.model("testUser1",UserSchema) // 这里才是mongDB中的表名