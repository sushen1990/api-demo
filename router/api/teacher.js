'use strict';
const express = require('express');
const router = express.Router();
const moment = require('moment');

const config = require('../../config')
const Helper = require('../../common/helper');
const validator = require('../../validator/index');

const teacherDB = require('../../models/teacherModel')


// 添加老师
router.post('/teacher_add', (req, res) => {
	let now_time = Helper.NowTime();
	// 0. 参数验证
	let plan_list = { // 计划要验证的参数和是否必须
		'name': true,
		'mobile': true,
		'Scode': true
	};
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_list, req.body)
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			now_time
		})
	}

	let mobile = true_list.mobile;
	let name = true_list.name;

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
		console.log(result)
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

// 获取教师分页信息
router.post('/teacher_list_page', (req, res) => {
	let now_time = Helper.NowTime();
	
	// 0. 参数验证
	let plan_list = { // 计划要验证的参数和是否必须
		'Scode': true,
		'size': true,
		'page': true,
	};
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_list, req.body)
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			now_time
		})
	}
	// 0.1 必须可以转换为int类型
	let size = parseInt(true_list['size']);
	let page = parseInt(true_list['page']);
	if (size % 1 != 0 || page % 1 != 0 || page === 0 || size === 0) {
		return res.json({
			'msg': 'no',
			'info': 'param_wrong',
			'data': 'page、size 必须为int',
			now_time
		})
	}

	
	// 1. 查询
	let query = {
		'is_show': true
	};
	
	teacherDB.find(query).limit(size).skip((page - 1) * size).sort({
		_id: -1
	}).then((result) => {
		res.json({
			'msg': 'ok',
			'info': 'got_it',
			'data': result,
			'count': result.length,
			now_time
		})
	}).catch((err) => {
	
		//  4. 记录err
		res.json({
			'msg': 'no',
			'info': info === '' ? err : info,
			'data': null,
			now_time
		});
	})
})

// 修改老师信息
router.post('/teacher_update', (req, res) => {
	let now_time = Helper.NowTime();
	// 0. 参数验证
	let plan_list = { // 计划要验证的参数和是否必须
		'new_name': true,
		'mobile': true,
		'Scode': true
	};
	const {
		errors,
		isValid,
		true_list
	} = validator(plan_list, req.body)
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			now_time
		})
	}

	let mobile = true_list.mobile;
	let new_name = true_list.new_name;
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
				now_time
			});
		}
		res.json({
			msg: 'ok',
			info: 'update_done',
			data: result,
			now_time
		});
	}).catch((err) => {

		//  4. 记录err
		res.json({
			msg: 'no',
			info: 'no',
			data: null,
			now_time
		});
	})
})





module.exports = router;
