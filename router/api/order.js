"use strict";
const express = require("express");
const router = express.Router();
const moment = require('moment')
const config = require('../../config.js');
const Helper = require("../../common/helper");
const orderDB = require("../../models/orderModel")
const studentDB = require("../../models/studentModel")

// 测试接口是否连通 start ↓
router.get("/test", (req, res) => {
	res.json({
		msg: "hello order"
	})
});

// 获取订单信息
router.post("/order_list", (req, res) => {

	// 只获取生效的订单 "status" : "_paid"

	let Scode = req.body.Scode;
	let studnet_mobile = req.body.studnet_mobile; // 学生手机号 必填
	let user_mobile = req.body.user_mobile; // 家长手机号 可选
	// let trade_type = req.body.trade_type; // 支付方式 可选
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS')


	// 1. 参数验证
	let param_pass = true;
	let param_err = '';

	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		param_pass = false;
		param_err = 'Scode错误';
	};
	param_pass = Helper.checkTel(studnet_mobile) == true ? false : true;

	// 1.1 验证可选参数
	if (user_mobile != undefined) {
		param_pass = Helper.checkTel(user_mobile) == true ? false : true;
	}
	// if (trade_type != undefined) {
	// 	param_pass = Helper.checkReal(trade_type) == true ? false : true;
	// }

	if (!param_pass) {
		param_err = param_err == '' ? '参数错误' : param_err;
		return res.json({
			msg: 'no',
			info: 'param_wrong',
			data: param_err,
			nowTime
		})
	}
	
	// 2. 根据学生手机号，查询学生id
	res.json({
		msg: 'yes',
		info: 'got_it',
		data: 'data',
		nowTime
	})



})


module.exports = router;
