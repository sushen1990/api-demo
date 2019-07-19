'use strict';
const util = require('util');
const mongoose = require('mongoose');
const config = require('../config');
const Schema = mongoose.Schema;

const SchoolSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	schoolName: {
		type: String,
		default: null
	},
	//创建时间
	createDate: {
		type: Date,
		default: Date.now
	},
	//国标收货地址第一级地址
	proviceFirstStageName: {
		type: String,
		default: null
	},
	//国标收货地址第二级地址
	addressCitySecondStageName: {
		type: String,
		default: null
	},
	//国标收货地址第三级地址
	addressCountiesThirdStageName: {
		type: String,
		default: null
	},
	//地址
	address: {
		type: String,
		default: null
	},
	//联系人
	contacts: {
		type: String,
		default: null
	},
	//联系电话
	contactsPhone: {
		type: String,
		default: null
	},
	//学校类别 map=['小学','初中','高中','中专','大学']
	schoolType: {
		type: Number,
		default: null
	},
	//坐标
	position: {
		type: String,
		default: null
	},
	//安全项目列表
	safetyGoods: [{
		safetyGoods_id: {
			type: String,
			default: ''
		},
		safetyGoods_title: {
			type: String,
			default: ''
		},
		startTime: {
			type: Number,
			default: 0
		}
	}],
	//学校介绍
	info: {
		type: String,
		default: ''
	},
	//学校照片
	imageUrl: {
		type: String,
		default: ''
	}
});

//访问school对象模型
mongoose.model('school', SchoolSchema);
const School = mongoose.model('school');


// 创建新学校
exports.schoolSave = function(postData, callback) {
	let newSchool = new School();
	newSchool.isShow = true;
	newSchool.schoolName = postData.schoolName;
	newSchool.createDate = new Date().getTime();
	newSchool.proviceFirstStageName = postData.proviceFirstStageName;
	newSchool.addressCitySecondStageName = postData.addressCitySecondStageName;
	newSchool.addressCountiesThirdStageName = postData.addressCountiesThirdStageName;
	newSchool.address = postData.address;
	newSchool.contacts = postData.contacts;
	newSchool.contactsPhone = postData.contactsPhone;
	newSchool.schoolType = postData.schoolType;
	newSchool.position = postData.position;
	newSchool.info = postData.info;
	newSchool.imageUrl = postData.imageUrl;
	newSchool.save(function(err) {
		if (err) {
			return callback(err);
		} else {
			return callback(null, newSchool);
		}
	});
}

//根据id查询学校
exports.findSchoolById = function(schoolId, callback) {
	School.findById(
		schoolId	
	, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}

//根据name查询学校
exports.findSchoolByName = function(name, callback) {
	School.findOne({
		schoolName: name,
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}

// 获取学校列表
exports.getSchoolList = function(callback) {
	School.find({
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}

// 删除学校列表
exports.schoolRemove = function(schoolID, callback) {
	School.findByIdAndUpdate(schoolID, {
			isShow: false
		},
		function(err, doc) {
			if (err) {
				return callback(err, null);
			}
			callback(null, doc);
		});
}
