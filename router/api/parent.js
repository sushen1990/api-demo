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

// 根据家长id获取学生信息，如有必要同步到学生表中
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
		studentDB.findStudentByWhereStr(condition, function(err1, result1) {
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


module.exports = router;
