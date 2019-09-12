'use strict';
const express = require('express');
const router = express.Router();
const config = require('../../config.js')
const Helper = require('../../common/helper');
var teacherDB = require('../../models/teacherModel')
// 根据预设家长号查找学生
router.post('/teacher_add', (req, res) => {
	let Scode = req.body.Scode;
	let mobile = req.body.mobile;
	let name = req.body.name;

	// 1. 参数验证 
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: 'Scode错误'
		})
	};
	if (Helper.checkTel(mobile) || Helper.checkReal(name)) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: '参数不合法'
		})
	};


	let query = {
		mobile
	};
	let info = '';

	// 2. 通过手机号查询用户是否已注册


	teacherDB.find(query).then((teacher) => {

		if (teacher.length != 0) {

			// 2.1 已经注册，获取已注册的用户信息
			info = 'already_exists';
			return teacher

		} else {

			// 2.2 没有注册，注册新用户
			let newTeacher = new teacherDB();
			newTeacher.mobile = mobile;
			newTeacher.class_id = '';
			newTeacher.name = name;
			newTeacher.creat_at = Date.now();
			info = 'recently_saved';
			return newTeacher.save()

		}
	}).then((result) => {

		// 3. 返回数据
		return res.json({
			msg: 'yes',
			info,
			data: result
		});

	}).catch((err) => {

		//  4. 记录err
		return res.json({
			msg: 'no',
			info: 'err',
			data: err,
		});

	})


})

module.exports = router;
