"use strict";
const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const config = require("../../config.js");
const crypto = require('crypto');
const AlipaySdk = require('alipay-sdk').default;
const moment = require('moment');

const orderDB = require("../../models/orderModel.js");
const studentDB = require("../../models/studentModel.js");
const Helper = require('../../common/helper');
const payHelper = require('../../common/payHelper');

// 测试接口是否接通
router.post("/test", (req, res) => {
	let Scode = req.body.Scode;
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	res.json({
		msg: "hello q"
	})
})

// 获取交易字符串，用来发起交易
router.post("/getTradeString", (req, res) => {
	let nowTime = moment().format('YYYY-MM-DD HH:mm:ss.SSS');
	// 1. 检查参数
	let Scode = req.body.Scode;
	let out_trade_no = req.body.out_trade_no;
	let goods_item = req.body.goods_item;
	let trade_type = req.body.trade_type;

	let user_id = req.body.user_id;
	let user_mobile = req.body.user_mobile;
	let student_id = req.body.student_id;

	let subject = req.body.goods_item.subject;
	let total_amount = req.body.goods_item.price;


	if (Helper.checkReal(subject)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数subject"
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 新建订单会新建订单号，用户重新支付未支付订单，会仍然使用旧的订单号。todo
	if (out_trade_no == "" && trade_type == "alipay") {
		out_trade_no = payHelper.getOrderByType("AL");
	}

	// 2. 获取交易字符串
	let tradeString = payHelper.getAlipayTradeString(out_trade_no, subject, total_amount);

	if (tradeString === "") {
		return res.status(403).json({
			msg: "no",
			data: "未能取得交易字符串",
			nowTime
		})
	} else {


		let newOrder = new orderDB();
		newOrder.goods_item = goods_item;
		newOrder.trade_type = trade_type;
		newOrder.out_trade_no = out_trade_no;
		newOrder.user_id = user_id;
		newOrder.user_mobile = user_mobile;
		newOrder.student_id = student_id;

		newOrder.save().then((result) => {
			res.json({
				msg: 'ok',
				info: 'got_it',
				data: tradeString,
				nowTime
			})

		}).catch((err) => {

			//  4. 记录err
			res.json({
				msg: 'no',
				info: err,
				data: null,
				nowTime
			});
		})
	}
});

// 接受支付供应商异步通知
router.post("/notify", (req, res) => {
	// 1. 验签
	const alipaySdk = new AlipaySdk({
		appId: '2019082666450460',
		privateKey: fs.readFileSync('./static/app_private_key.pem', 'ascii'),
		alipayPublicKey: fs.readFileSync('./static/app_public_key.pem', 'ascii'),
	});
	let postdata = null;
	postdata = req.body;
	let checkResult = alipaySdk.checkNotifySign(postdata); // 返回true或false

	// 2. 通过验签
	if (checkResult) {
		let out_trade_no = req.body.out_trade_no;
		let condition = {
			"$and": [{
					"out_trade_no": out_trade_no
				},
				{
					"status": "_created"
				},
				{
					"pay_return": []
				}
			]
		};
		let doc = {
			status: "_paid",
			pay_return: postdata,
			efftiveDate: Date.now()
		};
		let return_new = {
			'new': true
		}

		// 3. 更新订单，并且更新学生的设备可用时间		
		orderDB.findOneAndUpdate(condition, doc, return_new).then((update_order) => { // 3.1 更新订单
			if (update_order === null) {
				// todo
				throw new err('no_order')
			}

			let student_id = update_order.
			studentDB.findOneAndUpdate


		})


		orderDB.updateOrderAndStudentDevice(condition, doc, function(err, result) {
			if (err) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err
				})
			};
			if (result.msg == "no") {
				console.log("failure1")
				return res.json("failure")
			}
			console.log("success")
			res.json("success")
		})
	} else {
		console.log("failure2")
		res.json("failure")
	}
});

// 接受支付供应商异步通知
router.post("/notifyTest", (req, res) => {

	let postdata = req.body;
	let out_trade_no = req.body.out_trade_no;

	let checkResult = true;
	if (checkResult) {
		// 更新order 和 student


		// 查找条件
		let condition = {
			"$and": [{
					"out_trade_no": out_trade_no
				},
				{
					"status": "_created"
				},
				{
					"pay_return": []
				}
			]
		};

		// 待更新内容
		let doc = {
			status: "_paid",
			pay_return: postdata,
			efftiveDate: Date.now()
		};

		//更新订单，并且更新学生的设备时间
		orderDB.updateOrderAndStudentDevice(condition, doc, function(err, result) {
			if (err) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err
				})
			};
			if (result.msg == "no") {
				return res.json("failure")
			}
			res.json("success")
		})
	} else {
		res.json("failure")
	}
})





module.exports = router;
