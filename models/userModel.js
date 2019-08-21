'use strict';
const util = require('util');
const mongoose = require('mongoose')
require('mongoose-long')(mongoose);

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;


const UserSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	userName: {
		type: String,
		default: null
	},
	truename: {
		type: String,
		default: null
	},
	isAdmin: {
		type: Boolean,
		default: false
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
		type: SchemaTypes.Long
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
		type: SchemaTypes.Long,
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

// 新建对象 不管是否新建 都会返回用户信息 主要依据是手机号
exports.SaveNew = function(postData, callback) {

	let newUser = new User();
	newUser.createDate = Date.now();
	newUser.roleName = "学生家长";
	newUser.isShow = true;
	newUser.truename = postData.truename;
	newUser.mobile = postData.mobile;
	
	//  查找手机号 是否已注册
	User.findOne({
		mobile: postData.mobile,
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		};
		let result = {
			"msg": "no",
			"info": null,
			"data": null
		};
		if (!doc) {
			// 未注册 保存信息
			newUser.save(function(err1) {
				if (err) {
					return callback(err1);
				};
				result["msg"] = "yes";
				result["info"] = "new_save";
				result["data"] = newUser;
				return callback(null, result);
			});
		};
		// 已注册 直接返回查询到的信息
		result["msg"] = "yes";
		result["info"] = "already_exists";
		result["data"] = doc;
		callback(null, result);
	});
};

//根据手机号查询用户
exports.findUserByMobile = function(mobile, callback) {
	User.findOne({
		mobile: mobile,
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		};
		// if (!doc) {
		// 	return callback(null, []);
		// };
		callback(null, doc);
	});
}

//根据id查询用户
exports.findUserById = function(userId, callback) {
	User.findOne({
		_id: userId,
		isShow: true
	}).then(doc => {

		if (doc) {
			callback(null, doc);
		} else {
			return callback("当前用户不在数据库中", null);
		}

	}).catch(err => {
		return callback(err, null);
	});
};

//更新家长
exports.updateParent = function(condition, doc, callback) {
	User.find({
		_id: userId,
		isShow: true
	}).then(doc => {

		if (doc) {
			callback(null, doc);
		} else {
			return callback("当前用户不在数据库中", null);
		}

	}).catch(err => {
		return callback(err, null);
	});
};
