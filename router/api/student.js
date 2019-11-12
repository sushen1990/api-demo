'use strict';
const express = require("express");
const router = express.Router();
const moment = require('moment');
const classDB = require("../../models/classModel")
const schoolDB = require("../../models/schoolModel")
const studentDB = require("../../models/studentModel")
const userDB = require("../../models/userModel")
const config = require("../../config")
const Helper = require('../../common/helper');
const validator = require('../../validator/index');

// 保存学生
router.post("/studentSave", (req, res) => {

	let Scode = req.body.Scode;
	let schoolId = req.body.schoolId;
	let schoolName = req.body.schoolName;
	let classId = req.body.classId;
	let className = req.body.className;
	let truename = req.body.truename;
	let ChinaCardId = req.body.ChinaCardId;
	let preParentsPhones = req.body.preParentsPhones;


	// 参数验证 start ↓
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	}
	if (Helper.checkReal(schoolId)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数schoolId"
		})
	}
	if (Helper.checkReal(schoolName)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数schoolName"
		})
	}
	if (Helper.checkReal(classId)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数classId"
		})
	}
	if (Helper.checkReal(className)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数className"
		})
	}
	if (Helper.checkReal(truename)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数truename"
		})
	}
	if (Helper.checkReal(ChinaCardId)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数ChinaCardId"
		})
	}

	// 参数验证 end   ↑

	studentDB.findStudentByChinaCardId(
		ChinaCardId,
		function(err, doc) {
			if (err) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err
				})
			}
			// 去重查询 start ↓
			if (doc) {
				return res.status(403).json({
					msg: "no",
					data: "当前学生身份照号已注册"
				})
			}
			// 去重查询 end   ↑ 

			// 保存student信息到数据库 start ↓
			const postData = {
				schoolId: schoolId,
				schoolName: schoolName,
				classId: classId,
				className: className,
				truename: truename,
				ChinaCardId: ChinaCardId,
				preParentsPhones: preParentsPhones,
			};
			studentDB.studentSave(postData, function(err, result) {
				if (err) {
					return res.status(500).json({
						msg: "no",
						data: "服务器内部错误,请联系后台开发人员!!!" + err
					})
				}
				if (result) {
					let data = result;
					res.json({
						msg: "ok",
						data: data
					})
				}
			});
			// 保存student信息到数据库 end   ↑		
		}
	);
});



// 分页获取学生 start
router.post("/studentListPage", (req, res) => {
	let Scode = req.body.Scode;
	let page = req.body.page;
	let size = req.body.size;
	let schoolId = req.body.schoolId;
	let classId = req.body.classId;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	if (Helper.checkReal(page)) {
		return res.status(400).json({
			msg: "no",
			data: "page错误"
		})
	};
	if (Helper.checkReal(size)) {
		return res.status(400).json({
			msg: "no",
			data: "size错误"
		})
	};
	if (Helper.checkReal(schoolId)) {
		return res.status(400).json({
			msg: "no",
			data: "schoolId错误"
		})
	};
	if (Helper.checkReal(classId)) {
		return res.status(400).json({
			msg: "no",
			data: "classId错误"
		})
	};

	studentDB.findStudentListPaginate(schoolId, classId, page, size, function(err, doc) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		}
		if (!doc || doc.length == 0) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据！"
			})
		}
		let data = doc;
		res.status(200).json({
			msg: "ok",
			data: data
		})
	})
})

// 根据预设家长号查找学生
router.post("/findStudentByPrePhone", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;

	// 参数验证 start ↓
	if (Helper.checkTel(mobile)) {
		return res.status(400).json({
			msg: "no",
			data: "手机号码需要为11位数字"
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 参数验证 end   ↑
	let whereStr = {
		isShow: true,
		preParentsPhones: mobile
	};
	studentDB.findStudentByWhereStr(whereStr, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		};
		if (!result) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据"
			})
		} else {
			res.json({
				msg: "ok",
				data: result
			})
		};
	});
})


// 根据id查找学生
router.post("/findStudentById", (req, res) => {
	let Scode = req.body.Scode;
	let _id = req.body._id;

	// 参数验证 start ↓

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 参数验证 end   ↑
	let whereStr = {
		isShow: true,
		_id: _id
	};
	studentDB.findStudentByWhereStr(whereStr, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		};
		if (!result) {
			return res.status(404).json({
				msg: "no",
				data: "没有数据"
			})
		} else {
			res.json({
				msg: "ok",
				data: result
			})
		};
	});
})

// 根据whereStr查找学生
// _id、truename、ChinaCardId
router.post("/findStudentByhereStr", (req, res) => {
	let Scode = req.body.Scode;
	let ChinaCardId = req.body.ChinaCardId;
	let _id = req.body._id;
	let truename = req.body.truename;

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};

	let condition = {};

	if (ChinaCardId) {
		if (Helper.checkReal(ChinaCardId)) {
			return res.status(400).json({
				msg: "no",
				data: "手机号码需要为11位数字"
			})
		};
		condition.mobile = mobile;
	};
	if (_id) {
		if (Helper.checkReal(_id)) {
			return res.status(400).json({
				msg: "no",
				data: "_id错误"
			})
		};
		condition._id = _id;
	};
	if (truename) {
		if (Helper.checkReal(truename)) {
			return res.status(400).json({
				msg: "no",
				data: "姓名错误"
			})
		};
		condition.truename = truename;
	};

	if (Object.keys(condition).length == 0) {
		return res.status(400).json({
			msg: "no",
			data: "至少提供一个参数"
		})
	};

	studentDB.findStudentByWhereStr(condition, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			});
		};
		if (!result) {
			return res.status(404).json({
				msg: "no",
				data: "服务器端没有查询到数据！"
			});
		};
		res.json({
			msg: "ok",
			data: result
		})
	});
})


// 根据学生ID查询预设家长信息
router.post("/findPerPhoneByStudentId", (req, res) => {
	let Scode = req.body.Scode;
	let studentId = req.body.studentId;

	// 参数验证 start ↓
	if (Helper.checkReal(studentId)) {
		return res.status(400).json({
			msg: "no",
			data: "studentId错误"
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 参数验证 end   ↑
	let whereStr = {
		isShow: true,
		_id: studentId
	};
	studentDB.findStudentByWhereStr(whereStr, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		};
		if (!result) {
			return res.status(200).json({
				msg: "no",
				data: "没有数据"
			})
		} else {
			res.json({
				msg: "ok",
				data: result
			})
		};
	});
})




// findOneAndUpdateStudent
router.post("/findOneAndUpdateStudent", (req, res) => {
	let Scode = req.body.Scode;
	let truename = req.body.truename;
	let newTruename = req.body.newTruename;

	// 参数验证 start ↓

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	if (Helper.checkReal(truename)) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	if (Helper.checkReal(newTruename)) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 参数验证 end   ↑
	let whereStr = {
		isShow: true,
		truename
	};
	let doc = {
		truename: newTruename
	}
	studentDB.findOneAndUpdateStudent(whereStr, doc, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		};
		if (result.data == null) {
			return res.json({
				msg: "no",
				data: "没有数据"
			})
		} else {
			res.json({
				msg: "ok",
				data: result
			})
		};
	});
})

// --------------------bluebird

// 获取单个学生信息 Id mobile 至少有一个
router.post('/student_info', (req, res) => {
	let now_time = moment().format('YYYY-MM-DD HH:mm:ss.SSS')

	// 1. 验证参数
	// 1.1 计划要验证的参数、是否必须的
	let plan_param = { // 
		'Scode': true,
		'student_id': false,
		'student_mobile': false,
	}

	// 1.2 提交到validator
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_param, req.body)

	// 1.3 获取 validator 的结果
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			now_time
		})
	}
	let student_id = true_list.student_id;
	let student_mobile = true_list.student_mobile;

	// 1.4 Id mobile 至少有一个
	if (student_id === '' && student_mobile === '') {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: true_list,
			now_time
		})
	}

	// 2. 整理query参数
	let and_list = [];
	if (student_id != '') {
		and_list.push({
			'_id': student_id
		})
	}
	if (student_mobile != '') {
		and_list.push({
			'mobile': student_mobile
		})
	}
	let query = {
		'$and': and_list
	};

	// 3.数据库查找
	studentDB.findOne(query).then((student) => {
		if (student === null) {
			res.json({
				msg: 'no',
				info: 'not_extsis',
				data: null,
				now_time
			})
		} else {
			res.json({
				msg: 'ok',
				info: 'got_it',
				data: {
					student
				},
				now_time
			})
		}

	}).catch((err) => {

		//  4. 记录err
		res.json({
			msg: 'no',
			info: 'err',
			data: err,
			now_time
		});
	})
})



module.exports = router;
