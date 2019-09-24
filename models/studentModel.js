'use strict';

const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;
const moment = require('moment');
const SchemaTypes = mongoose.Schema.Types;
const Promise = require('bluebird');

var StudentSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	// 是否在有效期内，当前时间超过有效期的时候，自动变为false，需要续费
	isEffective: {
		type: Boolean,
		default: false
	},
	//设备失效时间点，过了这个时间点就会失效。isEffective变为false 数据格式为 yyyy-mm-DD 转换来的时间戳。订单增加的时候，会自动增加。
	expire_at: {
		type: SchemaTypes.Long,
		default: 0
	},
	//创建时间
	create_at: {
		type: SchemaTypes.Long,
		default: 0
	},
	//学校ID
	school_id: {
		type: String,
		default: null
	},
	//学校名称
	school_name: {
		type: String,
		default: null
	},
	//班级id
	class_id: {
		type: String,
		default: null
	},
	//班级名称
	class_name: {
		type: String,
		default: null
	},
	true_name: {
		type: String,
		default: null
	},
	//出生日期
	brithDay: {
		type: String
	},
	//身份证号码
	chian_card_id: {
		type: SchemaTypes.Long,
		default: 0
	},
	//性别
	sex: {
		type: String
	},
	remarks: {
		type: String,
		default: ''
	},
	//手机卡号
	mobile: {
		type: SchemaTypes.Long,
		default: 0
	},
	// 预备家长手机号 1、初始导入学生数据的家长手机号 2、 管理员家长添加的手机号。获取手机号验证码的时候需要在这里验证
	pre_mobiles: [{
		type: SchemaTypes.Long,
		default: 0
	}],
	//所有家长Id
	parents: [{
		type: String,
		default: null
	}],
	//管理员家长手机号
	admin_mobile: {
		type: SchemaTypes.Long,
		default: 0
	},
	//管理员家长Id
	admin_id: {
		type: String,
		default: null
	},

});

//访问Student对象模型
var Student = mongoose.model('Student', StudentSchema);

// -------------------------------使用bluebird 
//promise化user类及其方法
Promise.promisifyAll(Student);
Promise.promisifyAll(Student.prototype);

module.exports = Student;
