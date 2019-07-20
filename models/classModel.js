'use strict';
var util = require('util');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const schoolDB = require("./schoolModel.js")

var ClassSchema = new Schema({
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
		type: Date,
		default: Date.now
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
	newClass.createDate = new Date().getTime();

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

// 根据信息查询班级
exports.findClassByStr = function(whereStr, callback) {
	Class.findOne(
		whereStr,
		function(err, doc) {
			if (err) {
				return callback(err);
			}
			if (!doc) {
				return callback(null, null);
			}
			callback(null, doc);
		});
}
