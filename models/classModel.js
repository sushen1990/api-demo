'use strict';
var util = require('util');
var async = require('async');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

const userDB = require("./userModel.js")

var ClassSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	modelId: {
		type: String,
		default: null
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
	//创建时间
	createDate: {
		type: Number,
		default: null
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

//根据学校ID查询学校信息
exports.findClassById = function(classId, callback) {
	Class.findOne({
		_id: classId,
		isShow: true
	}, function(err, doc) {
		if (err) {
			util.log('FATAL ' + err);
			return callback(err, null);
		}
		if (!doc) {
			return callback(null, null);
		}
		if (!doc.teachers) {
			return callback(null, doc);
		}
		async.map(doc.teachers, function(item, cb) {
			userDB.findUserById(item.userId, function(err1, doc1) {
				if (err1) {
					return cb(err1);
				}
				if (!doc1) {
					return cb('no data');
				}
				var obj = {
					userId: item.userId,
					userName: item.userName,
					headImgUrl: doc1.headimgurl,
					classType: item.classType,
					jobType: item.jobType
				}
				cb(null, obj);
			});
		}, function(err, results) {
			if (err) {
				return callback(null, doc);
			}
			doc.teachers = results;
			callback(null, doc);
		});
	});
}