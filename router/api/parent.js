'use strict';
const express = require("express");
const router = express.Router();
const moment = require('moment');

const studentDB = require("../../models/studentModel")
const userDB = require("../../models/userModel")
const veryfiCodeDB = require("../../models/veryfiCodeModel");

const validator = require('../../validator/index');
const config = require("../../config")
const Helper = require('../../common/helper');

// 测试接口是否连通
router.get("/test", (req, res) => {
	res.json({
		msg: "hello parent"
	})
});

// 根据家长id获取所有学生信息
router.post("/getAllStudentInfo", (req, res) => {

	let userId = req.body.userId;
	let Scode = req.body.Scode;

	// 参数验证
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	if (Helper.checkReal(userId)) {
		return res.status(400).json({
			msg: "no",
			data: "userId错误"
		})
	};

	// 查询userId是否在数据库
	let condition = {
		_id: userId
	};
	userDB.findUserBywhereStr(condition, function(err, result) {
		if (err) {
			return res.status(500).json({
				msg: "no",
				data: "服务器内部错误,请联系后台开发人员!!!" + err
			})
		};
		if (!result) {
			return res.json({
				msg: "no",
				data: "没有数据"
			})
		};

		// 获取所有学生信息
		condition = {
			parents: userId,
			isShow: true
		}
		studentDB.findManyStudentsByWhereStr(condition, function(err1, result1) {
			if (err1) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err1
				})
			};
			if (!result1) {
				return res.json({
					msg: "no",
					data: "没有数据"
				})
			};

			res.json({
				msg: "ok",
				data: result1
			})
		})
	})
});



// 移除用户和学生的关联关系，并不是删除用户
router.post("/parentDelete", (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;
	let studentId = req.body.studentId;

	// 参数验证
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
	if (Helper.checkReal(studentId)) {
		return res.status(400).json({
			msg: "no",
			data: "studentId错误"
		})
	};

	// studentDB查询学生Id是否存在
	let condition = {
		_id: studentId
	}
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
				data: "studentDB服务器端没有查询到数据！"
			});
		};


		let mobileList = result.preParentsPhones; // 验证家长手机号存在于学生表中
		if (!mobileList.includes(mobile)) {
			return res.status(200).json({
				msg: "no",
				data: "当前手机号不存在，无需删除！"
			});
		};

		if (mobile == result.adminParentMobile) { // 管理员手机号无需删除
			return res.status(200).json({
				msg: "no",
				data: "当前手机号为管理员所有，无法删除！"
			});
		}

		// 查询手机号是否已注册，如果已注册的话，用户id也同步移除
		condition = {
			mobile
		}
		userDB.findUserBywhereStr(condition, function(err1, result1) {
			if (err1) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err1
				});
			};
			let doc = null;
			if (result1) { // 用戶已注册
				doc = {
					'$pull': {
						preParentsPhones: mobile,
						parents: result1._id
					}
				}
			} else { // 用戶没有注册
				doc = {
					'$pull': {
						preParentsPhones: mobile
					}
				}
			};

			// 同步到学生表中
			condition = {
				_id: studentId
			}
			studentDB.updatePrePhones(condition, doc, function(err2, result2) {
				if (err2) {
					return res.status(500).json({
						msg: "no",
						data: "服务器内部错误,请联系后台开发人员!!!" + err2
					});
				};
				res.json({
					msg: "yes",
					data: result2
				})
			})
		})
	})
})

// -----------bluebird

// 根据手机号添加家长
router.post('/parent_add', (req, res) => {
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

	// 1. 验证参数
	let plan_param = {
		'Scode': true,
		'student_id': true,
		'parent_mobile': true,
	};
	const {
		errors,
		isValid,
		trueList
	} = validator(plan_param, req.body);
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			nowTime
		})
	};

	// 2. 整理trueList
	let student_id = trueList.student_id;
	let parent_mobile = trueList.parent_mobile;

	// 3. 整理query参数
	let query = {
		'_id': student_id
	};

	// 4. studentDB数据库查找
	let err_msg = '';
	let err_data = '';
	studentDB.findOne(query).then((student) => {
		if (student === null) { // 
			err_msg = 'not_extsis';
			err_data = 'student_id不存在';
			throw new err('not_extsis')
		}
		if (student.preParentsPhones.includes(parent_mobile)) { //
			err_msg = 'already_exists ';
			err_data = '手机号已关联，请勿重复关联';
			throw new err('already_exists')
		}
		if (student.preParentsPhones.length >= 4) { //
			err_msg = 'count_limit';
			err_data = '手机号数量已达4个，无法添加';
			throw new err('count_limit')
		}

		// 5. userDB数据库查找
		return userDB.findOne({
			'mobile': parent_mobile
		})
	}).then((parent) => {
		let doc = null;
		let return_new = {
			'new': true
		};
		if (parent != null) {
			doc = { // 5.1 家长已注册，id也要同步到学生
				'$push': {
					'preParentsPhones': parent_mobile,
					'parents': parent._id
				}
			}
		} else {
			doc = { // 5.2 家长没有注册，只同步手机号
				'$push': {
					'preParentsPhones': parent_mobile
				}
			}
		}

		// 6. 更新学生表
		return studentDB.findOneAndUpdate(query, doc, return_new)
	}).then((result) => {
		if (result === null) {
			err_msg = 'update_fail';
			err_data = '添加失败，请稍后再试';
			throw new err('update_fail')
		} else {
			res.json({
				msg: 'ok',
				info: 'update_done',
				data: result,
				nowTime,
			});
		}
	}).catch((err) => {
		//  4. 记录err

		return res.json({
			msg: 'no',
			info: err_msg === '' ? 'err' : err_msg,
			data: {
				'err': err_data === '' ? err : err_data
			},
			nowTime,
		});
	})

})

// 根据手机号移除家长
router.post('/parent_delete', (req, res) => {
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

	// 1. 验证参数
	let plan_param = {
		'Scode': true,
		'student_id': true,
		'parent_mobile': true,
	};
	const {
		errors,
		isValid,
		trueList
	} = validator(plan_param, req.body);
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			nowTime
		})
	};

	// 2. 整理trueList
	let student_id = trueList.student_id;
	let parent_mobile = trueList.parent_mobile;

	// 3. 整理query参数
	let query = {
		'_id': student_id
	};

	// 4. studentDB数据库查找
	let err_msg = '';
	let err_data = '';
	studentDB.findOne(query).then((student) => {
		if (student === null) { // 
			err_msg = 'not_extsis';
			err_data = 'student_id不存在';
			throw new err('not_extsis')
		}
		if (!student.preParentsPhones.includes(parent_mobile)) { //
			err_msg = 'already_exists ';
			err_data = '手机号码未关联，无需删除。';
			throw new err('not_extsis')
		}
		if (student.adminParentMobile.toString() === parent_mobile) { //
			err_msg = 'update_fail';
			err_data = '当前手机号为管理员家长号码，无法删除';
			throw new err('update_fail')
		}

		// 5. userDB数据库查找
		return userDB.findOne({
			'mobile': parent_mobile
		})
	}).then((parent) => {
		let doc = null;
		let return_new = {
			'new': true
		};
		if (parent != null) {
			doc = { // 5.1 家长已注册，id也要移除
				'$pull': {
					'preParentsPhones': parent_mobile,
					'parents': parent._id
				}
			}
		} else {
			doc = { // 5.2 家长没有注册，只移除手机号
				'$pull': {
					'preParentsPhones': parent_mobile
				}
			}
		}

		// 6. 更新学生表
		return studentDB.findOneAndUpdate(query, doc, return_new)
	}).then((result) => {
		if (result === null) {
			err_msg = 'update_fail';
			err_data = '删除失败，请稍后再试';
			throw new err('update_fail')
		} else {
			res.json({
				msg: 'ok',
				info: 'update_done',
				data: result,
				nowTime,
			});
		}
	}).catch((err) => {
		//  4. 记录err

		return res.json({
			msg: 'no',
			info: err_msg === '' ? 'err' : err_msg,
			data: {
				'err': err_data === '' ? err : err_data
			},
			nowTime,
		});
	})



})


// 登录的时候验证验证码
router.post("/login_by_veryfiCode", (req, res) => {


	// 1. 验证参数
	let plan_param = {
		'Scode': true,
		'mobile': true,
		'truename': true,
		'veryfiCode': true,
		'cid': true,
	};
	const {
		errors,
		isValid,
		trueList
	} = validator(plan_param, req.body);
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			nowTime
		})
	};

	// 2. 整理trueList
	let student_id = trueList.student_id;
	let mobile = trueList.mobile;
	let truename = trueList.truename;
	let veryfiCode = trueList.veryfiCode;
	let cid = trueList.cid;

	// 3. 复核验证码
	let query = {
		mobile
	};
	let err_info = '';
	let date_info = '';
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
	let cur_user = null;
	let cur_students = null;
	let query_parent = '';
	veryfiCodeDB.findOne(query).then((the_code) => {
		if (the_code === null) {
			err_info = 'not_extsis'
			date_info = '当前手机号没有获取验证码，请获取'
			throw new Error('no such veryfiCode');
		}
		if (veryfiCode != the_code.veryfiCode) {
			err_info = 'not_extsis'
			date_info = '验证码错误，请核对修改后重新提交'
			throw new Error('no such veryfiCode');
		}
		if (veryfiCode === the_code.veryfiCode && the_code.time < Date.now()) {
			err_info = 'expired_data'
			date_info = '验证码已过期，请重新获取验证码'
			throw new Error('no such veryfiCode');
		}

		// 4. 验证码通过，根据手机号查找用户
		query = {
			mobile,
			'isShow': true
		};
		return userDB.findOne(query);
	}).then((user) => {
		if (user != null) { // 4.1 用户已注册。更新cid
			return userDB.findOneAndUpdate(query, {
				'clientId': cid
			}, {
				'new': true
			})
		} else { // 4.2 用户未注册，此时注册
			let newUser = new User();
			newUser.roleName = "学生家长";
			newUser.isShow = true;
			newUser.truename = truename;
			newUser.mobile = mobile;
			newUser.clientId = cid;
			return newUser.save();
		}
	}).then((user) => {
		if (user === null) {
			err_info = 'not_extsis'
			date_info = 'user不存在，请重新获取'
			throw new Error('no such user');
		}
		cur_user = user;

		// 5. 查找名下学生
		query = {
			"preParentsPhones": mobile
		}
		return studentDB.find(query); // ! 可能存在，一个家长手机号已经被预存到多个学生中。所以得使用find,而不是findOne
	}).then((students) => {
		cur_students = students;

		// 6. 更新普通家长信息
		query_parent = { // 只更新没有与用户关联的学生信息
			"$and": [{
					"preParentsPhones": mobile
				},
				{
					"parents": {
						"$ne": cur_user._id
					}
				}
			]
		};
		let doc = {
			'$push': {
				'parents': cur_user._id
			}
		};
		return studentDB.updateMany(query_parent, doc);
	}).then((update_parent) => {

		// 7. 更新管理员家长
		query_parent = { // 只更新没有与用户关联、并且没有管理员的的学生信息
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
		let doc = {
			'adminParentMobile': mobile,
			'adminParentId': cur_user._id
		};
		return studentDB.updateMany(query_parent, doc);
	}).then((update_admin) => {
		res.json({
			msg: "ok",
			info: 'got_it',
			data: {
				parent: cur_user,
				student: cur_students
			},
			nowTime,
		})

	}).catch((Error) => {
		return res.json({
			msg: 'no',
			info: err_info === '' ? Error : err_info,
			data: {
				Error: date_info === '' ? Error : date_info
			},
			nowTime,
		})
	})

});

// 根据家长信息获取名下所有学生的信息
router.post('/students_list', (req, res) => {
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');

	// 1. 验证参数
	let plan_param = {
		'Scode': true,
		'parent_id': false,
		'parent_mobile': false,
	};
	const {
		errors,
		isValid,
		trueList
	} = validator(plan_param, req.body);
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			nowTime
		})
	}

	// 2. 整理trueList
	let parent_id = trueList.parent_id;
	let parent_mobile = trueList.parent_mobile;
	if (parent_id === '' && parent_mobile === '') {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: trueList,
			nowTime
		})
	}

	// 3. 整理query参数
	let and_list = [];
	if (parent_id != '') {
		and_list.push({
			'parents': parent_id
		})
	}
	if (parent_mobile != '') {
		and_list.push({
			'preParentsPhones': parent_mobile
		})
	}
	let query = {
		'$and': and_list
	};

	// 4. studentDB数据库查找
	let err_msg = ''
	studentDB.find(query).then((students) => {
		if (students.length === 0) {
			res.json({
				msg: 'no',
				info: 'not_extsis',
				data: null,
				nowTime
			})
		} else {
			res.json({
				msg: 'ok',
				info: 'got_it',
				data: {
					students
				},
				nowTime
			})
		}

	}).catch((err) => {

		//  4. 记录err
		res.json({
			msg: 'no',
			info: 'err',
			data: err,
			nowTime
		});
	})

})

module.exports = router;
