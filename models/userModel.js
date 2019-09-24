'use strict';
const util = require('util');
const mongoose = require('mongoose')
require('mongoose-long')(mongoose);
const Promise = require('bluebird');

const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;

const UserSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	truename: {
		type: String,
		default: null
	},
	roleName: {
		type: String,
		default: null
	},
	//  登录手机唯一识别号
	clientId: {
		type: String,
		default: null
	},
	createDate: {
		type: SchemaTypes.Long,
		default: Date.now()
	},
	mobile: {
		type: SchemaTypes.Long,
		default: 0
	},
});

//访问user对象模型
const User = mongoose.model('User', UserSchema);

// 保存对象
exports.SaveNew = function(postData, callback) {

	let newUser = new User();
	newUser.roleName = "学生家长";
	newUser.isShow = true;
	newUser.truename = postData.truename;
	newUser.mobile = postData.mobile;
	newUser.clientId = postData.cid;

	newUser.save(function(err) {
		if (err) {
			return callback(err);
		};
		callback(null, newUser);
	});
}



// 家长用户通过验证码登录的时候，如果数据库没有就新建用户数据。最后都要返回用户数据
exports.userLoginByCode = function(postData, callback) {

	let newUser = new User();
	newUser.roleName = "学生家长";
	newUser.isShow = true;
	newUser.truename = postData.truename;
	newUser.mobile = postData.mobile;
	newUser.clientId = postData.cid;

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
		// 已注册 直接返回查询到的信息
		if (doc) {
			// 更新cid
			User.findOneAndUpdate({
				mobile: postData.mobile,
				isShow: true
			}, {
				clientId: postData.cid
			}, {
				new: true
			}, function(err1, doc1) {
				if (err1) {
					return callback(err1);
				};
				callback(null, {
					"msg": "ok",
					"info": "already_exists",
					"data": doc1
				});
			});
		} else {
			// 未注册 保存信息
			newUser.save(function(err2) {
				if (err2) {
					return callback(err2);
				};
				callback(null, {
					"msg": "ok",
					"info": "new_save",
					"data": newUser
				});
			});
		}
	});
};

// 根据whereStr 查询单个用户
exports.findUserBywhereStr = function(whereStr, callback) {
	User.findOne(whereStr, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
};

// 根据whereStr 查询多个用户
exports.findManyUsersBywhereStr = function(whereStr, callback) {
	User.find(whereStr, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
};

// -------------------------------使用bluebird 
//promise化user类及其方法
Promise.promisifyAll(User);
Promise.promisifyAll(User.prototype);

module.exports = User;
