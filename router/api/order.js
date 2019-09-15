"use strict";
const express = require("express");
const router = express.Router();
const moment = require('moment');
const config = require('../../config.js');
const Helper = require("../../common/helper");
const orderDB = require("../../models/orderModel")
const studentDB = require("../../models/studentModel")
const validator = require('../../validator/index');

// 测试接口是否连通 start ↓
router.get("/test", (req, res) => {
	res.json({
		msg: "hello order"
	})
});

// 获取订单信息
router.post("/order_list", (req, res) => {

	// 只获取生效的订单 "status" : "_paid"
	// studnet_id 必选；user_mobile 可选
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')

	// 1. 验证参数
	// 1. 验证参数

	let plan_param = { // 1.1 计划要验证的参数和是为必须
		'Scode': true,
		'studnet_id': true,
		'studnet_mobile': false,
		'user_mobile': false,
	}
	const {
		errors,
		isValid,
		trueList
	} = validator(plan_param, req.body);

	// 2. 判断参数
	if (!isValid) {
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: errors,
			nowTime
		})
	}

	// 3. 整理参数
	let Scode = trueList['Scode'];
	let studnet_id = trueList['studnet_id']; // 学生Id 必填
	let studnet_mobile = 'studnet_mobile' in trueList ? trueList['studnet_mobile'] : ''; // 学生手机号 选填
	let user_mobile = 'user_mobile' in trueList ? trueList['user_mobile'] : ''; // 家长手机号 可选

	// 4. 整理查找学生query参数
	let query_list = [];
	query_list.push({
		'_id': studnet_id
	}, {
		'isShow': true
	});
	if (studnet_mobile != '') {
		query_list.push({
			'mobile': studnet_mobile
		});
	}
	let query = {
		'$and': query_list
	}

	// 5. studentDB查找学生
	let err_info = ''; // ！下面的过程中，如果有数据库没有数据的情况，用throw err的方式处理。但是要和实际的throw err做区别
	studentDB.find(query).then((student) => {
		if (student.length === 0) {
			err_info = 'not_extsis'
			throw new Error('no such user');
		}
		return student;
	}).then((student) => {

		// 6. orderDB查找订单
		query = {
			'$and': [{
					'studentId': studnet_id
				},
				{
					'status': '_paid'
				}
			]
		};
		return orderDB.find(query)
	}).then((order) => {

		// 7. 根据order实际情况返回数据
		if (order.length === 0) {
			err_info = 'not_extsis'
			throw new Error('no such order');
		}
		res.json({
			msg: 'yes',
			info: 'got_it',
			data: order,
			nowTime,
		})

	}).catch((Error) => {
		return res.json({
			msg: 'no',
			info: err_info === '' ? 'err' : err_info,
			data: Error,
			nowTime,
		})
	})

})


module.exports = router;
