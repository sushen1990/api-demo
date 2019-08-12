'use strict';
var util = require('util');
var mongoose = require('mongoose');
var Schema = mongoose.Schema;

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
	// 是否在有效期内，当前时间超过有效期的时候，自动变为false，需要续费
	isInEffective: {
		type: Boolean,
		default: false
	},
	//有效时间截止时间点，过了这个时间就会失效。isInEffective变为false
	effectiveDate: {
		type: Date,
		default: null
	},
	//创建时间
	createDate: {
		type: Number
	},
	//学校ID
	schoolId: {
		type: String,
		default: null
	},
	//学校名称
	schoolName: {
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
	truename: {
		type: String,
		default: null
	},
	//出生日期
	brithDay: {
		type: Number,
		default: 0
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

});

//访问Student对象模型
mongoose.model('Student', StudentSchema);
var Student = mongoose.model('Student');


//保存学生信息
exports.studentSave = function(postData, callback) {
	let newStudent = new Student();
	newStudent.isShow = true;

	newStudent.createDate = Date.now();
	newStudent.schoolId = postData.schoolId;
	newStudent.schoolName = postData.schoolName;
	newStudent.classId = postData.classId;
	newStudent.className = postData.className;

	newStudent.truename = postData.truename;
	newStudent.ChinaCardId = postData.ChinaCardId;
	newStudent.brithDay = postData.brithDay;
	newStudent.sex = postData.sex;

	newStudent.preParentsPhones = postData.preParentsPhones;
	newStudent.parents = postData.parents;
	newStudent.adminParent = postData.adminParent;


	// save学生信息 start ↓
	newStudent.save(function(err) {
		if (err) {
			return callback(err);
		}
		callback(null, newStudent);
	});
	// save学生信息 end   ↑
}

//根据家长id查询学生
exports.findStudentByParentUserId = function(parentUserId, modelId, callback) {
	Student.findOne({
		parents: parentUserId,
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
exports.findStudentByPrePhone = function(phone, modelId, callback) {
	Student.findOne({
		preParentsPhones: phone,
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}

//根据学生身份证号验证学生
exports.findStudentByChinaCardId = function(ChinaCardId, callback) {
	Student.findOne({
		ChinaCardId: ChinaCardId,
		isShow: true
	}, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}

// 获取学生数据
exports.findStudentListPaginate  = function(schoolId, classId, page, size, callback) {

	Student.find({
		isShow: true,
		schoolId: schoolId,
		classId: classId
	}, function(err1, doc) {
		if (err1) {
			return callback(err1, null);
		}
		Student.countDocuments({
			isShow: true,
			schoolId: schoolId,
			classId: classId
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
