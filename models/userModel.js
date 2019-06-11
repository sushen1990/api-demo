'use strict';
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;


const UserSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	userName: {
		type: String,
		default: null
	},
	nickname: {
		type: String,
		default: null
	},
	truename: {
		type: String,
		default: null
	},
	roleId: {
		type: String,
		default: null
	},
	roleName: {
		type: String,
		default: null
	},
	companyName: {
		type: String,
		default: null
	},
	companyId: {
		type: String,
		default: null
	},
	modelId: {
		type: String,
		default: null
	},
	modelTitle: {
		type: String,
		default: null
	},
	lastLoginTime: {
		type: Number,
		default: new Date().getTime()
	},
	lastLoginWay: {
		type: String,
		default: null
	},
	profession: {
		type: String,
		default: null
	},
	school: {
		type: String,
		default: null
	},
	degree: {
		type: String,
		default: null
	},
	entSchoolDate: {
		type: Number,
		default: new Date().getTime()
	},
	createDate: {
		type: Number,
		default: new Date().getTime()
	},
	openid: {
		type: String,
		default: null
	},
	weapp_openid: {
		type: String,
		default: null
	},
	unionid: {
		type: String,
		default: null
	},
	wechatSubscribe: {
		type: Boolean,
		default: true
	},
	wechatSubscribeDate: {
		type: Number,
		default: new Date().getTime()
	},
	channelId: {
		type: String,
		default: null
	},
	channelName: {
		type: String,
		default: null
	},
	agentId: {
		type: String,
		default: null
	},
	agentTrueName: {
		type: String,
		default: null
	},
	storeId: {
		type: String,
		default: null
	},
	storeName: {
		type: String,
		default: null
	},
	email: {
		type: String,
		default: null
	},
	mobile: {
		type: String,
		default: null
	},
	password: {
		type: String,
		default: null
	},
	sex: {
		type: Number,
		default: 0
	},
	city: {
		type: String,
		default: null
	},
	province: {
		type: String,
		default: null
	},
	country: {
		type: String,
		default: null
	},
	headimgurl: {
		type: String,
		default: null
	},
	note: {
		type: String,
		default: null
	},
	level: {
		type: Number,
		default: null
	},
	//会员卡真实卡号
	cardId: {
		type: String,
		default: null
	},
	//会员卡印刷卡号
	cardName: {
		type: String,
		default: null
	},
	groupId: {
		type: String,
		default: null
	},
	groupName: {
		type: String,
		default: null
	},
	//身份 map=['妈妈','爸爸','爷爷','奶奶','姥姥','姥爷','其他']
	studentStatus: {
		type: Number,
		default: null
	}
});

//访问user对象模型
mongoose.model('User', UserSchema);
const User = mongoose.model('User');

//根据手机号查询用户
// exports.findUserByMobile = function(mobile, modelId, lastLoginWay, callback) {
// 	User.findOne({
// 		mobile: mobile,
// 		modelId: modelId
// 	}, function(err, doc) {
// 		if (err) {
// 			util.log('FATAL ' + err);
// 			return callback(err, null);
// 		}
// 		if (doc) {
// 			doc.lastLoginWay = lastLoginWay;
// 			doc.lastLoginTime = new Date().getTime();
// 			doc.save();
// 		}
// 		callback(null, doc);
// 	});
// }

//根据手机号查询用户
exports.findUserByMobile = function(mobile, modelId, lastLoginWay, callback) {
	User.findOne({
		mobile: mobile,
		modelId: modelId
	}).then(doc => {
		
		if(doc){
			callback(null, doc);
		}else{
			return callback("当前用户不在数据库中", null);
		}
		
	}).catch(err => {
		return callback(err, null);
	});
}

//根据id查询用户
exports.findUserById = function(userId, callback) {
	User.findOne({
		_id: userId,
		isShow: true
	}).then(doc => {
		
		if(doc){
			callback(null, doc);
		}else{
			return callback("当前用户不在数据库中", null);
		}
		
	}).catch(err => {
		return callback(err, null);
	});
}

