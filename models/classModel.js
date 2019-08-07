'use strict';
const util = require('util');
const async = require('async');
const mongoose = require('mongoose');
const Schema = mongoose.Schema;
// 分页插件

const schoolDB = require("./schoolModel.js")

const ClassSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	schoolId: {
		type: String,
		default: null
	},
	schoolName: {
		type: String,
		default: null
	},
	className: {
		type: String,
		default: null
	},
	//年级
	grade: {
		type: Number,
		default: null
	},
	//班级
	_class: {
		type: Number,
		default: null
	},
	//创建时间
	createDate: {
		type: Date
	},
	//老师
	teachers: [{
		userId: {
			type: String,
			default: null
		},
		userName: {
			type: String,
			default: null
		},
		headImgUrl: {
			type: String,
			default: null
		},
		//老师类别 map=['语文','数学','英语','体育','音乐','美术','品德','信息技术','写字','科学','物理','化学','生物','政治','历史','地理','其他']
		classType: {
			type: Number,
			default: null
		},
		//职务类别 map=['班主任','副班主任','校长','副校长','会计','后勤']
		jobType: {
			type: Number,
			default: null
		}
	}]
});

//访问user对象模型
mongoose.model('Class', ClassSchema);
const Class = mongoose.model('Class');

// 增加学校
exports.classSave = function(postData, callback) {
	let newClass = new Class();
	newClass.isShow = true;
	newClass.schoolId = postData.schoolId;
	newClass.schoolName = postData.schoolName;

	newClass.grade = postData.grade;
	newClass._class = postData._class;
	newClass.className = postData.className;

	let date = new Date();
	date.setHours(date.getHours() + 8);
	newClass.createDate = date;


	// 验证schoolId start
	let _id = postData.schoolId;
	schoolDB.findSchoolById(_id, function(err, doc) {
		if (err) {
			return callback(err);
		}
		if (!doc) {
			return callback(null, "学校不可用");
		}

		newClass.save(function(err) {
			if (err) {
				return callback(err);
			}
			callback(null, newClass);

		});
	})
	// 验证schoolId end
}


//根据ID查询班级
exports.findClassById = function(classId, callback) {
	Class.findOne({
		_id: classId,
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		if (!doc) {
			return callback(null, null);
		}
		callback(null, doc);
	});
}
// 分页获取指定学校的班级数据
exports.getClassListPaginate = function(schoolId, page, size, callback) {

	Class.find({
		isShow: true,
		schoolId: schoolId
	}, function(err1, doc) {
		if (err1) {
			return callback(err1, null);
		}
		Class.countDocuments({
			isShow: true,
			schoolId: schoolId
		}, function(err2, total) {
			if (err2) {
				return callback(err2, null);
			}
			let newDoc = {
				data: doc,
				total: total
			}
			callback(null, newDoc);
		})
	}).limit(parseInt(size)).skip((page - 1) * size).sort({
		_id: -1
	});
}

// 根据信息查询班级
exports.findClassByStr = function(whereStr, callback) {
	Class.find(
		whereStr, {
			_id: 1,
			className: 1
		},
		function(err, doc) {
			if (err) {
				return callback(err);
			}
			if (!doc || doc.length == 0) {
				return callback(null, null);
			}
			callback(null, doc);
		});
}
