"use strict";
const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const config = require("../../config.js");
const crypto = require('crypto');
const AlipaySdk = require('alipay-sdk').default;

const orderDB = require("../../models/orderModel.js");
const Helper = require('../../common/helper');
const payHelper = require('../../common/payHelper');


router.get("/test", (req, res) => {
	res.json({
		msg: "hello q"
	})
})

router.post("/getTradeString", (req, res) => {

	// 复核字段
	let Scode = req.body.Scode;
	let out_trade_no = req.body.out_trade_no;
	let goods_item = req.body.goods_item;
	let trade_type = req.body.trade_type;

	let userId = req.body.userId;
	let mobile = req.body.mobile;
	let studentId = req.body.studentId;

	let subject = req.body.goods_item.subject;
	let total_amount = req.body.goods_item.price;


	if (Helper.checkReal(subject)) {
		return res.status(400).json({
			msg: "no",
			data: "缺少参数subject"
		})
	};
	if (Helper.checkReal(Scode) || Scode != config.Scode) {
		console.log(config.Scode)
		return res.status(400).json({
			msg: "no",
			data: "Scode错误"
		})
	};
	// 新建订单会新建订单号，用户重新支付未支付订单，会仍然使用旧的订单号。
	if (out_trade_no == "" && trade_type == "alipay") {
		out_trade_no = payHelper.getOrderByType("AL");
	}

	// 获取交易字符串
	let tradeString = payHelper.getAlipayTradeString(out_trade_no, subject, total_amount);

	if (tradeString == "") {
		return res.status(403).json({
			msg: "no",
			data: "未能取得交易字符串"
		})
	} else {
		let postData = {
			goods_item: goods_item,
			trade_type: trade_type,
			out_trade_no: out_trade_no,
			userId: userId,
			mobile: mobile,
			studentId: studentId
		};
		orderDB.SaveNew(postData, function(err, doc) {
			if (err) {
				return res.status(500).json({
					msg: "no",
					data: "服务器内部错误,请联系后台开发人员!!!" + err
				})
			}
			res.json({
				msg: "ok",
				data: tradeString
			})
		})

	}

});

// 回调地址
router.post("/notify", (req, res) => {
	const alipaySdk = new AlipaySdk({
		appId: '2019082666450460',
		privateKey: fs.readFileSync('./static/app_private_key.pem', 'ascii'),
		alipayPublicKey: fs.readFileSync('./static/app_public_key.pem', 'ascii'),
	});

	let postdata = null;
	postdata = req.body;

	let checkResult = alipaySdk.checkNotifySign(postdata);
	// let checkResult = true;
	if (checkResult) {
		console.log("ok")
		res.json("success")
	} else {
		console.log("failure")
		res.json("failure")
	}
})
module.exports = router;
