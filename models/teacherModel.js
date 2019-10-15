'use strict';
const mongoose = require('mongoose')
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;
const SchemaTypes = mongoose.Schema.Types;
// const Promise = require('bluebird');

//定义Order对象模型
var TeacherSchema = new Schema({
	//手机号
	mobile: {
		type: SchemaTypes.Long,
		default: 0
	},
	//班级id
	class_id: {
		type: String,
		default: ''
	},
	name: {
		type: String,
		default: ''
	},
	is_show: {
		type: Boolean,
		default: true
	},
	creat_at: {
		type: SchemaTypes.Long,
		default: 0
	},
	update_at: {
		type: SchemaTypes.Long,
		default: 0
	},
});

var Teacher = mongoose.model("Teacher", TeacherSchema);

//promise化user类及其方法
// Promise.promisifyAll(Teacher);
// Promise.promisifyAll(Teacher.prototype);

module.exports = Teacher;
