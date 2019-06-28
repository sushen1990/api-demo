'use strict';
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;
const userDB = require("./userModel.js")

var StudentSchema = new Schema({
	//唯一学号
	studentNum: {
		type: String,
		default: null
	},
	isShow: {
		type: Boolean,
		default: false
	},
	truename: {
		type: String,
		default: null
	},
	modelId: {
		type: String,
		default: null
	},
	//班级id
	classId: {
		type: String,
		default: null
	},
	//班级名称
	className: {
		type: String,
		default: null
	},
	//出生日期
	brithDay: {
		type: Number,
		default: 0
	},
	//创建时间
	createDate: {
		type: Number,
		default: 0
	},
	//性别
	sex: {
		type: Number,
		default: 0
	},
	headimgurl: {
		type: String,
		default: null
	},
	note: {
		type: String,
		default: null
	},
	//手机卡号
	mobile: {
		type: String,
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
	// 预备家长手机号 1、初始导入学生数据的家长手机号 2、 管理员家长添加的手机号。获取手机号验证码的时候需要在这里验证
	preParentsPhones: [{
		type: String,
		default: null
	}],
	//关联家长Id
	parents: [{
		type: String,
		default: null
	}],
	//管理家长Id
	adminParent: {
		type: String,
		default: null
	},
	//身份证号码
	ChinaCardId: {
		type: String,
		default: null
	},
	//民族
	nation: {
		type: String,
		default: null
	}
});

//访问Student对象模型
mongoose.model('Student', StudentSchema);
var Student = mongoose.model('Student');


//根据家长id查询学生
exports.findStudentByParentUserId = function(parentUserId, modelId, callback) {
	Student.findOne({
		parents: parentUserId,
		modelId: modelId,
		isShow: true
	}, function(err, doc) {
		if (err) {
			util.log('FATAL ' + err);
			return callback(err, null);
		}
		callback(null, doc);
	});
}

//根据预备家长手机号查询数据
exports.findStudentByPrePhone = function (phone, modelId, callback) {
	Student.findOne({
		preParentsPhones: phone,
		modelId: modelId,
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}


