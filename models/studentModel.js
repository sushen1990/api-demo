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
	//设备失效时间点，过了这个时间点就会失效。isInEffective变为false 数据格式为 yyyy-mm-DD 转换来的时间戳。订单增加的时候，会自动增加。
	expireDate: {
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


// 保存学生信息
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



// 根据家长id查询学生
exports.findStudentsByParentUserId = function(parentId, callback) {
	let whereStr = {
		parents: parentId,
		isShow: true
	};
	// let projection = {
	// 	createDate: 0,
	// 	note: 0,
	// 	createDate: 0,
	// 	brithDay: 0,
	// 	__v: 0,
	// };
	Student.find(whereStr, function(err, doc) {
		if (err) {
			return callback(err, null);
		};
		let newDoc = {
			total: 0,
			data: null
		}
		if (doc.lenth == 0) {
			return callback(null, newDoc);
		};

		Student.countDocuments(whereStr, function(err1, total) {
			if (err1) {
				return callback(err1, null);
			};
			newDoc = {
				total: total,
				data: doc
			}
			callback(null, newDoc);
		});

	});
}

// 根据whereStr 查找学生
exports.findStudentByWhereStr = function(whereStr, callback) {
	Student.find(whereStr, function(err, doc) {
		if (err) {
			return callback(err, null);
		}
		callback(null, doc);
	});
}

// 根据学生身份证号验证学生
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




// 更新学生的家长预备手机号
exports.updatePrePhones = function(condition, doc, callback) {
	Student.updateMany(condition, doc, function(err, raw) {
		if (err) {
			return callback(err);
		};

		callback(null, {
			msg: "yes",
			data: raw
		})
	});
}

// 更新学生的家长信息
// 返回 {parent:0,admin:0} 
exports.updateStudentParent = function(postData, callback) {

	let _id = postData._id;
	let mobile = postData.mobile;

	// 定义返回数据 普通家长更新数量 管理员家长更新数量
	let returnData = {
		parent: 0,
		admin: 0
	}

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
	//  判断当前家长是否已关联  nModified
	Student.find(condition, function(err, result) {
		if (err) {
			return callback(err, null);
		};
		if (result.length == 0) {
			return callback(null, returnData);
		}
		// 家长未关联的情况

		// 首先关联为普通家长
		let doc = {
			'$push': {
				parents: _id
			}
		};
		Student.updateMany(condition, doc, function(err1, raw1) {
			if (err1) {
				return callback(err1);
			};
			// 返回关联此家长为普通家长，的学生数量
			returnData.parent = raw1.nModified;

			//  判断是否没有管理员家长
			condition = {
				"$and": [{
						"preParentsPhones": mobile
					},
					{
						"adminParentMobile": 0
					},
					{
						"adminParentId": null
					}
				]
			};
			doc = {
				adminParentMobile: mobile,
				adminParentId: _id
			};
			Student.find(condition, doc, function(err2, result2) {
				if (err2) {
					return callback(err2);
				};
				if (result2.length == 0) {
					return callback(null, raw1);
				};
				//  如果学生没有管理员家长 ，关联上
				Student.updateMany(condition, doc, function(err3, raw3) {
					if (err3) {
						return callback(err3);
					};
					// 返回关联此家长为管理员家长，的学生数量
					returnData.admin = raw3.nModified;
					callback(null, returnData)
				});
			});
		});
	});
};

// 更新学生数据，默认这里的 condition 都是已经经过确认的！
exports.updateStudentBywhereStr = function(condition, doc, callback) {
	Student.updateMany(condition, doc, function(err, result) {
		if (err) {
			return callback(err);
		};
		if (!result) {
			return callback(null, {
				msg: 'no',
				data: "没有更新数据",
			})
		}
		callback(null, {
			msg: 'yes',
			data: result,
		})
	})
}
// 更新学生数据，默认这里的 condition 都是已经经过确认的！
exports.findOneAndUpdateStudent = function(condition, doc, callback) {
	Student.findOneAndUpdate(condition, doc, {
		new: true
	}, function(err, result) {
		if (err) {
			return callback(err);
		};
		callback(null,{
			msg: 'yes',
			data: result,
		})
	})
}
