'use strict';
const util = require('util');
const mongoose = require('mongoose');
require('mongoose-long')(mongoose);
const Schema = mongoose.Schema;
const moment = require('moment');
const SchemaTypes = mongoose.Schema.Types;

var StudentSchema = new Schema({
	isShow: {
		type: Boolean,
		default: false
	},
	// 是否在有效期内，当前时间超过有效期的时候，自动变为false，需要续费
	isInEffective: {
		type: Boolean,
		default: false
	},
	//有效时间截止时间点，过了这个时间点就会失效。isInEffective变为false 数据格式为 yyyy-mm-DD 转换来的时间戳
	effectiveDate: {
		type: SchemaTypes.Long,
		default: 0
	},
	//创建时间
	createDate: {
		type: SchemaTypes.Long,
		default: 0
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
		type: String
	},
	//身份证号码
	ChinaCardId: {
		type: SchemaTypes.Long,
		default: 0
	},
	//性别
	sex: {
		type: String
	},
	note: {
		type: String,
		default: null
	},
	//手机卡号
	mobile: {
		type: SchemaTypes.Long,
		default: 0
	},
	// 预备家长手机号 1、初始导入学生数据的家长手机号 2、 管理员家长添加的手机号。获取手机号验证码的时候需要在这里验证
	preParentsPhones: [{
		type: SchemaTypes.Long,
		default: 0
	}],
	//所有家长Id
	parents: [{
		type: String,
		default: null
	}],
	//管理员家长手机号
	adminParentMobile: {
		type: SchemaTypes.Long,
		default: 0
	},
	//管理员家长Id
	adminParentId: {
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
	newStudent.preParentsPhones = postData.preParentsPhones;
	newStudent.parents = postData.parents;
	newStudent.adminParent = postData.adminParent;

	let card = postData.ChinaCardId;
	let birthDay = card.substr(6, 8);
	birthDay = moment(birthDay).valueOf();

	let sex = card.substr(16, 1);
	sex = (sex % 2 == 0) ? "女" : "男";
	newStudent.brithDay = birthDay;

	newStudent.sex = sex;


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

// 根据whereStr 查找学生
exports.findStudentByWhereStr = function(whereStr, callback) {
	Student.findOne(whereStr, function(err, doc) {
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
exports.findStudentListPaginate = function(schoolId, classId, page, size, callback) {

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
};


// 更新学生的家长信息 参数家长Id 手机号 

exports.updateStudentParent = function(postData, callback) {

	let _id = postData._id;
	let mobile = postData.mobile;

	// 有预备手机号，但是没有在家长列表里面。
	let condition = {
		"$and": [{
				"preParentsPhones": mobile
			},
			{
				"parents": {
					"$ne": _id
				}
			}
		]
	};

	Student.find(condition, function(err, result) {
		if (err) {
			return callback(err, null);
		};
		if (result.lenth == 0) {
			callback(null, 0);
		}
		// 家长未关联的情况

		// 再判断是否存在管理员家长

		let existsAdmin = result[0].adminParentMobile == 0 && result[0].adminParentId == null;
		let doc = {
			parents: _id
		};

		let adminParentMobile = result[0].adminParentMobile;
		let adminParentId = result[0].adminParentId;

		let aa = {
			existsAdmin: existsAdmin,
			adminParentMobile: adminParentMobile,
			adminParentId: adminParentId,

		}
		if (existsAdmin) {
			// 没有管理员家长
			doc["adminParentId"] = _id;
			doc["adminParentMobile"] = mobile;
		};

		// Student.updateMany(condition, doc, function(err1, raw) {
		// 	if (err1) {
		// 		return callback(err1);
		// 	};
		// 	return callback(null, aa);
		// });
		callback(null, result);

	});
};
