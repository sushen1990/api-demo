'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');
const config = require('../../config.js')
const Helper = require('../../common/helper');
const teacherDB = require('../../models/teacherModel')


// 添加老师
router.post('/teacher_add', (req, res) => {
	let Scode = req.body.Scode === undefined ? '' : req.body.Scode.trim();
	let mobile = req.body.mobile === undefined ? '' : req.body.mobile.trim();
	let name = req.body.name === undefined ? '' : req.body.name.trim();


	// 1. 验证参数
	if (Helper.checkReal(Scode) || Scode != config.Scode) { // 1. 参数验证 
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

	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
	let query = {
		mobile
	};
	let info = '';

	// 2. 通过手机号查询用户是否已注册
	teacherDB.findOne(query).then((teacher) => {
		if (teacher != null) { // 2.1 已经注册，获取已注册的用户信息
			info = 'already_exists';
			throw new Error('already_exists')
		}
		let newTeacher = new teacherDB(); // 2.2 没有注册，注册新用户
		newTeacher.mobile = mobile;
		newTeacher.class_id = '';
		newTeacher.name = name;
		newTeacher.creat_at = Date.now();
		info = 'recently_saved';
		return newTeacher.save();

	}).then((result) => { // ！此处的result，是上面两种情况依据实际二选一返回的数据。

		// 3. 返回数据
		res.json({
			msg: 'ok',
			info,
			data: result
		});
	}).catch((err) => {

		//  4. 记录err
		res.json({
			msg: 'no',
			info: info === '' ? err : info,
			data: null,
		});
	})
})

// 修改老师信息
router.post('/teacher_update', (req, res) => {
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')
	let Scode = req.body.Scode === undefined ? '' : req.body.Scode.trim();
	let mobile = req.body.mobile === undefined ? '' : req.body.mobile.trim();
	let new_name = req.body.new_name === undefined ? '' : req.body.new_name.trim();

	// 1. 验证参数
	if (Helper.checkReal(Scode) || Scode != config.Scode) { // 1. 参数验证 
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: 'Scode错误'
		})
	};
	if (Helper.checkTel(mobile) || Helper.checkReal(new_name)) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: '参数不合法'
		})
	};
	let condition = {
		mobile,
		'is_show': true
	};
	let doc = {
		'name': new_name,
		'update_at': Date.now()
	}
	let return_new = {
		'new': true
	}

	// 2. 查找并更新
	teacherDB.findOneAndUpdate(condition, doc, return_new).then((result) => {
		// teacherDB.updateMany(condition, doc).then((result) => {

		// 3. 返回数据
		if (result === null) {
			return res.json({
				msg: 'no',
				info: 'no_data',
				data: null,
				nowTime
			});
		}
		res.json({
			msg: 'ok',
			info: 'update_done',
			data: result,
			nowTime
		});
	}).catch((err) => {

		//  4. 记录err
		res.json({
			msg: 'no',
			info: 'no',
			data: null,
			nowTime
		});
	})
})

module.exports = router;
  