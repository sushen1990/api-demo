'use strict';
const express = require("express");
const router = express.Router();
const classDB = require("../../models/classModel.js")
const config = require("../../config.js")
const Helper = require('../../common/helper');

// 测试接口是否连通
router.get("/test", (req, res) => {
	res.json({
		msg: "hello class"
	})
});

router.post("/classSave", (req, res) => {

	let Scode = req.body.Scode;
	let schoolId = req.body.schoolId;
	let schoolName = req.body.schoolName;

	let grade = req.body.grade;
	let _class = req.body._class;


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
	if (Helper.checkReal(grade)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数grade"
		})
	}
	if (Helper.checkReal(_class)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数_class"
		})
	}
	if (schoolId.length != 24) {
		return res.status(400).json({
			msg: "no",
			data: "schoolID长度应为24位"
		})
	}

	// 参数验证 end   ↑

	let whereStr = {
		schoolId: schoolId,
		grade: grade,
		_class: _class,
		isShow: true
	}

	classDB.findClassByStr(
		whereStr,
		function(err, doc) {
			if (err) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!"
				})
			}
			// 去重查询 start ↓
			if (doc) {
				return res.status(403).json({
					msg: "",
					data: "当前班级已注册"
				})
			}
			// 去重查询 end   ↑ 

			// 保存class信息到数据库 start ↓
			let className = grade + '年级' + _class + '班';
			const postData = {
				schoolId: schoolId,
				schoolName: schoolName,
				grade: grade,
				_class: _class,
				className: className,
			}
			classDB.classSave(postData, function(err, result) {
				if (err) {
					return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!"
					})
				}
				if (result) {
					let data = result;
					res.json({
						msg: "ok",
						data: data
					})
				}
			})

			// 保存class信息到数据库 end   ↑		

		}
	);







});







module.exports = router;
