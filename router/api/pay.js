"use strict";
const express = require("express");
const router = express.Router();
const path = require('path');
const fs = require('fs');
const crypto = require('crypto');
const AlipaySdk = require('alipay-sdk').default;

const Helper = require('../../common/helper');
const payHelper = require('../../common/payHelper');


router.get("/test", (req, res) => {
	res.json({
		msg: "hello q"
	})
})

router.get("/getOrderInfo", (req, res) => {

	const out_trade_no = Helper.getPayOrderNo("AL");
	// const body = "校安通服务费1年";
	const total_amount = 0.02;
	var orderInfo = "";
	orderInfo = payHelper.getAlipayOrderInfo(out_trade_no, total_amount)

	if (orderInfo == "") {
		return res.status(401).json({
			msg: "no",
			data: null
		})
	} else {
		res.json({
			msg: "ok",
			data: orderInfo
		})
	}

});

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
		res.json("success")
	} else {
		res.json("failure")
	}
})
module.exports = router;
