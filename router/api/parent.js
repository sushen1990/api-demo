'use strict';
const express = require("express");
const router = express.Router();
const studentDB = require("../../models/studentModel.js")
const userDB = require("../../models/userModel.js")
const config = require("../../config.js")
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

// 根据手机号添加家长
router.post("/parentAdd", (req, res) => {
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


		let mobileList = result.preParentsPhones; // 验证手机号是否已添加
		if (mobileList.includes(mobile)) {
			return res.status(200).json({
				msg: "no",
				data: "当前手机号已经存在，无需重复添加！"
			});
		};


		if (mobileList.length == 4) { // 家长列表只允许有4个
			return res.status(200).json({
				msg: "no",
				data: "家长手机号只允许保存4个！！"
			});
		};

		// 查询手机号是否已注册，如果已注册的话，用户id同步到学生表中
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
					'$push': {
						preParentsPhones: mobile,
						parents: result1._id
					}
				}
			} else { // 用戶没有注册
				doc = {
					'$push': {
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

// 根据手机号删除家长。
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

module.exports = router;
